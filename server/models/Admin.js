const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    email: { type: String, default: 'admin@admin.com' },
    password: { type: String, required: true } 
}, { timestamps: true });

// 🚨 التعديل هنا: إزالة next تماماً والاعتماد على async فقط
adminSchema.pre('save', async function() {
    // إذا كلمة المرور لم تتعدل، نخرج من الدالة بدون عمل شيء
    if (!this.isModified('password')) return;
    
    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);