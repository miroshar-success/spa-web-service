import { Model } from 'mongoose';
import { Inject, Component, HttpException } from '@nestjs/common';
import FetchSchema, { FetchModel } from './fetch.model';
import { FetchRestDto } from './fetch.dto';

@Component()
export default class FetchDataService {

  constructor(@Inject('fetchModelToken') private readonly fetchModel: Model<FetchModel>) { }

  async create(fetchRestDto: FetchRestDto): Promise<FetchModel> {
    const {
      createDate,
      updateDate,
      ...rest,
    } = fetchRestDto;

    const fetchRestDtoMongoose = {
      createDate: new Date(createDate),
      updateDate: new Date(updateDate),
      ...rest,
    }
    const createdFetch = new this.fetchModel(fetchRestDtoMongoose);
    return await createdFetch.save();
  }

  async find(offset: number, limit: number, value: string): Promise<FetchModel[]> {
    if (value.length > 0) {
      return await this.fetchModel.paginate({ $text: { $search: value } }, { offset, limit })
    }
    return await this.fetchModel.paginate({}, { offset, limit });
  }

  async delete(id: string): Promise<void> {
    return await this.fetchModel.find({ _id: id }).remove().exec();
  }

  async search(searchString): Promise<FetchModel[]> {
    if (searchString.length === 0) {
      return await this.fetchModel.paginate({}, { limit: 10 });
    } else {
      return await this.fetchModel.paginate({ $text: { $search: searchString } }, { limit: 10 });
    }
  }

}
