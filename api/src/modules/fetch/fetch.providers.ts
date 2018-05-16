import {Connection} from 'mongoose';
import {FetchSchema} from "./fetch.model";

export const fetchProviders = [
    {
        provide: 'fetchModelToken',
        useFactory: (connection: Connection) =>
            connection.model('Fetch', FetchSchema),
        inject: ['DbConnectionToken']
    },

];

