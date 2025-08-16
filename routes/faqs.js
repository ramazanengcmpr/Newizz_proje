const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');

// Tüm FAQ'ları getir
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kategoriye göre FAQ'ları getir
router.get('/category/:category', async (req, res) => {
  try {
    const faqs = await FAQ.find({ 
      category: req.params.category,
      isActive: true 
    }).sort({ order: 1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// FAQ oluştur
router.post('/', async (req, res) => {
  try {
    const faq = new FAQ(req.body);
    const savedFAQ = await faq.save();
    res.status(201).json(savedFAQ);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// FAQ güncelle
router.put('/:id', async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!faq) {
      return res.status(404).json({ message: 'FAQ bulunamadı' });
    }
    res.json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// FAQ sil
router.delete('/:id', async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ bulunamadı' });
    }
    res.json({ message: 'FAQ başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
