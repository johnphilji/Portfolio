require('dotenv').config();
const mongoose = require('mongoose');

// Define Schema (Uses an existing model if already registered to prevent Mongoose errors in serverless)
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

module.exports = async (req, res) => {
    // Handle CORS for Vercel functions
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
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).json({ error: 'All fields (name, email, message) are required.' });
            }

            if (!process.env.MONGO_URI) {
                return res.status(500).json({ error: 'MONGO_URI is not defined in environment variables.' });
            }

            // Connect to MongoDB (Vercel best practice is to handle the connection within the handler)
            await mongoose.connect(process.env.MONGO_URI);

            // 1. Save to MongoDB Atlas
            const newContact = new Contact({ name, email, message });
            await newContact.save();

            // 2. Forward to Formspree for email notification (Optional but requested)
            const formspreeEndpoint = 'https://formspree.io/f/mnjbpbze';
            try {
                await fetch(formspreeEndpoint, {
                    method: 'POST',
                    body: JSON.stringify({ name, email, message }),
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' 
                    }
                });
            } catch (formspreeErr) {
                console.error('Formspree forwarding failed:', formspreeErr);
                // We don't return an error here because the record is already saved in MongoDB
            }

            return res.status(200).json({ success: 'Record saved successfully!' });

        } catch (err) {
            console.error('API Error:', err);
            return res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
