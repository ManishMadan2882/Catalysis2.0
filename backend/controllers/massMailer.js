const Registration = require("../models/register");
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port : 465,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

const mailAll = async(req, res) => {
    try {
        const { user, subject, body } = req.body;
        if ( user === process.env.USER_AUTH ) {
    
            const users = await Registration.find();
            const emails = users.map(user => user.email);
        
            // Send emails
            for (const email of emails) {
                const mailOptions = {
                    from: process.env.MAIL_USER,
                    to: email,
                    subject: subject,
                    text: body,
                };
                await transporter.sendMail(mailOptions);
            }
        
            res.status(200).send('Emails sent successfully');
        }
        else {
            res.status(300).send('Invalid User');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { mailAll }