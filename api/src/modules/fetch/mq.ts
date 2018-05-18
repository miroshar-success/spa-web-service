// import "reflect-metadata";
//
// const MQ_ROOT_METADATA = "MQ:ROOT:PATH";
// const MQ_METHOD_METADATA = "MQ:METHOD:PATH";
//
//
// export function MqApiController(value: string){
//     return function(target: any){
//         console.log('MQ_Controller', target);
//         Reflect.defineMetadata(MQ_ROOT_METADATA, value, target);
//         console.log('MQ_Controller', target);
//     }
// }
//
// export function MqApiMethod(value: string){
//     return function(target: any, methodName: string, descriptor: PropertyDescriptor){
//         console.log('MQ_METHOD', methodName);
//         Reflect.defineMetadata(MQ_METHOD_METADATA, value, descriptor.value);
//         console.log('MQ_METHOD', methodName);
//     };
// }
//
//
// @MqApiController('mq1')
// export class Controller1{
//
//     @MqApiMethod('call1')
//     call1(req: string){
//         return "MQ 1-1: " + req;
//     }
// }
//
// @MqApiController('mq2')
// export  class Controller2{
//
//     @MqApiMethod('call1')
//     call1(req: string){
//         return "MQ 2-1: " + req;
//     }
//     @MqApiMethod('call2')
//     call2(req: string){
//         return "MQ 2-2: " + req;
//     }
// }
//
//
// export interface MqApiConfig{
//     basePath: string
//     clients: string[]
//     connection: object
// }
//
//
// export class MqApiServer{
//
//     constructor({basePath, clients, connection}: MqApiConfig, private controllers: object[] ){
//         clients
//             .map((client: string) => basePath + '.' + client + '.')
//             .map((clientPath: string) => {
//                 console.log(clientPath);
//                 console.log(controllers);
//                 return controllers
//                     .map((controller) => Object.keys(controller)
//                         .filter(key => (typeof controller[key] === 'function'))
//                         .map(key => controller[key])
//                         .map(method => clientPath + '.' + Reflect.getMetadata(MQ_ROOT_METADATA, controller) + '.' + Reflect.getMetadata(MQ_METHOD_METADATA, method)))
//             })
//             .forEach(clientControllers => clientControllers.forEach(clientController => console.log(JSON.stringify(clientController))));
//     }
//
// }
//
//
