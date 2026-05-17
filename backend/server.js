const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer'); // 1. Imported nodemailer tool

const app = express();

// Enable CORS so your Vercel frontend can securely communicate with this backend
app.use(cors());

// Middleware to parse incoming JSON data from your contact form
app.use(express.json());

// Render uses process.env.PORT dynamically. Locally it defaults to 5000.
const PORT = process.env.PORT || 5000;

// 2. Configure the Nodemailer Transporter to use the Resend Unblocked Gateway
const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true, // Uses secure SSL encryption tunnel natively
    auth: {
        user: 'resend',                  // This must literally be the text 'resend'
        pass: process.env.EMAIL_PASS     // Your secure Resend API Key saved on Render (re_...)
    },
    connectionTimeout: 10000
});

// 1. Health-Check / Status Route
app.get('/api/status', (req, res) => {
    res.json({ message: "Online and Connected to Cloud Backend!" });
});

// 2. Contact Form Processing Route (Upgraded with Resend Email Delivery)
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Simple validation rule
    if (!name || !email || !message) {
        return res.status(400).json({ error: "All input fields are required!" });
    }

    // Log the message cleanly into the server console for evaluation
    console.log(`=========================================`);
    console.log(`NEW PORTFOLIO MESSAGE FROM: ${name}`);
    console.log(`EMAIL: ${email}`);
    console.log(`MESSAGE: ${message}`);
    console.log(`=========================================`);

    // 3. Set up the layout of the email that will arrive in your Gmail box
    const mailOptions = {
        from: 'onboarding@resend.dev', // Resend's default verified system sender
        to: process.env.EMAIL_USER,    // Your personal Gmail (raymondtungaraza20@gmail.com)
        replyTo: email,                // Clicking "Reply" in your inbox replies directly to the client
        subject: `💼 Portfolio Message from ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px;">
                <h3 style="color: #1abc9c;">New Portfolio Contact Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Sender Email:</strong> ${email}</p>
                <p><strong>Message Content:</strong></p>
                <p style="background: #f5f7fa; padding: 15px; border-radius: 8px; border-left: 4px solid #1abc9c; color: #2d3748; line-height: 1.6;">${message}</p>
            </div>
        `
    };

    // 4. Fire the email out into the cloud!
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Mail Dispatch Error:", error);
            return res.status(500).json({ error: "Server encountered a delivery issue routing the email." });
        }
        
        console.log("Mail sent successfully via Resend:", info.response);
        
        // Respond back to Raymond's portfolio frontend
        res.json({ 
            success: `Hi ${name}, your message was successfully processed and sent to Raymond's inbox!` 
        });
    });
});

// Start the server infrastructure
app.listen(PORT, () => {
    console.log(`Server is currently active and listening on port ${PORT}`);
});
