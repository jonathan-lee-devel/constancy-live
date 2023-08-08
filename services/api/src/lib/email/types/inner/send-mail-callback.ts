import {SentMessageInfo} from 'nodemailer';

export type SendMailCallbackFunction = (
    err: (Error | null),
    info: SentMessageInfo,
) => boolean;
