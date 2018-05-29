
export namespace MqGwTypes {



    export interface ConnectionConfig{
        hostname: string,
        username: string,
        password: string
    }
    export interface MqGwConfigType {
        root: string
        clients: string[],
        components: Function[],
        connection: ConnectionConfig
    }

    export interface DecoratorParam {
        name: string
    }
    export interface MqDecoratorParam extends DecoratorParam {
        client: string
    }
    export interface MqGwDecoratorParam extends DecoratorParam {
        gateway: string
    }
    export interface MqGwScanResult {
        key: string,
        prototype: object,
        method: MqMethodType,
        mRoute: string,
        gwKey?: string,
        client?: string
    }

    export interface MqMethodType extends Function {
        (...args: any[]): any
    }
    export interface MqGwConsumerType extends MqMethodType{}
    export interface MqGwProducerType extends MqMethodType{}
    export interface MqConsumerType extends MqMethodType{}
    export interface MqProducerType extends MqMethodType{}

}