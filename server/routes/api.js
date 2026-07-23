const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

// 🚨 1. استدعاء حارس الأمان وأداة الرفع السحابية (Cloudinary)
const auth = require("../middleware/auth");
const upload = require("../middleware/upload"); // 👈 السطر الجديد

// ==========================================
// 🛡️ إعدادات الحماية من الهجمات (Rate Limiter)
// ==========================================
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // مدة الحظر: 15 دقيقة
  max: 5, // أقصى عدد محاولات مسموح بها لكل IP
  message: {
    message:
      "تم تجاوز الحد المسموح لمحاولات تسجيل الدخول. الرجاء المحاولة بعد 15 دقيقة.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ==========================================
// 1. استدعاء النماذج (Models)
// ==========================================
const Admin = require("../models/Admin");
const SiteConfig = require("../models/SiteConfig");
const page = require("../models/page");
const Project = require("../models/Project");
const About = require("../models/About");
const Service = require("../models/Service");
const Faq = require("../models/Faq");
const Notification = require("../models/Notification");
const Contact = require("../models/Contact");

const JWT_SECRET = process.env.JWT_SECRET;

// ==========================================
// ☁️ مسار رفع الصور على سحابة Cloudinary
// ==========================================
// 🚨 مسار محمي
router.post("/upload", auth, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "لم يتم رفع أي ملف" });
    }

    // 👈 السحر هنا: Cloudinary يرجع الرابط المباشر على الإنترنت فوراً
    const imageUrl = req.file.path;

    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 2. مسارات إعدادات الموقع (Site Config)
