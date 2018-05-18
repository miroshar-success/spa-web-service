import {Model} from 'mongoose';
import {Component, HttpStatus, Inject, HttpException} from '@nestjs/common';

import {FetchExploreSelectorModel, FetchModel} from "./fetch.model";
import {FetchClientName, FetchState} from "./fetch.enums";
import * as Agenda from "agenda";
import PersonModel from "../person/schemas/person.schema";
import {ScannerService} from "../scanner/scanner.service";

import {async} from "rxjs/scheduler/async";
import {ScannerClientMq} from "./scanner.client.mq";
import {FetchDtoMq, FetchExploreScannerDto, FetchExploreScannerResultDto} from "./fetch.dto.mq";
import {Connection} from "amqplib";

@Component()
export class FetchService {

    private static FETCH_WATCH_JOB_NAME: string = "fetchWatcherJob";
    private static FETCH_WATCH_JOB_REPEAT_TIME: string = '10 seconds';

    private static FETCH_REINIT_MQ_PERIOD: number = 60000;

    constructor(@Inject('fetchModelToken') private readonly fetchModel: Model<FetchModel>,
                @Inject('agendaModelToken') private readonly agenda: Agenda,
                private readonly scannerClientMq: ScannerClientMq) {
        this.initFetchWatcher();
    }

    // fetchExplore request
    public async fetchExploreCreate(clientName, personKey, fetchUrl) {

        // get current job if exists
        let currentFetchModel = await this.getFetch(personKey, clientName, fetchUrl);

        if (currentFetchModel != null) {
            // TODO MOVE METHOD TO DATA SERVICE
            await this.fetchModel.deleteOne({_id: currentFetchModel._id}).exec();
        }

        currentFetchModel = await this.fetchModel({
            clientName: clientName,
            personKey: personKey,
            fetchUrl: fetchUrl,
            createDate: Date.now(),
            state: FetchState.new,
        }).save();

        let fetchId: string = currentFetchModel._id.toString();
        this.scannerClientMq.fetchExploreProduce({fetchId: fetchId, fetchUrl: fetchUrl})

    }

    public async fetchExploreResultConsumer(fetchExploreScannerResultDto: FetchExploreScannerResultDto) {

        // TODO MOVE METHOD TO DATA SERVICE
        let fetchModel: FetchModel = await this.fetchModel.findOne({"_id": fetchExploreScannerResultDto.fetchId});
        await  this.fetchModel.updateOne(fetchModel, {
            $set: {
                selectors: fetchExploreScannerResultDto.selectors,
                state: FetchState.init
            }
        }).exec();

        // FIXME SEND TO CONSUMER
    }


    public async fetch(personKey: string, clientName: FetchClientName, fetchUrl: string, sampleUrl: string) {

        // get current job if exists
        let fetchModel = await this.getFetch(personKey, clientName, fetchUrl);
        if (!fetchModel || fetchModel.state != FetchState.init) {
            // TODO ADD CUSTOM ERROR
            throw new Error('model not found or wrong state');
        }

        let selectors: FetchExploreSelectorModel[] = fetchModel.selectors;

        if (!selectors || selectors.length < 1) {
            // TODO ADD CUSTOM ERROR
            throw new Error('selector not found');
        }

        let selectorModel = selectors.find(selector => selector.sampleUrl == sampleUrl);

        if (!selectorModel == null && selectorModel.selector) {
            // TODO ADD CUSTOM ERROR
            throw new Error('selector not found');
        }

        // TODO MOVE TO DATA SERVICE
        await this.fetchModel.updateOne(fetchModel, {
            $set: {
                selector: selectorModel.selector,
                state: FetchState.active,
                selectors: [],
                updateDate: new Date(-8640000000000000)
            }
        }).exec();

    }

