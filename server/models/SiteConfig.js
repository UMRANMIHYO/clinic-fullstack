const mongoose = require('mongoose');


const siteConfigSchema = new mongoose.Schema({
    logoUrl: { type: String, default: '' }, 
    whatsappNumber: { type: String, default: '' }, 
    siteDescription: { type: String, default: '' }, 
    heroImageUrl: { type: String, default: '' },
    primaryColor: { type: String, default: '#2563eb' },
    secondaryColor: { type: String, default: '#1e40af' } ,
    sectionsVisibility: {
     aboutEnabled: { type: Boolean, default: true },
     servicesEnabled: { type: Boolean, default: true },
     projectsEnabled: { type: Boolean, default: true },
     faqEnabled: { type: Boolean, default: true }
}
}, { timestamps: true }); 
// timestamps: تقوم بإنشاء حقلين تلقائياً (تاريخ الإنشاء وتاريخ آخر تعديل)

module.exports = mongoose.model('SiteConfig', siteConfigSchema);