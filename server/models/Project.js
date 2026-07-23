const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true }, // اسم المشروع
    imageUrl: { type: String, default: '' }, // رابط صورة المشروع
    description: { type: String, default: '' } // وصف المشروع
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);