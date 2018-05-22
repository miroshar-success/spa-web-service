import {Model} from 'mongoose';
import {Component, HttpStatus, Inject, HttpException} from '@nestjs/common';

import {FetchExploreSelectorModel, FetchModel} from "./fetch.model";
import {FetchState} from "./fetch.enums";
import * as Agenda from "agenda";


import {async} from "rxjs/scheduler/async";
import {ScannerClient} from "./scanner.client";
import {
    CoreFetchDto,
    FetchDto, FetchExploreDto, FetchExploreSamplesDto, FetchExploreScannerDto, FetchExploreScannerResultDto,
    FetchScannerResultDto
} from "./fetch.dto";
import {ClientName} from "../clients/clients.enums";
import PersonCoreDto from "../person/person.dto";
import {FetchResultsGw} from "./fetch.mq.gw";
import {ApiModelProperty} from "@nestjs/swagger";


@Component()
export class FetchService {

    private static FETCH_WATCH_JOB_NAME: string = "fetchWatcherJob";
    private static FETCH_WATCH_JOB_REPEAT_TIME: string = '1 seconds';

    private static FETCH_REINIT_PERIOD: number = 500;

    constructor(@Inject('fetchModelToken') private readonly fetchModel: Model<FetchModel>,
                @Inject('agendaModelToken') private readonly agenda: Agenda,
                private readonly scannerClient: ScannerClient,
                private readonly fetchResultsGw: FetchResultsGw) {
        this.initFetchWatcher();
    }

    /********* PUBLIC METHODS *********/

    /** FETCH EXPLORE **/

    // fetchExplore request
    public async fetchExplore({person: {clientName}, person: {personKey}, fetchUrl}: FetchExploreDto) {

        let currentFetchModel = await this.getFetchByPersonKeyClientNameFetchUrl(personKey, clientName, fetchUrl);

        if (currentFetchModel != null) {
            await this.deleteFetch(currentFetchModel);
        }

        currentFetchModel = await this.fetchModel({
            clientName: clientName,
            personKey: personKey,
            fetchUrl: fetchUrl,
            createDate: Date.now(),
            state: FetchState.new,
        }).save();

        let fetchId: string = currentFetchModel._id.toString();
        this.scannerClient.fetchExploreProduce({fetchId: fetchId, fetchUrl: fetchUrl})
    }

    public async fetchExploreResultConsumer({fetchId, selectors}: FetchExploreScannerResultDto) {
        let fetchModel: FetchModel = await this.getFetchById(fetchId);

        if(fetchModel) {
            await this.fetchModel.updateOne(fetchModel, {
                $set: {
                    selectors: selectors,
                    state: FetchState.init
                }
            }).exec();

            let personCoreDto: PersonCoreDto = this.initPersonCoreDtoFromFetchModel(fetchModel);


            let sampleUrls = selectors.map(selector => selector.sampleUrl);
            // send to person
            this.fetchResultsGw.publishFetchExplore(
                {
                    person: personCoreDto,
                    fetchUrl: fetchModel.fetchUrl,
                    sampleUrls: sampleUrls
                })
        } else {
            console.log('fetchModel is null - OK')
        }
    }

    /********* FETCH ********/

    public async fetch({person: {personKey}, person: {clientName}, fetchUrl, sampleUrl}: FetchDto) {

        // get current job if exists
        let fetchModel = await this.getFetchByPersonKeyClientNameFetchUrl(personKey, clientName, fetchUrl);
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

    public async fetchResultConsumer({fetchUrl, fetchId, resultUrls, isSelectorEmpty, isSampleUrlNotFound}: FetchScannerResultDto) {

        let fetchModel: FetchModel = await this.getFetchById(fetchId);

        if (resultUrls && resultUrls.length > 0) {
            await this.fetchModel.updateOne(fetchModel, {
                $set: {
                    lastResult: resultUrls
                }
            }).exec();

            let personCoreDto: PersonCoreDto = this.initPersonCoreDtoFromFetchModel(fetchModel);
            this.fetchResultsGw.publishFetchResult({person: personCoreDto, resultUrls:resultUrls});
        }
    }

    // // delete fetch
    public async fetchDelete({person: {clientName, personKey}, fetchUrl}) {

        // get current job if exists
        let currentFetchModel = await this.getFetchByPersonKeyClientNameFetchUrl(personKey, clientName, fetchUrl);

        if (currentFetchModel == null) {
            throw new HttpException("fetch not found", HttpStatus.FORBIDDEN);
        }
        await this.deleteFetch(currentFetchModel);
    }

    public async fetchGet(person: PersonCoreDto): Promise<FetchExploreDto[]> {
        const {personKey, clientName} = person;
        let userFetches: FetchModel[] = await this.getFetchesOfPerson(personKey, clientName);

        return userFetches.map(value => {
            return {
                clientName: clientName,
                person: person,
                fetchUrl: value.fetchUrl
            }
        })
    }

    private async initFetchWatcher() {

        // define agenda task wit h timer
        this.agenda.define(FetchService.FETCH_WATCH_JOB_NAME, async (job, done) => {
            await this.initWatch(new Date(Date.now() - FetchService.FETCH_REINIT_PERIOD));
            done();
        });

        // await agenda ready
        await new Promise(resolve => this.agenda.once('ready', resolve));
        // start fetch task
        this.agenda.every(FetchService.FETCH_WATCH_JOB_REPEAT_TIME, FetchService.FETCH_WATCH_JOB_NAME);
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

                // TODO move to data service
                this.fetchModel.updateOne(fetch, {$set: {updateDate: new Date()}}, () => {
                    this.scannerClient.fetchProduce(
                        {
                            fetchId: fetchId,
                            fetchUrl: fetchUrl,
                            selector: selector,
                            lastResult: lastResult
                        });
                }).exec();

            })

            this.initWatch(initDate);
        }
    }


    /** COMMON PRIVATE METHODS **/

    private initPersonCoreDtoFromFetchModel({clientName, personKey}: FetchModel): PersonCoreDto {
        return {clientName: clientName, personKey: personKey, personInfo: null};
    }

    private getFetchById(fetchId: string) {
        return this.fetchModel.findOne({"_id": fetchId});
    }

    private async getFetchesOfPerson(personKey: object, clientName: ClientName) {
        // get current job if exists
        let currentFetchModel = await this.fetchModel.find({
            'personKey': personKey,
            'clientName': clientName
        }).exec();
        return currentFetchModel;
    }


    private async deleteFetch(currentFetchModel: FetchModel) {
        await this.fetchModel.deleteOne({_id: currentFetchModel._id}).exec();
    }

    private async getFetchByPersonKeyClientNameFetchUrl(personKey: Object, clientName: ClientName, fetchUrl: string): Promise<FetchModel> {
        return this.fetchModel.findOne({
            'personKey': personKey,
            'clientName': clientName,
            'fetchUrl': fetchUrl
        }).exec();
    }


}
