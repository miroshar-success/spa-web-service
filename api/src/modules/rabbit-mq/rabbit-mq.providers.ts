import {connect} from 'amqplib';

export const rabbitMqProviders = [
  {
    provide: 'rabbitMqConnection',
    useFactory: async (): Promise<Object> => {
      return connect({
          hostname: "beagle-rabbit-mq",
          username: "rabbitmq",
          password: "rabbitmq"
      });
    }
  }
];