import mongoose from "mongoose";
import { Db } from 'mongodb';
import config from 'config';
import logger from './logger';

const startDBConnection = async (): Promise<Db> => {
  const dbURI = config.get<string>('databaseURL')

  try {
    const db = await mongoose.connect(dbURI)
    logger.info('Connected to MongoDB');
    return db.connection.db;
  } catch (err) {
    logger.error('Error connecting to MongoDB', err);
    process.exit(1);
  }
}

export default startDBConnection;
