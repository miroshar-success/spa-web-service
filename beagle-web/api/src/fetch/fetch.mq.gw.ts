import { Injectable } from "@nestjs/common";
import { MqGwDecorators } from "../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators";
import MqGwConsumer = MqGwDecorators.MqGwConsumer;
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9000 })

@Injectable()
export class FetchResultsGw {

  static THIS: FetchResultsGw;

  constructor() {
    FetchResultsGw.THIS = this

    wss.on('connection', ws => {

      ws.on('message', message => {
        const { type, name } = JSON.parse(message);
        switch (type) {
          case 'ADD_USER': {
            ws.personKey = name;
            break;
          }
        }
      })
    })

    const interval = setInterval(() => {
      wss.clients.forEach(ws => {
        if (ws.readyState === WebSocket.CLOSE) {
          ws.terminate();
        }
      })
    }, 30000);

  }

  @MqGwConsumer({ name: 'fetchExplore', gateway: 'person.clientName' })
  async consumeExploreMessage(message: any) {
    wss.clients.forEach(ws => {
      if (ws.personKey === message.person.personKey) {
        ws.send(JSON.stringify({
          type: 'SAVE_EXPLORED_FETCH_SAMPLES',
          payload: JSON.stringify(message),
        }))
      }
    })
  }

  @MqGwConsumer({ name: 'fetchResult', gateway: 'person.clientName' })
  async consumeMessage(message: any) {
    wss.clients.forEach(ws => {
      if (ws.personKey === message.person.personKey) {
        ws.send(JSON.stringify({
          type: 'SAVE_FETCH_RESULTS',
          payload: JSON.stringify(message),
        }))
      }
    })
  }

}