import App from "../../../../src/app";
import supertest from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from "mongoose";

const app = App();

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.createConnection(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Get /api/users', () => {
  it('should return list of users',async () => {
    await supertest(app)
      .get('/api/users')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([]);
      }
    );
  });
});
