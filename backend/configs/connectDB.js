import mongoose from 'mongoose';
import chalk from 'chalk';
import { systemLogs } from '../utils/logger.js';

const connectionToDB = async () => {
  try {
    const connectionParams = {
      dbName: process.env.DB_NAME,
    };
    // the uri string is defined in local.yml file for docker compose
    const connect = await mongoose.connect(
      process.env.MONGO_URI,
      connectionParams
    );
    console.log(
      `${chalk.green.bold(`Connected to database: ${connect.connection.host}`)}`
    );
    systemLogs.info(`Connected to database: ${connect.connection.host}`);
  } catch (error) {
    console.error(`${chalk.red.bold(`Error: ${error.message}`)}`);
    process.exit(1);
  }
};

export default connectionToDB;
