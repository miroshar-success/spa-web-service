import {Model} from 'mongoose';
import {Body, Component, HttpStatus, Inject, HttpException} from '@nestjs/common';

import {Channel, connect, Connection} from 'amqplib';
import {FetchDto, FetchExploreDto} from "./fetch.dto";
import {FetchExploreSelectorsModel, FetchModel} from "./fetch.model";
import {FetchClientName} from "./fetch.enums";
import {FetchExploreMqDto} from "./fetch.mq.dto";
import * as Agenda from "agenda";
import {MongoClient} from "mongodb";


@Component()
export class FetchService {

    public static FETCH_EXPLORE_MQ_NAME = "fetch.explore";
    private fetchExploreChanel: Channel;

    // TODO ADD HANDLER OF THIS CHANEL WITH SELECTORS OF USER
    public static FETCH_EXPLORE_RESULT_MQ_NAME = "fetch.explore.result";
    private fetchExploreResultChanel: Channel;

    constructor(@Inject('rabbitMqConnection') private readonly connection: Connection,
                @Inject('fetchModelToken') private readonly fetchModel: Model<FetchModel>,
                @Inject('agendaModelToken') private readonly agenda: Agenda) {
        // init consumer
        this.callFetchExploreChanel(this.fetchExploreResultConsumer);

        this.initFetchWatcher();

    }

    // init new fetch
    public async fetchExploreCreate(fetchExploreDto: FetchExploreDto) {

        let personKey: string = fetchExploreDto.person.personKey;
        let clientName: FetchClientName = fetchExploreDto.clientName;
        let fetchUrl: string = fetchExploreDto.fetchUrl;

        // TODO MERGE USER IN USER SERVICE

        // get current job if exists
        let currentFetchModel = await this.fetchModel.findOne({
            'personKey': personKey,
            'clientName': clientName
        }).exec();

        // TODO throw error if user has fetch
        // create if not
        if (currentFetchModel == null) {
            currentFetchModel = await this.fetchModel({
                clientName: clientName,
                personKey: personKey,
                fetchUrl: fetchUrl,
                createDate: Date.now()
            }).save();
        }

        // sent new message to fetch.explore
        let fetchId = currentFetchModel._id;
        let fetchExploreMqDto: FetchExploreMqDto = <FetchExploreMqDto>{
            clientName: clientName,
            fetchId: fetchId,
            fetchUrl: fetchUrl
        };

        //sent message to queue
        this.callFetchExploreChanel(channel => {
            channel.sendToQueue(FetchService.FETCH_EXPLORE_MQ_NAME, new Buffer(JSON.stringify(fetchExploreMqDto)));
        })
    }


    // apply fetch
    public async fetch(fetch: FetchDto) {

        let personKey: string = fetch.person.personKey;
        let clientName: FetchClientName = fetch.clientName;
        let fetchUrl: string = fetch.fetchUrl;
        let sampleUrl: string = fetch.sampleUrl;

        // get current job if exists
        let targetFetchModel: FetchModel = await this.fetchModel.findOne({
            'personKey': personKey,
            'clientName': clientName,
            'fetchUrl': fetchUrl
        }).exec();

        if (!targetFetchModel) {
            // TODO ADD CUSTOM EXCEPTIONS
            throw new HttpException('error targetFetchModel is null', HttpStatus.FORBIDDEN);
        }

        let selectors: [FetchExploreSelectorsModel] = targetFetchModel.selectors;

        if (!selectors || selectors.length < 1) {
            throw new HttpException('selector not found', HttpStatus.FORBIDDEN);
        }

        let selectorModel = selectors.find(selector => selector.sampleUrl == sampleUrl);

        if (selectorModel && selectorModel.selector) {
            targetFetchModel.selector = selectorModel.selector;
            targetFetchModel.active = true;
            this.fetchModel(targetFetchModel).save();
            // todo init new fetch job now
        }
        else {
            throw new HttpException('selector not found', HttpStatus.FORBIDDEN);
        }

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


        // FIXME
        this.agenda.cancel({name: 'greet the world2'});

        this.agenda.define('greet the world2', function(job, done) {
            console.log(job.attrs.data.time, 'hello world!');
            done();
        });


        this.agenda.every('1 seconds', 'greet the world2', {time: new Date()});


    }

}
