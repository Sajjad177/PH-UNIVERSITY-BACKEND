import nodemailer from 'nodemailer';
import config from '../config';

//! -------------- Module : 19-2, 19-3, 19-4 -----------
export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // search what is SMTP ethereal email
    port: 587, // 587 is the default port for SMTP submission
    secure: config.NODE_ENV === 'production',
    auth: {
      user: 'sajjadsajjad098765@gmail.com',
      pass: 'faxp ayeg nimr onrd',
    },
  });

  await transporter.sendMail({
    from: 'sajjadsajjad098765@gmail.com', // sender address
    to, // list of receivers
    subject: 'Important: Reset Your Password Within 10 Minutes', // Subject line
    text: 'Reset Your Password', // plain text body
    html,
  });
};
