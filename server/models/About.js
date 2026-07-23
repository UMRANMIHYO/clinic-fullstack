const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  story: { type: String, required: true },
  vision: { type: String, required: true },
  imageUrl: { type: String }, 
  backgroundImageUrl: { type: String }, 
  
  // 🔴 هذا هو الجزء الأهم الذي يجب أن يكون موجوداً
  gallery: [{
    url: { type: String },
    title: { type: String },
    description: { type: String }
  }]
}, { timestamps: true });


module.exports = mongoose.model('About', AboutSchema);