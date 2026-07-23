const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // تأكدنا إنها name وليست title
  price: { type: String, default: '' },
  description: { type: String, required: true },
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);