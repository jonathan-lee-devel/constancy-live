import {makeSendMailCallback} from './inner/send-mail-callback.js';
import {transporterConfig} from '../config/Email.js';
import {makeSendMail} from './send-mail.js';
import {makeVerifyEmail} from './verify-email.js';

export const sendMail = makeSendMail(
    transporterConfig(),
    makeSendMailCallback(),
);

export const verifyEmail = makeVerifyEmail();
