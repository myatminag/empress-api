import nodemailer from 'nodemailer';

import Log from './log.js';

const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM, 
        to: options.to,
        subject: options.subject,
        html: options.text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            Log.error(error);
        } else {
            Log.info(info);
        }
    })
};

export default sendEmail;