const mongoose = require('mongoose');


const pageSchema = new mongoose.Schema({
    title: { type: String, required: true }, 
    slug: { type: String, required: true, unique: true },
    content: { type: String, default: '' }, 
    isVisible: { type: Boolean, default: true }, 
    projects: [{ 
        projectName: String,
        projectImage: String,
        projectDescription: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('page', pageSchema);