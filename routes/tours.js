const express = require('express');
const router = express.Router();

// Tour request modeli (basit bir şema)
const tourRequestSchema = {
  propertyId: String,
  propertyTitle: String,
  date: Date,
  time: String,
  name: String,
  phone: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
};

// In-memory storage (gerçek projede database kullanılmalı)
let tourRequests = [];

// Tour request oluştur
router.post('/', async (req, res) => {
  try {
    const tourRequest = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };
    
    tourRequests.push(tourRequest);
    
    // Burada email gönderme işlemi yapılabilir
    console.log('Yeni tur talebi:', tourRequest);
    
    res.status(201).json({
      message: 'Tur talebiniz başarıyla alındı!',
      tourRequest
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Tüm tour request'leri getir (admin için)
router.get('/', async (req, res) => {
  try {
    res.json(tourRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
