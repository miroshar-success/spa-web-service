import {Model} from 'mongoose';
import {Component, Inject} from '@nestjs/common';

import {Channel, connect, Connection} from 'amqplib';
import {FetchExploreDto} from "./fetch.dto";
import {FetchModel} from "./fetch.model";
import {FetchClientName} from "./fetch.enums";
import {FetchExploreMqDto} from "./fetch.mq.dto";

@Component()
export class FetchService {

    public static FETCH_EXPLORE_MQ_NAME = "fetch.explore";
    private fetchExploreChanel: Channel;

    // TODO ADD HANDLER OF THIS CHANEL WITH SELECTORS OF USER
    public static FETCH_EXPLORE_RESULT_MQ_NAME = "fetch.explore.result";
    private fetchExploreResultChanel: Channel;

    constructor(@Inject('rabbitMqConnection') private readonly connection: Connection,
                @Inject('fetchModelToken') private readonly fetchModel: Model<FetchModel>) {
        // init consumer
        this.callFetchExploreChanel(this.fetchExploreResultConsumer);
    }

    public async fetchExploreCreate(fetchExploreDto: FetchExploreDto) {

        let personKey: string = fetchExploreDto.person.personKey;
        let clientName: FetchClientName = fetchExploreDto.clientName;
        let fetchUrl: string = fetchExploreDto.fetchUrl;

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
                createData: Date.now()
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

}
