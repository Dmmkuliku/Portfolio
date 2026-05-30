// Install: npm install express cors
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS so your Vercel frontend can reach this API
app.use(cors());
app.use(express.json());

// API Endpoint to process contact forms
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log("Transmission Received:", { name, email, message });
    
    // In a real cloud setup, you would pipe this to a database or logging service
    res.status(200).json({ status: "success", info: "Data processed by cloud backend" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend engine operational on port ${PORT}`));
