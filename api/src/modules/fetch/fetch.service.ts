import {Component, Inject} from '@nestjs/common';

import {Channel, connect, Connection} from 'amqplib';
import {FetchExploreDto} from "./fetch.dto";

@Component()
export class FetchService {

    public static FETCH_EXPLORE_MQ_NAME = "fetch.explore";
    private fetchExploreChanel: Channel;

    constructor(@Inject('rabbitMqConnection') private readonly connection: Connection) {
        // init consumer
        this.callFetchExploreChanel(this.fetchExploreResultConsumer);
    }

    public async fetchExploreCreate(fetchExploreDto: FetchExploreDto) {
        this.callFetchExploreChanel(channel => {
            channel.sendToQueue(FetchService.FETCH_EXPLORE_MQ_NAME, new Buffer(JSON.stringify(fetchExploreDto)));
        })
    }

    private async fetchExploreResultConsumer(channel: Channel) {
        channel.consume(FetchService.FETCH_EXPLORE_MQ_NAME, function (msg) {
            if (msg !== null) {
                console.log(msg.content.toString());
            }
        });
    }

    private async callFetchExploreChanel(callFunction:(arg:Channel)=>void) {
        if(this.fetchExploreChanel == null) {
            let fetchExploreChanel: Channel = await this.connection.createChannel();
            fetchExploreChanel.assertQueue(FetchService.FETCH_EXPLORE_MQ_NAME);
            this.fetchExploreChanel = fetchExploreChanel;
        }
        callFunction(this.fetchExploreChanel);
    }

}
