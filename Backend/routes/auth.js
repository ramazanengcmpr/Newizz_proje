const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ✅ Response helper
function sendResponse(res, status, success, message, data = null) {
    res.status(status).json({ success, message, data });
}

// === Kullanıcı Kayıt ===
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return sendResponse(res, 400, false, "⚠️ Tüm alanlar zorunludur");
        }

        // kullanıcı zaten var mı?
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendResponse(res, 400, false, "❌ Bu email zaten kayıtlı");
        }

        // şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // yeni kullanıcı oluştur
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        return sendResponse(res, 201, true, "✅ Kullanıcı başarıyla oluşturuldu", {
            id: newUser._id,
            username: newUser.username,
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
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        return sendResponse(res, 500, false, "❌ Sunucu hatası");
    }
});

module.exports = router;
