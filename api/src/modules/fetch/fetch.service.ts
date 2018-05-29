import {Model} from 'mongoose';
import {Component, HttpStatus, Inject, HttpException} from '@nestjs/common';
import {FetchExploreSelectorModel, FetchModel, SampleModel} from './fetch.model';
import {FetchState} from './fetch.enums';
import * as Agenda from 'agenda';
import {ScannerClient} from './fetch.scanner.client';
import { FetchDto, FetchExploreDto } from './dto/fetch.dto';
import PersonCoreDto from '../person/person.dto';
import {FetchResultsGw} from './fetch.mq.gw';
import {FetchExploreScannerResultDto, FetchScannerResultDto} from './dto/scanner.dto';
import {FetchMessage} from './dto/fetch.message';
import FetchDataService from './fetch.service.data';
import PersonService from '../person/person.service';
import {Meta, SampleOut} from "../../../../scanner/src/modules/scanner.sample";


@Component()
export class FetchService {

    private static FETCH_WATCH_JOB_NAME: string = 'fetchWatcherJob';
    private static FETCH_WATCH_JOB_REPEAT_TIME: string = '1 seconds';

    private static FETCH_REINIT_PERIOD: number = 500;

    constructor(@Inject('fetchModelToken') private readonly fetchModel: Model<FetchModel>,
                @Inject('agendaModelToken') private readonly agenda: Agenda,
                private readonly scannerClient: ScannerClient,
                private readonly fetchResultsGw: FetchResultsGw,
                private readonly fetchDataService: FetchDataService,
                private readonly personService: PersonService) {
        this.initFetchWatcher();
    }

    /********* PUBLIC METHODS *********/

    /** FETCH EXPLORE **/

    // fetchExplore request
    public async fetchExplore({person, fetchUrl}: FetchExploreDto) {

        this.personService.merge(person);

        const {clientName, personKey} = person;

        let currentFetchModel = await this.fetchDataService.getByPersonKeyClientNameFetchUrl(personKey, clientName, fetchUrl);

        if (currentFetchModel != null) {
            await this.fetchDataService.delete(currentFetchModel._id);
        }

        currentFetchModel = await this.fetchModel({
            clientName: clientName,
            personKey: personKey,
            fetchUrl: fetchUrl,
            createDate: Date.now(),
            state: FetchState.new,
        }).save();
        let fetchId: string = currentFetchModel._id.toString();
        this.scannerClient.produceFetchExplore({fetchId,fetchUrl})
    }

    public async fetchExploreResultConsumer({fetchId, selectors, meta}: FetchExploreScannerResultDto) {
        let fetchModel: FetchModel = await this.fetchDataService.getById(fetchId);
        if (fetchModel) {
            await this.fetchModel.updateOne(fetchModel, {
                $set: {
                    selectors: selectors,
                    state: FetchState.init,
                    meta: meta
                }
            }).exec();
            let personCoreDto: PersonCoreDto = this.initPersonCoreDtoFromFetchModel(fetchModel);


            let sample: SampleOut[] = selectors.map(selector => selector.sample);
            // send to person
            this.fetchResultsGw.publishFetchExploreResult(
                {
                    person: personCoreDto,
                    fetchUrl: fetchModel.fetchUrl,
                    samples: sample,
                    meta: meta
                })
        }
    }

    /********* FETCH ********/

    public async fetch({person, fetchUrl, sampleUrl}: FetchDto) {

        this.personService.merge(person);

        const {personKey, clientName} = person;

        // get current job if exists
        let fetchModel = await this.fetchDataService.getByPersonKeyClientNameFetchUrl(personKey, clientName, fetchUrl);

        console.log('**********************************fetch**************************');

        if (!fetchModel) {
            throw new HttpException(FetchMessage.FETCH_EXISTS_ERROR.messageKey, HttpStatus.BAD_REQUEST);
        }

        let selectors: FetchExploreSelectorModel[] = fetchModel.selectors;

        if (!selectors || selectors.length < 1) {
            throw new HttpException(FetchMessage.FETCH_SELECTOR_NOT_FOUND_ERROR.messageKey, HttpStatus.BAD_REQUEST);
        }
        let selectorModel = selectors.find(selector => selector.sample.url === sampleUrl);

        if (!selectorModel == null && selectorModel.selector) {
            throw new HttpException(FetchMessage.FETCH_SELECTOR_NOT_FOUND_ERROR.messageKey, HttpStatus.BAD_REQUEST);
        }
        await this.fetchDataService.updateFetchModelWithInitData(fetchModel, selectorModel.selector);
    }


    public async fetchResultConsumer({fetchUrl, fetchId, resultUrls, isSelectorEmpty, isSampleUrlNotFound}: FetchScannerResultDto) {

        let fetchModel: FetchModel = await this.fetchDataService.getById(fetchId);

        if (resultUrls && resultUrls.length > 0) {
            await this.fetchModel.updateOne(fetchModel, {
                $set: {
                    lastResult: resultUrls
                }
            }).exec();

            let personCoreDto: PersonCoreDto = this.initPersonCoreDtoFromFetchModel(fetchModel);
            this.fetchResultsGw.publishFetchResult({person: personCoreDto, resultUrls: resultUrls, meta: new Meta()});
        }
    }

    public async fetchDelete({person: {clientName, personKey}, fetchUrl}) {
        // get current job if exists
        let currentFetchModel = await this.fetchDataService.getByPersonKeyClientNameFetchUrl(personKey, clientName, fetchUrl);
        if (currentFetchModel) {
            await this.fetchDataService.delete(currentFetchModel._id);
        }
    }

    public async fetchGet(person: PersonCoreDto): Promise<FetchExploreDto[]> {
        const {personKey, clientName} = person;
        let userFetches: FetchModel[] = await this.fetchDataService.getByPersonAndClientName(personKey, clientName);

        return userFetches.map(value => {
            return {
                clientName: clientName,
                person: person,
                fetchUrl: value.fetchUrl
            }
        })
    }

    private async initFetchWatcher() {

        // define agenda task with timer
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
            'updateDate': {'$lt': initDate}
        }).sort({'updateDate': -1}).limit(100).exec();

        if (currentFetches && currentFetches.length > 0) {

            // init watch and
            currentFetches.forEach(fetch => {

                let fetchId: string = fetch._id;
                let fetchUrl: string = fetch.fetchUrl;
                let selector: string = fetch.selector;
                let lastResult: string = fetch.lastResult[0].url;

                // TODO move to data service
                this.fetchModel.updateOne(fetch, {$set: {updateDate: new Date()}}, () => {
                    this.scannerClient.produceFetch(
                        {
                            fetchId: fetchId,
                            fetchUrl: fetchUrl,
                            selector: selector,
                            lastResult: lastResult
                        });
                }).exec();

            });

            this.initWatch(initDate);
        }
    }

    /** COMMON PRIVATE METHODS **/

    private initPersonCoreDtoFromFetchModel({clientName, personKey}: FetchModel): PersonCoreDto {
        return {clientName: clientName, personKey: personKey, personInfo: null};
    }

}
