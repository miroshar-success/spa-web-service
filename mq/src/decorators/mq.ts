import "reflect-metadata";

const MQ_ROOT_METADATA = "MQ:ROOT:PATH";
const MQ_METHOD_METADATA = "MQ:METHOD:PATH";


export function MqApiController(value: string){
    return function(target: any){
        // console.log('MQ_Controller', target);
        Reflect.defineMetadata(MQ_ROOT_METADATA, value, target);
        // console.log('MQ_Controller', target);
    }
}

export function MqApiMethod(value: string){
    return function(target: any, methodName: string, descriptor: PropertyDescriptor){
        console.log('MQ_METHOD', methodName);
        Reflect.defineMetadata(MQ_METHOD_METADATA, value, descriptor.value);
        console.log('MQ_METHOD', methodName);
    };
}


@MqApiController('mq1')
class Controller1{

    @MqApiMethod('call1')
    call1(req: string){
        return "MQ 1-1: " + req;
    }
}

@MqApiController('mq2')
class Controller2{

    @MqApiMethod('call1')
    call1(req: string){
        return "MQ 2-1: " + req;
    }
    @MqApiMethod('call2')
    call2(req: string){
        return "MQ 2-2: " + req;
    }
}



interface MqApiConfig{
    basePath: string
    clients: string[]
    connection: object
}


// basepath.[client].[root].[call].req|resp
class MqApiServer{

    constructor({basePath, clients, connection}: MqApiConfig, private controllers: any[] ){
        const PATHS = Array<string>();
        clients
            .map((client: string) => basePath + '.' + client)
            .map((clientPath: string) => {
                return controllers
                    .map((controller) => Object.keys((controller as Function).prototype)
                        .filter(key => (typeof controller.prototype[key] === 'function'))
                        .map(key => controller.prototype[key])
                        .map(method => clientPath + '.' + Reflect.getMetadata(MQ_ROOT_METADATA, controller) + '.' + Reflect.getMetadata(MQ_METHOD_METADATA, method)))
            })
            .forEach(clientControllers => clientControllers.forEach(clientController => PATHS.push(...clientController)));
        console.log(PATHS);
        PATHS.forEach(path => {
            const root = path.split('.')[2];
            const method = path.split('.')[3];
            const controller = controllers.filter(controller => Reflect.getMetadata(MQ_ROOT_METADATA, controller) === root)[0];
            if (controller){
                const response = controller.prototype[method].call(null, path);
                console.log("RESPONSE: ", response);
            }

        })
    }

}

new MqApiServer({basePath:'api',clients:['telegram','viber'],connection:{}}, [Controller1,Controller2]);
