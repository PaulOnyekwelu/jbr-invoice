import chalk from 'chalk';
import morgan from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import { morganMiddleware, systemLogs } from './utils/logger.js';
import connectionToDB from './configs/connectDB.js';
import 'dotenv/config';

await connectionToDB()

const app = express();
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morganMiddleware);

app.get('/api/v1/test', (req, res) => {
  return res.json({ status: 'it works!!!' });
});

app.listen(PORT, () => {
  console.log(
    `${chalk.green.bold('✔')} 👍 server running in ${chalk.yellow.bold(
      process.env.NODE_ENV
    )} mode on port ${chalk.blue.bold(PORT)}`
  );
  systemLogs.info(
    `server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`
  );
});
