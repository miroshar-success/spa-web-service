import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate'
import {FetchState} from './fetch.enums';
import {ClientName} from '../clients/clients.enums';
import {Meta} from '../scanner/scanner.sample';


export interface FetchExploreSelectorModel {
    readonly sample: SampleModel
    readonly selector: string
    readonly meta: Meta;
}

export interface SampleModel {
    readonly url: string
    readonly meta: any
}

export const FetchExploreSampleSchema = new mongoose.Schema(
    {
        url: String,
        meta: Object
    }
);

export const FetchExploreSelectorsSchema = new mongoose.Schema(
    {
        sample: FetchExploreSampleSchema,
        selector: String,
        meta: Object
    }
);

export interface FetchModel extends Document {
    _id: string,
    readonly clientName: ClientName
    readonly personKey: Object
    readonly fetchUrl: string
    readonly createDate: Date
    state: FetchState
    selectors: FetchExploreSelectorModel[]

    selector: string

    updateDate: Date
    lastResult: SampleModel[]
}

export const FetchSchema = new mongoose.Schema(
    {
        clientName: {type: String, require: true},
        personKey: {type: Object, require: true},
        fetchUrl: {type: String, require: true},
        createDate: {type: Date, require: true},
        state: {type: String, require: true},
        selectors: [FetchExploreSelectorsSchema],

        selector: String,
        updateDate: {type: Date, require: true},
        lastResult: [FetchExploreSampleSchema]
    }
);

FetchSchema.index({
    clientName: 'text',
    fetchUrl: 'text',
    createDate: 'text',
    state: 'text',
    selector: 'text',
    updateDate: 'text',
})


FetchSchema.plugin(mongoosePaginate);

export default mongoose.model('Fetch', FetchSchema);