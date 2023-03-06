import { Model } from 'mongoose';

export class CRUDRepository {
  model: Model<any>;

  constructor(model: Model<any>) {
    this.model = model;
  }

  async createOne(data: any) {
    return await this.model.create(data);
  }

  async getOne(query: any) {
    return await this.model.findOne(query);
  }

  async getMany(query: any) {
    return await this.model.find(query);
  }

  async updateOne(query: any, data: any) {
    return await this.model.updateOne(query, data, { new: true });
  }

  async deleteOne(query: any) {
    return await this.model.deleteOne(query);
  }

  async deleteMany(query: any) {
    return await this.model.deleteMany(query);
  }
}
