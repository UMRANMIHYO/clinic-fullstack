const jwt = require('jsonwebtoken');

// نفس مفتاح التشفير اللي استخدمناه بملف api.js
const JWT_SECRET = process.env.JWT_SECRET;
const auth = (req, res, next) => {
    // 1. جلب التوكن من ترويسة الطلب (Headers)
    const token = req.header('Authorization');

    // 2. إذا مافي توكن (المستخدم مو مسجل دخول)
    if (!token) {
        return res.status(401).json({ message: 'غير مصرح لك بالدخول، يرجى تسجيل الدخول أولاً!' });
    }

    try {
        // 3. تنظيف التوكن (في حال كان الفرونت إند بيبعت قبله كلمة Bearer)
        const tokenClean = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        
        // 4. فك تشفير التوكن والتأكد من صحته
        const verified = jwt.verify(tokenClean, JWT_SECRET);
        
        // 5. إرفاق بيانات المدير بالطلب والسماح بالمرور
        req.admin = verified;
        next(); // 🟢 افتح الباب، خليه يمر للمسار!
        
    } catch (error) {
        res.status(400).json({ message: 'التوكن غير صالح أو منتهي الصلاحية' });
    }
};

module.exports = auth;