// ==========================================
router.get("/settings", async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create({});
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🚨 مسار محمي
router.put("/settings", auth, async (req, res) => {
  try {
    const updatedConfig = await SiteConfig.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 3. مسارات الصفحات (Pages)
// ==========================================
router.get("/pages", async (req, res) => {
  try {
    const pages = await Page.find();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🚨 مسار محمي
router.post("/pages", auth, async (req, res) => {
  try {
    const newPage = new Page(req.body);
    const savedPage = await newPage.save();
    res.json(savedPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 4. مسارات المشاريع (Projects)
// ==========================================
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🚨 مسارات محمية
router.post("/projects", auth, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.json(savedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/projects/:id", auth, async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, imageUrl },
      { new: true },
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "المشروع غير موجود" });
    }
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/projects/:id", auth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "تم حذف المشروع بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 5. مسارات الخدمات (Services)
// ==========================================
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🚨 مسارات محمية
router.post("/services", auth, async (req, res) => {
  try {
    const { name, price, description, imageUrl } = req.body;
    const newService = new Service({ name, price, description, imageUrl });
    const savedService = await newService.save();
    res.json(savedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/services/:id", auth, async (req, res) => {
  try {
    const { name, price, description, imageUrl } = req.body;
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { name, price, description, imageUrl },
      { new: true },
    );
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/services/:id", auth, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "تم حذف الخدمة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 6. مسارات الأسئلة الشائعة (FAQ)
// ==========================================
router.get("/faq", async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🚨 مسارات محمية
router.post("/faq", auth, async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    const newFaq = new Faq({ question, answer, category });
    const savedFaq = await newFaq.save();
    res.json(savedFaq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/faq/:id", auth, async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    const updatedFaq = await Faq.findByIdAndUpdate(
      req.params.id,
      { question, answer, category },
      { new: true },
    );
    res.json(updatedFaq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/faq/:id", auth, async (req, res) => {
  try {
    await Faq.findByIdAndDelete(req.params.id);
    res.json({ message: "تم الحذف بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 7. مسارات صفحة من نحن (About)
// ==========================================
router.get("/about", async (req, res) => {
  try {
    const aboutData = await About.findOne();
    res.json(aboutData || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🚨 مسار محمي
// 🚨 مسار محمي
// 🚨 مسار محمي ومضمون 100%
router.post("/about", auth, async (req, res) => {
  try {
    const { title, backgroundImageUrl, story, vision, gallery } = req.body;

    // 🔴 حذف أي مستند قديم لضمان عدم حدوث تضارب في المخطط (Schema)
    await About.deleteMany({});

    // 🔴 إنشاء مستند جديد كلياً بالبيانات الجديدة ومعرض الصور
    const aboutData = new About({
      title,
      backgroundImageUrl,
      story,
      vision,
      gallery: Array.isArray(gallery) ? gallery : [],
    });

    await aboutData.save();

    console.log("تم حفظ البيانات في القاعدة بنجاح:", aboutData);
    res.json(aboutData);
  } catch (error) {
    console.error("خطأ أثناء الحفظ:", error.message);
    res.status(500).json({ message: error.message });
  }
});
// ==========================================
// 8. مسارات الأمان (Security)
// ==========================================
// 🚨 مسارات محمية بالكامل لأنها تخص الآدمن فقط
router.get("/security", auth, async (req, res) => {
  try {
    let admin = await Admin.findOne();
    if (!admin) {
      admin = await Admin.create({
        email: "admin@admin.com",
        password: "12345",
      });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/security", auth, async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    let admin = await Admin.findOne();
    if (!admin) {
      return res.status(404).json({ message: "المدير غير موجود" });
    }

    const isMatch = await admin.comparePassword(currentPassword.trim());
    if (!isMatch) {
      return res.status(400).json({ message: "كلمة المرور الحالية غير صحيحة" });
    }

    admin.email = email.trim();
    admin.password = newPassword.trim();
    await admin.save();

    await Notification.create({
      title: "Güvenlik Uyarısı",
      message: "Yönetici paneli şifresi veya e-posta adresi değiştirildi.",
      type: "system",
    });

    res.json({ message: "تم التحديث بنجاح" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 9. مسار تسجيل الدخول (Login) - محمي من الهجمات
// ==========================================
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne();

    if (!admin) {
      return res.status(404).json({ message: "حساب المدير غير موجود" });
    }

    const isMatch = await admin.comparePassword(password);

    if (admin.email === email && isMatch) {
      const token = jwt.sign({ id: admin._id }, JWT_SECRET, {
        expiresIn: "1d",
      });
      res.json({ token, message: "تم تسجيل الدخول بنجاح" });
    } else {
      res
        .status(401)
        .json({ message: "البريد الإلكتروني veya كلمة المرور غير صحيحة" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// ==========================================
// 10. مسارات الإشعارات (Notifications)
// ==========================================
// 🚨 مسارات محمية لأنها تخص لوحة التحكم
router.get("/notifications", auth, async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/notifications/mark-all-read", auth, async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ message: "تم التحديد كمقروء" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// مسار الطوارئ: إعادة ضبط حساب الآدمن
// ==========================================
router.get("/fix-admin", async (req, res) => {
  try {
    await Admin.deleteMany({});

    await Admin.create({
      email: "admin@admin.com",
      password: "12345",
    });

    res.json({
      message: "✅ تم تصفير حساب الآدمن بنجاح! روح جرب هلا بـ 12345",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// مسارات التواصل (Contact)
// ==========================================
router.get("/contact", async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create({});
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🚨 مسار محمي
router.post("/contact", auth, async (req, res) => {
  try {
    const { email, phone, address, mapUrl, instagram, linkedin, github } =
      req.body;
    let contact = await Contact.findOne();

    if (contact) {
      contact.email = email;
      contact.phone = phone;
      contact.address = address;
      contact.mapUrl = mapUrl;
      contact.instagram = instagram;
      contact.linkedin = linkedin;
      contact.github = github;
      await contact.save();
    } else {
      contact = new Contact({
        email,
        phone,
        address,
        mapUrl,
        instagram,
        linkedin,
        github,
      });
      await contact.save();
    }

    await Notification.create({
      title: "İletişim Bilgileri Güncellendi",
      message: "İletişim ve Konum ayarları başarıyla güncellendi.",
      type: "system",
    });

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;