    // // delete fetch
    // public async fetchDelete(fetchExploreDto: FetchExploreDto) {
    //     let personKey: string = fetchExploreDto.person.personKey;
    //     let clientName: FetchClientName = fetchExploreDto.clientName;
    //     let fetchUrl: string = fetchExploreDto.fetchUrl;
    //
    //     // TODO MERGE USER IN USER SERVICE
    //
    //     // get current job if exists
    //     let currentFetchModel = await this.fetchModel.findOne({
    //         'personKey': personKey,
    //         'clientName': clientName,
    //         'fetchUrl': fetchUrl
    //     }).exec();
    //
    //
    //     if (currentFetchModel == null) {
    //         throw new HttpException("", HttpStatus.FORBIDDEN);
    //     }
    //
    //     this.fetchModel.delete(currentFetchModel);
    //
    // }
    //

    // public async getUserFetch(personFetchDto: PersonFetchDto): Promise<FetchExploreDto[]> {
    //
    //     let personKey: string = personFetchDto.person.personKey;
    //     let clientName: FetchClientName = personFetchDto.clientName;
    //
    //     let userFetches: FetchModel[] = await this.getUserFetches(personKey, clientName);
    //
    //     return userFetches.map(value => {
    //         return {
    //             clientName: clientName,
    //             person: personFetchDto.person,
    //             fetchUrl: value.fetchUrl
    //         }
    //     })
    // }
    //
    // /** PRIVATE METHODS **/
    //

    // TODO MOVE TO DATA SERVICE
    private async getFetch(personKey: string, clientName: FetchClientName, fetchUrl: string): Promise<FetchModel> {
        return this.fetchModel.findOne({
            'personKey': personKey,
            'clientName': clientName,
            'fetchUrl': fetchUrl
        }).exec();
    }

    //
    // private async getUserFetches(personKey: string, clientName: FetchClientName) {
    //     // get current job if exists
    //     let currentFetchModel = await this.fetchModel.find({
    //         'personKey': personKey,
    //         'clientName': clientName
    //     }).exec();
    //     return currentFetchModel;
    // }

    // private async fetchExploreResultConsumer(channel: Channel) {
    //     channel.consume(FetchService.FETCH_EXPLORE_MQ_NAME, function (msg) {
    //         if (msg !== null) {
    //             console.log(msg.content.toString());
    //         }
    //     });
    // }

    // private async callFetchExploreChanel(callFunction: (arg: Channel) => void) {
    //     if (this.fetchExploreChanel == null) {
    //         let fetchExploreChanel: Channel = await this.connection.createChannel();
    //         fetchExploreChanel.assertQueue(FetchService.FETCH_EXPLORE_MQ_NAME);
    //         this.fetchExploreChanel = fetchExploreChanel;
    //     }
    //     callFunction(this.fetchExploreChanel);
    // }

    private async initFetchWatcher() {

        this.agenda.define(FetchService.FETCH_WATCH_JOB_NAME, async (job, done) => {
            await this.initWatch(new Date(Date.now() - FetchService.FETCH_REINIT_MQ_PERIOD));
            done();
        });

        this.agenda.on('ready', () => {
            this.agenda.every(FetchService.FETCH_WATCH_JOB_REPEAT_TIME, FetchService.FETCH_WATCH_JOB_NAME);
        })

    }

    private async initWatch(initDate: Date) {
        let currentFetches: FetchModel[] = await this.fetchModel.find({
            'state': FetchState.active,
            'updateDate': {"$lt": initDate}
        }).sort({'updateDate': -1}).limit(100).exec();

        if (currentFetches && currentFetches.length > 0) {

            // init watch and
            currentFetches.forEach(fetch => {

                let fetchId: string = fetch._id;
                let fetchUrl: string = fetch.fetchUrl;
                let selector: string = fetch.selector;
                let lastResult: string = fetch.lastResult[0];

                this.scannerClientMq.fetchProduce(
                    {
                        fetchId: fetchId,
                        fetchUrl: fetchUrl,
                        selector: selector,
                        lastResult: lastResult
                    });

                this.fetchModel.updateOne(fetch, {$set: {updateDate: new Date()}}).exec();

            })

            this.initWatch(initDate);
        }
    }


}
