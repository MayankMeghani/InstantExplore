import nodemailer from 'nodemailer';
import { getURL } from '../index.js';
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: ['mayankmeghani1627@gmail.com'], 
    pass: 'jduf yicc sdwl oium', 
  }
});

const sendStatusChangeEmail = (toEmail, userName, requestStatus) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: `Request Status Updated`,
    text: `Hello ${userName},\n\nYour request status has been updated to: ${requestStatus}.\n\nThank you!`,
    html: `<p>Hello ${userName},</p><p>Your request status has been updated to: <strong>${requestStatus}</strong>.</p><p>Thank you!</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error.message );
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

const sendVerificationEmail = (toEmail, userId) => {
  let verificationLink = getURL();
  verificationLink += '/verify-email?id=' + userId;
  console.log(verificationLink);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Verify Your Email',
    html: `<p>Click the link below to verify your email:</p><p><a href="${verificationLink}">Verify Email</a></p>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};


export {sendStatusChangeEmail,sendVerificationEmail}; 
