import { Application } from 'express';
import expressLoader from './express';
import DBLoader from './db';

const loaders = async ({ expressApp }: { expressApp: Application }) => {
  await DBLoader();
  expressLoader({ app: expressApp })
}

export default loaders;
