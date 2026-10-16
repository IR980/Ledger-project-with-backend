require('dotenv').config();
const dns = require('node:dns/promises');
const nodemailer = require('nodemailer');

const smtpHost = 'smtp.gmail.com';

async function createTransporter() {
  const { address } = await dns.lookup(smtpHost, { family: 4 });

  return nodemailer.createTransport({
    host: address,
    port: 465,
    secure: true,
    tls: { servername: smtpHost },
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });
}

createTransporter()
  .then((transporter) => transporter.verify())
  .then(() => console.log('Email server is ready to send messages'))
  .catch((error) => console.error('Error connecting to email server:', error));

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  let transporter;
  try {
    transporter = await createTransporter();
    const info = await transporter.sendMail({
      from: `"Backend Ladger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  } finally {
    transporter?.close();
  }
};

async function sendRegistrationMail(userEmail, name){
    const subject = 'Welcome to Backend Ledger!';
    const text = `Hello ${name},\n\nThank you for registering at Backend Ledger. We're excited to have you on board!\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = 'Transaction Successful!';
    const text = `Hello ${name},\n\nYour transaction of $${amount} to account ${toAccount} was successful.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>Your transaction of $${amount} to account ${toAccount} was successful.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html)
}

async function sendTransactionFaluireEmail(userEmail, name, amount, toAccount){
  const subject = 'Transaction Failed';
    const text = `Hello ${name},\n\nWe regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.\n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${name},</p><p>We regret to inform you that your transaction of $${amount} to account ${toAccount} has failed. Please try again later.</p><p>Best regards,<br>The Backend Ledger Team</p>`;

    await sendEmail(userEmail, subject, text, html)
}

module.exports = {sendRegistrationMail, sendTransactionEmail, sendTransactionFaluireEmail};
