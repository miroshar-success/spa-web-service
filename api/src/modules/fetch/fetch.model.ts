import * as mongoose from 'mongoose';
import {FetchClientName} from "./fetch.enums";

export interface FetchExploreSelectorsModel extends Document {
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
    active: Boolean
    selectors: [FetchExploreSelectorsModel]

    selector: String

    updateDate: Date
    lastResult: [String]
}

export const FetchSchema = new mongoose.Schema(
    {
        _id: Number,
        clientName: {type: String, require: true},
        personKey: {type: String, require: true},
        fetchUrl: {type: String, require: true},
        createDate: {type: Date, require: true},
        active: Boolean,
        selectors: [FetchExploreSelectorsSchema],

        selector: String,
        updateDate: {type: Date, require: true},
        lastResult: [String]
    }
);