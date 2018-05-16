import {Connection} from 'mongoose';
import {FetchSchema} from "./fetch.model";

export const fetchProviders = [
    {
        provide: 'fetchModelToken',
        useFactory: (connection: Connection) =>
            connection.model('FetchSchema', FetchSchema),
        inject: ['DbConnectionToken']
    },

];

