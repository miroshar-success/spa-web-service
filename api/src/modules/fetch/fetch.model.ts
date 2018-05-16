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
    readonly clientName: FetchClientName
    readonly personKey: string
    readonly fetchUrl: string
    readonly createDate: Date
    active: Boolean
    selector: String
    selectors: [FetchExploreSelectorsModel]
}

export const FetchSchema = new mongoose.Schema(
    {
        clientName: {type: String, require: true},
        personKey: {type: String, require: true},
        fetchUrl: {type: String, require: true},
        createDate: {type: Date, require: true},
        active: Boolean,
        selector: String,
        selectors: [FetchExploreSelectorsSchema]
    }
);