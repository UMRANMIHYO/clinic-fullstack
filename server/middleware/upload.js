const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. إعداد الاتصال بحسابك
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. إعداد التخزين في السحابة
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'cms-projects', // اسم المجلد اللي رح تنحفظ فيه الصور بالكلاود
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    }
});

const upload = multer({ storage: storage });

module.exports = upload;