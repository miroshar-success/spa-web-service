import {Model} from 'mongoose';
import {Body, Component, HttpStatus, Inject, HttpException, Post} from '@nestjs/common';

import {Channel, connect, Connection} from 'amqplib';
import {FetchDto, FetchExploreDto, PersonFetchDto} from "./fetch.dto";
import {FetchExploreSelectorModel, FetchModel} from "./fetch.model";
import {FetchClientName, FetchState} from "./fetch.enums";
import {FetchExploreMqDto} from "./fetch.mq.dto";
import * as Agenda from "agenda";
import PersonModel from "../person/schemas/person.schema";
import {ScannerService} from "../scanner/scanner.service";
import {SampleList} from "../scanner/scanner.csspath";

@Component()
export class FetchService {

    public static FETCH_EXPLORE_MQ_NAME = "fetch.explore";

    public static FETCH_WATCH_JOB_NAME: string = "fetchWatcherJob";

    private fetchExploreChanel: Channel;

    // TODO ADD HANDLER OF THIS CHANEL WITH SELECTORS OF USER
    public static FETCH_EXPLORE_RESULT_MQ_NAME = "fetch.explore.result";
    private fetchExploreResultChanel: Channel;

    constructor(@Inject('rabbitMqConnection') private readonly connection: Connection,
                @Inject('fetchModelToken') private readonly fetchModel: Model<FetchModel>,
                @Inject('agendaModelToken') private readonly agenda: Agenda,
                private readonly scannerService: ScannerService) {
        // init consumer
        this.callFetchExploreChanel(this.fetchExploreResultConsumer);

        this.initFetchWatcher();

    }

    // init new fetch
    public async fetchExploreCreate(fetchExploreDto: FetchExploreDto) {

        let personKey: string = fetchExploreDto.person.personKey;
        let clientName: FetchClientName = fetchExploreDto.clientName;
        let fetchUrl: string = fetchExploreDto.fetchUrl;

        // get current job if exists
        let currentFetchModel = await this.getFetch(personKey, clientName, fetchUrl);

        // FIXME UNCOMMENT
        // if (currentFetchModel != null) {
        //     throw new HttpException('fetch already exists', HttpStatus.FORBIDDEN);
        // }

        currentFetchModel = await this.fetchModel({
            clientName: clientName,
            personKey: personKey,
            fetchUrl: fetchUrl,
            createDate: Date.now(),
            state: FetchState.new,
        }).save();

        // FIXME SEND TO MQ
        // sent new message to fetch.explore

        let fetchId = currentFetchModel._id;

        //
        // let fetchExploreMqDto: FetchExploreMqDto = <FetchExploreMqDto>{
        //     clientName: clientName,
        //     fetchId: fetchId,
        //     fetchUrl: fetchUrl
        // };
        //
        // //sent message to queue
        // this.callFetchExploreChanel(channel => {
        //     channel.sendToQueue(FetchService.FETCH_EXPLORE_MQ_NAME, new Buffer(JSON.stringify(fetchExploreMqDto)));
        // })

        // method from mq processor
        let sampleList: SampleList = await this.scannerService.fetchAll(fetchUrl);

        let selectors: FetchExploreSelectorModel[] = sampleList.sample.map(value => {
            return {sampleUrl: value.sampleUrl[0], selector: value.selector};
        })

        // TODO move to another method
        let preInitFetchModel: FetchModel = await this.fetchModel.find({"_id": fetchId});
        preInitFetchModel.updateDate = new Date();
        preInitFetchModel.state = FetchState.active;
        preInitFetchModel.selectors = selectors;
        this.fetchModel(preInitFetchModel).save();

    }

    // delete fetch
    public async fetchDelete(fetchExploreDto: FetchExploreDto) {
        let personKey: string = fetchExploreDto.person.personKey;
        let clientName: FetchClientName = fetchExploreDto.clientName;
        let fetchUrl: string = fetchExploreDto.fetchUrl;

        // TODO MERGE USER IN USER SERVICE

        // get current job if exists
        let currentFetchModel = await this.fetchModel.findOne({
            'personKey': personKey,
            'clientName': clientName,
            'fetchUrl': fetchUrl
        }).exec();


        if (currentFetchModel == null) {
            throw new HttpException("", HttpStatus.FORBIDDEN);
        }

        this.fetchModel.delete(currentFetchModel);

    }

    // apply fetch
    public async fetch(fetch: FetchDto) {

        let personKey: string = fetch.person.personKey;
        let clientName: FetchClientName = fetch.clientName;
        let fetchUrl: string = fetch.fetchUrl;
        let sampleUrl: string = fetch.sampleUrl;

        // get current job if exists
        let targetFetchModel = await this.getFetch(personKey, clientName, fetchUrl);

        if (!targetFetchModel) {
            // TODO ADD CUSTOM EXCEPTIONS
            throw new HttpException('error targetFetchModel is null', HttpStatus.FORBIDDEN);
        }

        let selectors: FetchExploreSelectorModel[] = targetFetchModel.selectors;

        if (!selectors || selectors.length < 1) {
            throw new HttpException('selector not found', HttpStatus.FORBIDDEN);
        }

        let selectorModel = selectors.find(selector => selector.sampleUrl == sampleUrl);

        if (selectorModel && selectorModel.selector) {
            targetFetchModel.selector = selectorModel.selector;
            targetFetchModel.state = FetchState.active;
            this.fetchModel(targetFetchModel).save();
        }
        else {
            throw new HttpException('selector not found', HttpStatus.FORBIDDEN);
        }

    }

    public async getUserFetch(personFetchDto: PersonFetchDto): Promise<FetchExploreDto[]> {

        let personKey: string = personFetchDto.person.personKey;
        let clientName: FetchClientName = personFetchDto.clientName;

        let userFetches: FetchModel[] = await this.getUserFetches(personKey, clientName);

        return userFetches.map(value => {
            return {
                clientName: clientName,
                person: personFetchDto.person,
                fetchUrl: value.fetchUrl
            }
        })
    }

    /** PRIVATE METHODS **/

    private async getFetch(personKey: string, clientName: FetchClientName, fetchUrl: string): Promise<FetchModel> {
        let targetFetchModel: FetchModel = await this.fetchModel.findOne({
            'personKey': personKey,
            'clientName': clientName,
            'fetchUrl': fetchUrl
        }).exec();
        return targetFetchModel;
    }

    private async getUserFetches(personKey: string, clientName: FetchClientName) {
        // get current job if exists
        let currentFetchModel = await this.fetchModel.find({
            'personKey': personKey,
            'clientName': clientName
        }).exec();
        return currentFetchModel;
    }

    private async fetchExploreResultConsumer(channel: Channel) {
        channel.consume(FetchService.FETCH_EXPLORE_MQ_NAME, function (msg) {
            if (msg !== null) {
                console.log(msg.content.toString());
            }
        });
    }

    private async callFetchExploreChanel(callFunction: (arg: Channel) => void) {
        if (this.fetchExploreChanel == null) {
            let fetchExploreChanel: Channel = await this.connection.createChannel();
            fetchExploreChanel.assertQueue(FetchService.FETCH_EXPLORE_MQ_NAME);
            this.fetchExploreChanel = fetchExploreChanel;
        }
        callFunction(this.fetchExploreChanel);
    }

    private async initFetchWatcher() {
        this.agenda.define(FetchService.FETCH_WATCH_JOB_NAME, function (job, done) {


            done();
        });
        this.agenda.every('10 seconds', FetchService.FETCH_WATCH_JOB_NAME);
    }

}
