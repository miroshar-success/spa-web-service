import { Injectable } from "@nestjs/common";
import { MqGwDecorators } from "../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators";
import MqGwConsumer = MqGwDecorators.MqGwConsumer;
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9000 })

@Injectable()
export class FetchResultsGw {

  static THIS: FetchResultsGw;

  private clients: any[] = []

  constructor() {
    FetchResultsGw.THIS = this
    console.log('clients1', wss.clients);
    wss.on('connection', ws => {
      // ws.clientName = 'admin';
      // wss.clients.forEach(element => {
      //   console.log(element);
      // });
      ws.on('message', message => {
        this.clients.push({
          clientName: message,
          client: ws,
        })
        this.clients[0].client.send(JSON.stringify('message'))
        console.log(message);
      })
    })
    // setTimeout(() => this.publishMessage({ status: 'ok', clientName: "viber" }), 5000);
  }


  @MqGwConsumer({ name: 'fetchResult', gateway: 'person.clientName' })
  async consumeMessage(message: any) {
    // console.log(this.clients[0]);
    // const client = this.clients[0].client;
    // client.send(JSON.stringify('message2'));
    this.clients[0].client.send(JSON.stringify(message))
    // wss.clients.forEach(client => {
    //   client.send(JSON.stringify(message));
    // })
    // console.log(client);
    // client.send(message);
    // console.log(message);
    // console.log('up');
    // console.log("THIS: ", FetchResultsGw.THIS)
    // console.log("MESSAGE:" + JSON.stringify(message));
    // console.log("data:" + message.content);
  }

}
