import * as mongoose from 'mongoose';
import {FetchClientName, FetchState} from "./fetch.enums";

export interface FetchExploreSelectorModel {
    readonly sampleUrl: string
    readonly selector: string
}

export const FetchExploreSelectorsSchema = new mongoose.Schema(
    {
        sampleUrl: String,
        selector: String
    }
);

export interface FetchModel extends Document {
    readonly _id: String,
    readonly clientName: FetchClientName
    readonly personKey: string
    readonly fetchUrl: string
    readonly createDate: Date
    state: FetchState
    selectors: FetchExploreSelectorModel[]

    selector: String

    updateDate: Date
    lastResult: [String]
}

export const FetchSchema = new mongoose.Schema(
    {
        clientName: {type: String, require: true},
        personKey: {type: String, require: true},
        fetchUrl: {type: String, require: true},
        createDate: {type: Date, require: true},
        state: {type: String, require: true},
        selectors: [FetchExploreSelectorsSchema],

        selector: String,
        updateDate: {type: Date, require: true},
        lastResult: [String]
    }
);