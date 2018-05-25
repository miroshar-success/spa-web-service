
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
        gateway?: string
        client?: string
    }
    export interface MqGwScanResult {
        key: string,
        prototype: object,
        method: MqGwMethodType,
        mRoute: string,
        gwKey: string,
        client?: string
    }

    export interface MqGwMethodType extends Function {
        (...args: any[]): any
    }
    export interface MqGwConsumerType extends MqGwMethodType{}
    export interface MqGwProducerType extends MqGwMethodType{}

}