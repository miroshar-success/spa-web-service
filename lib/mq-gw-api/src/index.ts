import {MqGwDecorators} from "./decorators/mq.gw.decorators";


export default MqGwDecorators;




// import MqGwConsumer = MqGwDecorators.MqGwConsumer;
// import MqGwProducer = MqGwDecorators.MqGwProducer;
// import EnableMqGw = MqGwDecorators.EnableMqGw;
// export class Service {
//     constructor(public bar: string){
//         console.log('INIT: ', bar);
//     }
//     @MqGwConsumer({name:'fetch', gateway:'clientKey'})
//     call1(req: string){
//         console.log('bar == ',this.bar);
//         return "MQ 2-1: " + req;
//     }
//     @MqGwProducer({name:'fetch', gateway:'clintKey'})
//     call2(req: string){
//         console.log('bar == ',this.bar);
//         return "MQ 2-2: " + req;
//     }
//     foo(){
//         console.log('foo')
//         return 'foo';
//     }
// }
//
// @EnableMqGw({
//     root: 'beagle',
//     clients:['telegram'],
//     components:[Service],
//     connection: {
//         hostname: "beagle-rabbit-mq",
//         username: "rabbitmq",
//         password: "rabbitmq"
//     }
// })
// class Test {}
//
// console.log('**********************************************************');
// console.log('Test: ', Test);
// const test = new Test();
// console.log('test: ', test);
//
// const service = new Service('serviceBar')
// service.call1('test call1')
// service.call2('test call2')
//
