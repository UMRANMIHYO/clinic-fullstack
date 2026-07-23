const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['system', 'message', 'info'], // أنواع الإشعارات عشان تتلون الأيقونات بالفرونت إند
    default: 'info' 
  },
  isRead: { 
    type: Boolean, 
    default: false // افتراضياً أي إشعار جديد بيكون غير مقروء
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Notification', notificationSchema);