const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // Adjust if needed depending on where it's run

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");
        const contactSchema = new mongoose.Schema({
            name: { type: String, required: true },
            email: { type: String, required: true },
            message: { type: String, required: true },
            date: { type: Date, default: Date.now }
        });
        const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
        const docs = await Contact.find().sort({ date: -1 }).limit(5);
        console.log("Latest 5 contacts in DB:");
        console.log(docs);
    } catch (e) {
        console.error("Error", e);
    } finally {
        await mongoose.disconnect();
    }
}
check();
