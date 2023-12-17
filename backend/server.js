import chalk from 'chalk';
import morgan from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/api/v1/test', (req, res) => {
  return res.json({ status: 'it works!!!' });
});

app.listen(PORT, () => {
  console.log(
    `${chalk.green.bold('✔')} 👍 server running in ${chalk.yellow.bold(
      process.env.NODE_ENV
    )} mode on port ${chalk.blue.bold(PORT)}`
  );
});
