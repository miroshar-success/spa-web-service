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
      })
    })
    // setTimeout(() => this.publishMessage({ status: 'ok', clientName: "viber" }), 5000);
  }

  @MqGwConsumer({ name: 'fetchExplore', gateway: 'person.clientName' })
  async consumeExploreMessage(message: any) {
    console.log('up')
    this.clients[0].client.send(JSON.stringify({
      type: 'ADD_NEW_FETCH_FOR_EXPLORE_SUCCESS',
      payload: JSON.stringify(message),
    }))
  }


  @MqGwConsumer({ name: 'fetchResult', gateway: 'person.clientName' })
  async consumeMessage(message: any) {
    this.clients[0].client.send(JSON.stringify({
      type: 'ADD_FETCH_RESULT',
      payload: JSON.stringify(message),
    }))
  }

}
