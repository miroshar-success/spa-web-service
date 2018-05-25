import {Model} from 'mongoose';
import {Inject, Component, HttpException} from '@nestjs/common';
import FetchSchema, {FetchModel} from './fetch.model';
import {FetchDtoData} from './fetch.dto.data';
import {FetchState} from "./fetch.enums";
import {ClientName} from "../clients/clients.enums";

@Component()
export default class FetchDataService {

    constructor(@Inject('fetchModelToken') private readonly fetchModel: Model<FetchModel>) {}

    async create(fetchDtoData: FetchDtoData): Promise<FetchModel> {
        const {
            createDate,
            updateDate,
            ...rest,
        } = fetchDtoData;

        const fetchRestDtoMongoose = {
            createDate: new Date(createDate),
            updateDate: new Date(updateDate),
            ...rest,
        }
        const createdFetch = new this.fetchModel(fetchRestDtoMongoose);
        return await createdFetch.save();
    }

    public async find(offset: number, limit: number, value: string): Promise<FetchModel[]> {
        if (value.length > 0) {
            return await this.fetchModel.paginate({$text: {$search: value}}, {offset, limit})
        }
        return await this.fetchModel.paginate({}, {offset, limit});
    }

    public async delete(id: string, searchString?: string): Promise<any> {
        await this.fetchModel.findByIdAndRemove({_id: id});
        // if (searchString.length === 0) {
        //     return await this.fetchModel.find().count();
        // } else {
        //     return await this.fetchModel.paginate({$text: {$search: searchString}}, {limit: 10});
        // }
    }

    public async search(searchString): Promise<FetchModel[]> {
        if (searchString.length === 0) {
            return await this.fetchModel.paginate({}, {limit: 10});
        } else {
            return await this.fetchModel.paginate({$text: {$search: searchString}}, {limit: 10});
        }
    }

    public getById(fetchId: string): Promise<FetchModel> {
        return this.fetchModel.findOne({"_id": fetchId});
    }

    /** SMART METHODS **/

    public async updateFetchModelWithInitData(fetchModel: FetchModel, selector: string | undefined) {
        await this.fetchModel.updateOne(fetchModel, {
            $set: {
                selector: selector,
                state: FetchState.active,
                selectors: [],
                updateDate: new Date(-8640000000000000)
            }
        }).exec();
    }


    public async getByPersonAndClientName(personKey: object, clientName: ClientName) {
        // get current job if exists
        let currentFetchModel = await this.fetchModel.find({
            'personKey': personKey,
            'clientName': clientName
        }).exec();
        return currentFetchModel;
    }

    public async getByPersonKeyClientNameFetchUrl(personKey: Object, clientName: ClientName, fetchUrl: string): Promise<FetchModel> {
        return this.fetchModel.findOne({
            'personKey': personKey,
            'clientName': clientName,
            'fetchUrl': fetchUrl
        }).exec();
    }


}
