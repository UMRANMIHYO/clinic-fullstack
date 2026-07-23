
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    mapUrl: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);