const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS so your Vercel frontend can securely communicate with this backend
app.use(cors());

// Middleware to parse incoming JSON data from your contact form
app.use(express.json());

// Render uses process.env.PORT dynamically. Locally it defaults to 5000.
const PORT = process.env.PORT || 5000;

// 1. Health-Check / Status Route
app.get('/api/status', (req, res) => {
    res.json({ message: "Online and Connected to Cloud Backend!" });
});

// 2. Contact Form Processing Route
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

    // Respond back to Raymond's portfolio frontend
    res.json({ 
        success: `Hi ${name}, your message was successfully processed by Raymond's cloud backend!` 
    });
});

// Start the server infrastructure
app.listen(PORT, () => {
    console.log(`Server is currently active and listening on port ${PORT}`);
});