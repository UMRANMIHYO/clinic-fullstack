const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification'); // تأكد من مسار المودل

// 🔴 1. جلب أحدث الإشعارات (للعرض في القائمة المنسدلة)
router.get('/', async (req, res) => {
  try {
    // نجلب أحدث 20 إشعار مرتبين من الأحدث للأقدم
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Bildirimler alınamadı' });
  }
});

// 🔴 2. تحويل جميع الإشعارات غير المقروءة إلى مقروءة (تصفير العداد)
router.put('/mark-all-read', async (req, res) => {
  try {
    await Notification.updateMany(
      { isRead: false }, 
      { isRead: true }
    );
    res.json({ message: 'Tümü okundu olarak işaretlendi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Okundu işaretleme hatası' });
  }
});

module.exports = router;