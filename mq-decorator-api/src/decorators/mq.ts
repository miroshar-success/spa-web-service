import * as Reflect from "reflect-metadata";

const MQ_ROOT_METADATA = "MQ:ROOT:PATH";
const MQ_METHOD_METADATA = "MQ:METHOD:PATH";


function MqTsApiController(value: string){
    return function(target: any){
        console.log('MQ_Controller', target);
        Reflect.defineMetadata(MQ_ROOT_METADATA, value, target);
        console.log('MQ_Controller', target);
    }
}

function MqTsApiMethod(value: string){
    return function(target: any, methodName: string, descriptor: PropertyDescriptor){
        console.log('MQ_METHOD', methodName);
        Reflect.defineMetadata(MQ_METHOD_METADATA, value, descriptor.value);
        console.log('MQ_METHOD', methodName);
    };
}


@MqTsApiController('mq1')
class Controller1{

    @MqTsApiMethod('call1')
    call1(req: string){
        return "MQ 1: " + req;
    }
}
@MqTsApiController('mq2')
class Controller2{

    @MqTsApiMethod('call1')
    call1(req: string){
        return "MQ 1: " + req;
    }
    @MqTsApiMethod('call2')
    call2(req: string){
        return "MQ 2: " + req;
    }
}



interface MqTsApiConfig{
    basePath: string
    clients: string[]
    connection: Object
}



// basepath.[client].[root].[call].req|resp
class MqTsApiStore{
    static STORE: Object = {};
}

class MqTsApiServer{

    constructor({basePath, clients, connection}: MqTsApiConfig, private controllers: Object[] ){
        clients
            .map((client: string) => basePath + '.' + client + '.')
            .map((clientPath: string) => {
                controllers.forEach(c => console.log(JSON.stringify()))
                return controllers
                    .map((controller) => Object.keys(controller)
                        .filter(key => (typeof controller[key] === 'function'))
                        .map(key => controller[key])
                        .map(method => clientPath + '.' + Reflect.getMetadata(MQ_ROOT_METADATA, controller) + '.' + Reflect.getMetadata(MQ_METHOD_METADATA, method)))
            })
            .forEach(clientControllers => console.log(clientControllers))
    }

}