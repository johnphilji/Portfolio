require('dotenv').config();
const mongoose = require('mongoose');

// Define Schema (Must be defined or retrieved if already registered)
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        try {
            if (!process.env.MONGO_URI) {
                return res.status(500).json({ error: 'MONGO_URI not configured' });
            }

            await mongoose.connect(process.env.MONGO_URI);

            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // 1. Save to MongoDB
            const newContact = new Contact({ name, email, message });
            await newContact.save();

            // 2. Forward to Formspree
            const formspreeEndpoint = 'https://formspree.io/f/mnjbpbze';
            await fetch(formspreeEndpoint, {
                method: 'POST',
                body: JSON.stringify({ name, email, message }),
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                }
            });

            return res.status(200).json({ success: 'Message sent!' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
