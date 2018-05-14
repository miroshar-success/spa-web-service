import {Component, Inject} from '@nestjs/common';

import {Channel, connect, Connection} from 'amqplib';

@Component()
export class FetchService {
    constructor(
      @Inject('rabbitMqConnection') private readonly connection: Connection
    ) {}

    public async doIt() {

        let q = "tasks";

        let chanel1 : Channel =  await this.connection.createChannel();
        chanel1.assertQueue(q);

        chanel1.consume(q, function(msg) {
            if (msg !== null) {
                console.log(msg.content.toString());

            }
        });



        let chanel2 : Channel = await this.connection.createChannel();
        chanel2.assertQueue(q);
        chanel2.sendToQueue(q, new Buffer('something to do'));

    }

}
