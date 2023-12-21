import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';
import transporter from '../helpers/emailTransporter.js';
import { systemLogs } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('filename: ', __filename, '__dirname', __dirname);

const sendEmail = async (email, subject, payload, template) => {
  try {
    const srcDir = fs.readFileSync(path.join(__dirname, template));
    const compiledTemplate = handlebars.compile(srcDir);

    const emailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject,
      html: compiledTemplate(payload),
    };

    await transporter.sendEmail(emailOptions);
  } catch (error) {
    systemLogs(`Email not sent: ${error}\n`);
  }
};

export default sendEmail;
