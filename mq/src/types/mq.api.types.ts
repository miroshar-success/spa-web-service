

export namespace MqApiTypes {

    export interface DecoratorParam {
        name: string
        gateway: string
    }

    export interface ConfigurationParam{
        root: string
        clients: string[]
    }

    export interface ScanParam {
        components: Function[]
    }

    export interface MqMethod {
        (...args: any[]): any
    }

    export interface MqConsumerType extends MqMethod{}

    export interface MqProducerType extends MqMethod{}

    export interface MqWrapper<F> {
        (connect: F): ((target: F) => F );
    }
}