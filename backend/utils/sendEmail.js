import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';
import transporter from '../helpers/emailTransporter.js';
import { systemLogs } from './logger.js';

// __filename: /app/backend/utils/sendEmail.js __dirname: /app/backend/utils
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendEmail = async (email, subject, payload, template) => {
  try {
    const srcDir = fs.readFileSync(path.join(__dirname, template));
    const compiledTemplate = handlebars.compile(`${srcDir}`);

    const emailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject,
      html: compiledTemplate(payload),
    };

    await transporter.sendMail(emailOptions);
  } catch (error) {
    systemLogs.error(`Email not sent: ${error}\n`);
  }
};

export default sendEmail;
