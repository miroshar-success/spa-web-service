import { Injectable } from "@nestjs/common";
import { MqGwDecorators } from "../../../../lib/mq-gw-api/src/decorators/mq.gw.decorators";
import MqGwProducer = MqGwDecorators.MqGwProducer;
import MqGwConsumer = MqGwDecorators.MqGwConsumer;


@Injectable()
export class FetchResultsGw {

  static THIS: FetchResultsGw;

  constructor() {
    FetchResultsGw.THIS = this;
    setTimeout(() => this.publishMessage({ status: 'ok', messageKey: "XXX-" }), 5000);
  }


  @MqGwProducer({ name: 'fetchMessage', gateway: 'clientKey' })
  async publishMessage(message: any) {
    let fetchMessage: any = { message: message };
    console.log("message" + JSON.stringify(fetchMessage))
    return message;
  }


  // @MqGwProducer({name:'fetchExplore', gateway:'clientKey'})
  // async publishFetchExplore(fetchExploreResultDto: FetchExploreResultDto) {
  //     console.log("publishFetchExplore: " + JSON.stringify(fetchExploreResultDto))
  // }

  // @MqGwProducer({name:'fetchResult', gateway:'clientKey'})
  // async publishFetchResult(fetchResultDto: FetchResultDto) {
  //     console.log("publishFetchResult"+ JSON.stringify(fetchResultDto))
  // }

  // @MqGwProducer({name:'fetchMessage', gateway:'clientKey'})
  // async publishMessage(message: FetchMessage, person?: PersonCoreDto) {
  //     let fetchMessage: FetchMessageDto = {message: message, person: person};
  //     console.log("message"+ JSON.stringify(fetchMessage))
  //     return message;
  // }

  @MqGwConsumer({ name: 'fetchMessage', gateway: 'clientKey' })
  async consumeMessage(message: any) {
    console.log('up');
    // console.log("THIS: ", FetchResultsGw.THIS)
    // console.log("MESSAGE:" + JSON.stringify(message));
    // console.log("data:" + message.content);
  }

}
