const express = require('express');
const cors = require('cors');
const { Resend } = require('resend'); // 1. Swapped out nodemailer for the Resend HTTP SDK

const app = express();

// Enable CORS so your Vercel frontend can securely communicate with this backend
app.use(cors());

// Middleware to parse incoming JSON data from your contact form
app.use(express.json());

// Render uses process.env.PORT dynamically. Locally it defaults to 5000.
const PORT = process.env.PORT || 5000;

// 2. Initialize Resend using standard HTTPS Web Request (completely unblocked by Render)
const resend = new Resend(process.env.EMAIL_PASS); 

// 1. Health-Check / Status Route
app.get('/api/status', (req, res) => {
    res.json({ message: "Online and Connected to Cloud Backend!" });
});

// 2. Contact Form Processing Route (Upgraded with HTTP API Delivery)
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Simple validation rule
    if (!name || !email || !message) {
        return res.status(400).json({ error: "All input fields are required!" });
    }

    // Log the message cleanly into the server console for evaluation
    console.log(`=========================================`);
    console.log(`NEW PORTFOLIO MESSAGE FROM: ${name}`);
    console.log(`EMAIL: ${email}`);
    console.log(`=========================================`);

    try {
        // 3. Fire the email using Resend's secure web pipeline
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', // Resend's default safe verified system sender
            to: process.env.EMAIL_USER,    // Your personal Gmail (raymondtungaraza20@gmail.com)
            reply_to: email,               // Clicking "Reply" in your inbox goes straight to the sender
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
        });

        if (error) {
            console.error("Resend API Internal Error:", error);
            return res.status(500).json({ error: "Email delivery pipeline rejected the token validation." });
        }

        console.log("Mail sent successfully via HTTP Web API. Message ID:", data.id);
        
        // Respond back to Raymond's portfolio frontend
        res.json({ 
            success: `Hi ${name}, your message was successfully processed and sent to Raymond's inbox!` 
        });

    } catch (catchError) {
        console.error("Network Catch Error:", catchError);
        res.status(500).json({ error: "Server encountered a transmission error over the web port." });
    }
});

// Start the server infrastructure
app.listen(PORT, () => {
    console.log(`Server is currently active and listening on port ${PORT}`);
});
