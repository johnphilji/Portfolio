require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fetch = require('node-fetch') || global.fetch; // Use global fetch if node-fetch isn't installed (Node 18+)

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from the current directory (the portfolio files)
app.use(express.static(__dirname));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define Contact Schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Handle Contact Form Submissions
app.post('/api/contact', async (req, res) => {
    try {
        const { name, _replyto, email, message } = req.body;
        
        // Handle Formspree's _replyto field if used instead of standard email name
        const senderEmail = email || _replyto;

        if (!name || !senderEmail || !message) {
            return res.status(400).json({ error: 'Please provide all required fields (name, email, message).' });
        }

        // 1. Save to MongoDB
        const newContact = new Contact({
            name,
            email: senderEmail,
            message
        });
        await newContact.save();

        // 2. Forward to Formspree to trigger the email
        // Using existing Formspree form ID
        const formspreeEndpoint = 'https://formspree.io/f/mnjbpbze';
        const formspreeResponse = await fetch(formspreeEndpoint, {
            method: 'POST',
            body: JSON.stringify({ name, email: senderEmail, message }),
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            }
        });

        if (!formspreeResponse.ok) {
            // Even if Formspree fails, we have saved it to DB, but we probably want to warn anyway
            console.warn('Formspree email forwarding failed:', formspreeResponse.statusText);
        }

        res.status(200).json({ success: 'Message sent and stored successfully!' });

    } catch (err) {
        console.error('Error in /api/contact:', err);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
