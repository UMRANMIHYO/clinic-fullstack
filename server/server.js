require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// ==========================================
// 🛡️ إعدادات الـ CORS (تحديد من يمكنه الاتصال بالسيرفر)
// ==========================================
app.use(
  cors({
    // 👈 ضفنا الرابطين كمصفوفة عشان نقبل الحالتين
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://clinic-fullstack-chi.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
// السماح بقراءة الملفات الموجودة في مجلد uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// تهيئة الطلبات بشكل صحيح
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 👈 1. سطر جديد لتهيئة الطلبات وحل التعارض
// ==========================================
// 🛡️ تنظيف البيانات المخصص لمنع NoSQL Injection
// ==========================================
app.use((req, res, next) => {
  const sanitizeData = (obj) => {
    if (typeof obj !== "object" || obj === null) return;

    Object.keys(obj).forEach((key) => {
      // إذا كان المفتاح يحتوي على رموز خبيثة، قم بحذفه
      if (key.includes("$") || key.includes(".")) {
        delete obj[key];
      } else {
        // فحص متداخل إذا كانت البيانات عبارة عن كائن داخل كائن
        sanitizeData(obj[key]);
      }
    });
  };

  // تنظيف البيانات القادمة من النماذج (Body) والروابط (Params) فقط
  if (req.body) sanitizeData(req.body);
  if (req.params) sanitizeData(req.params);

  // تركنا req.query لتجنب خطأ القراءة فقط الذي تسببت به المكتبة

  next();
});

// 🔴 1. استدعاء مسار الإشعارات
const notificationRoutes = require("./routes/notificationRoutes");

// توجيه المسارات الأساسية
app.use("/api", require("./routes/api"));
// 🔴 2. ربط مسار الإشعارات بالسيرفر
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("API çalışıyor...");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Veritabanına bağlandı (dogru calisyor)");

    app.listen(PORT, () => {
      console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Veritabanı hatası (hata):", error.message);
  });
