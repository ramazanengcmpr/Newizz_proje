const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Response helper
function sendResponse(res, status, success, message, data = null) {
    res.status(status).json({ success, message, data });
}

// === Kullanıcı Kayıt ===
router.post("/signup", async (req, res) => {
    try {
        const { username, name: rawName, email, password } = req.body;
        const name = rawName || username; // formdan gelen her iki ismi de destekle

        if (!name || !email || !password) {
            return sendResponse(res, 400, false, "⚠️ Tüm alanlar zorunludur");
        }

        // kullanıcı zaten var mı?
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendResponse(res, 400, false, "❌ Bu email zaten kayıtlı");
        }

        // yeni kullanıcı oluştur (şifre hash işlemi model pre('save') içinde yapılır)
        const newUser = new User({ name, email, password });
        await newUser.save();

        return sendResponse(res, 201, true, "✅ Kullanıcı başarıyla oluşturuldu", {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        });
    } catch (err) {
        console.error("Signup Error:", err);
        return sendResponse(res, 500, false, "❌ Sunucu hatası");
    }
});

// === Kullanıcı Login ===
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendResponse(res, 400, false, "⚠️ Email ve şifre gerekli");
        }

        // kullanıcı var mı?
        const user = await User.findOne({ email });
        if (!user) {
            return sendResponse(res, 404, false, "❌ Kullanıcı bulunamadı");
        }

        // şifre doğru mu?
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendResponse(res, 401, false, "❌ Geçersiz şifre");
        }

        // JWT token üret
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "1h" }
        );

        return sendResponse(res, 200, true, "✅ Giriş başarılı", {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        return sendResponse(res, 500, false, "❌ Sunucu hatası");
    }
});

// === Kullanıcıları listele (admin) ===
router.get('/users', async (req, res) => {
    try {
        // Not: Üretimde bu endpoint public olmamalı. Şimdilik demo için açık.
        const users = await User.find({}, '-password');
        return res.status(200).json(users);
    } catch (err) {
        console.error('List Users Error:', err);
        return res.status(500).json({ message: '❌ Sunucu hatası' });
    }
});

// === Kullanıcı sil (admin panel) ===
router.delete('/users/:id', async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'User bulunamadı' });
        }
        return res.status(200).json({ message: 'User başarıyla silindi' });
    } catch (err) {
        console.error('Delete User Error:', err);
        return res.status(500).json({ message: '❌ Sunucu hatası' });
    }
});

module.exports = router;
