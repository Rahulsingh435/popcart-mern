import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Naam likhna zaroori hai']
        },
        email: {
            type: String,
            required: [true, 'Email dena zaroori hai'],
            unique: true,
            lowercase: true,
            // 🛡️ NAYA: Email ki basic strict validation
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        phone: { // 📱 NAYA: Phone number field
            type: String,
            required: [true, 'Phone number zaroori hai'],
            unique: true,
            match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number']
        },
        password: {
            type: String,
            required: [true, 'Password zaroori hai']
        },
        role: { // 👑 NAYA: Multi-vendor roles
            type: String,
            enum: ['user', 'admin', 'vendor', 'delivery'],
            default: 'user'
        }
    },
    { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);