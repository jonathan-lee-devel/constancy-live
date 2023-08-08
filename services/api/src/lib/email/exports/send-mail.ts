import {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {SendMailCallbackFunction} from '../types/inner/send-mail-callback';
import {SendMailFunction} from '../types/send-mail';
import logger from '../../logger/logger';

export const makeSendMail = (
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
    sendMailCallback: SendMailCallbackFunction,
): SendMailFunction => {
  return async function sendMail(
      addressTo: string,
      subject: string,
      html: string,
  ): Promise<boolean> {
    logger.info(`Attempting to send e-mail to: <${addressTo}>`);
    await transporter.sendMail(
        {
          from: process.env.EMAIL_USER,
          to: addressTo,
          subject,
          html,
        },
        sendMailCallback,
    );

    return false;
  };
};
