const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'ghayour222@gmail.com', // Your Gmail address
        pass: 'yetq uksf tyjx wrkb', // Your app password
      },
    });

    await transporter.sendMail({
      from: 'ghayour222@gmail.com', // Your email address
      to: email,
      subject: subject,
      text: text,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
