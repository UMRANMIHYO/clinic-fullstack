const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// مسار GET: لجلب البيانات (يستخدمه الزائر ولوحة التحكم)
router.get('/', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    // إذا لم يكن هناك بيانات، قم بإنشاء سجل فارغ افتراضي
    if (!contact) {
      contact = new Contact();
      await contact.save();
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' }); // خطأ في السيرفر
  }
});

// مسار POST: لتحديث البيانات (تستخدمه لوحة التحكم فقط)
router.post('/', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact();
    }

    // تحديث الحقول بالبيانات القادمة من الـ Frontend
    const { email, phone, address, mapUrl, instagram, linkedin, github } = req.body;
    
    contact.email = email || contact.email;
    contact.phone = phone || contact.phone;
    contact.address = address || contact.address;
    contact.mapUrl = mapUrl || contact.mapUrl;
    contact.instagram = instagram || contact.instagram;
    contact.linkedin = linkedin || contact.linkedin;
    contact.github = github || contact.github;
    
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;