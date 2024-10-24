import nodemailer from 'nodemailer';
import { getURL } from '../index.js';

// Configure the nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: ['project.mailer.service@gmail.com'], // You can replace this with process.env.EMAIL_USER
    pass: 'fuxm rdju unfu swux', // Store this securely, e.g., in an environment variable
  }
});

// Send status change email function
const sendStatusChangeEmail = (toEmail, userName, updatedRequest) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Ensure you have EMAIL_USER set in your environment variables
    to: toEmail,
    subject: `Request Status Updated`,
    text: `Hello ${userName},

Your request status has been updated to: ${updatedRequest.status}.

Request Details:
- Name: ${updatedRequest.name}
- Description: ${updatedRequest.description}
- Location: ${updatedRequest.location}
- City: ${updatedRequest.city}
- Categories: ${updatedRequest.categories.join(', ')}
- Status: ${updatedRequest.status}

Thank you for submitting your request!`,
    html: `
      <p>Hello ${userName},</p>
      <p>Your request status has been updated to: <strong>${updatedRequest.status}</strong>.</p>

      <h3>Request Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${updatedRequest.name}</li>
        <li><strong>Description:</strong> ${updatedRequest.description}</li>
        <li><strong>Location:</strong> ${updatedRequest.location}</li>
        <li><strong>City:</strong> ${updatedRequest.city}</li>
        <li><strong>Categories:</strong> ${updatedRequest.categories.join(', ')}</li>
        <li><strong>Status:</strong> ${updatedRequest.status}</li>
      </ul>
      <p>Thank you for submitting your request!</p>
    `,
  };

  // Send the status change email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending status change email:', error);
    } else {
      console.log('Status change email sent:', info.response);
    }
  });
};

// Send verification email function
const sendVerificationEmail = (toEmail, userId) => {
  let verificationLink = getURL();
  verificationLink += '/verify-email?id=' + userId;
  console.log(verificationLink);

  const mailOptions = {
    from: process.env.EMAIL_USER, // Ensure you have EMAIL_USER set in your environment variables
    to: toEmail,
    subject: 'Verify Your Email',
    html: `<p>Click the link below to verify your email:</p><p><a href="${verificationLink}">Verify Email</a></p>      
            <p>If the link is not working, please try to register again.</p>`,
  };

  // Send the verification email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};

// Export both email functions
export { sendStatusChangeEmail, sendVerificationEmail };
