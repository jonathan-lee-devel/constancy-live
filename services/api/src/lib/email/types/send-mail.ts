export type SendMailFunction = (
    addressTo: string,
    subject: string,
    html: string,
) => Promise<boolean>;
