const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Review = require('../models/Review');

// Tüm property'leri getir (score eklenmiş)
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });

    // server.js içinde app.locals ile eklenen fonksiyon
    const calculateScore10 = req.app.locals.calculateScore10;

    const withScores = properties.map(p => ({
      ...p.toObject(),
      score: calculateScore10({
        roi: p.roi,
        payment_plan: p.payment_plan,
        delivery: p.delivery,
        urgency: p.urgency,
        prestige: p.prestige,
        amenities: p.amenities,
        velocity: p.velocity,
        launch: p.launch,
        price_per_sqm: p.price_per_sqm,
        horizon: p.horizon,
        type_fit: p.type_fit,
        legal: p.legal
      })
    }));

    res.json(withScores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tek property getir (ID ile)
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property bulunamadı' });
    }

    const calculateScore10 = req.app.locals.calculateScore10;
    const propertyWithScore = {
      ...property.toObject(),
      score: calculateScore10({
        roi: property.roi,
        payment_plan: property.payment_plan,
        delivery: property.delivery,
        urgency: property.urgency,
        prestige: property.prestige,
        amenities: property.amenities,
        velocity: property.velocity,
        launch: property.launch,
        price_per_sqm: property.price_per_sqm,
        horizon: property.horizon,
        type_fit: property.type_fit,
        legal: property.legal
      })
    };

    res.json(propertyWithScore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Slug ile property getir
router.get('/slug/:slug', async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug });
    if (!property) {
      return res.status(404).json({ message: 'Property bulunamadı' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Property yorumlarını getir
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.id })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Property'e yorum ekle
router.post('/:id/reviews', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property bulunamadı' });
    }

    const review = new Review({
      propertyId: req.params.id,
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      rating: req.body.rating,
      comment: req.body.comment,
      avatarUrl: req.body.avatarUrl || 'https://via.placeholder.com/50x50'
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Review sil
router.delete('/:propertyId/reviews/:reviewId', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review bulunamadı' });
    }
    res.json({ message: 'Review başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Benzer property'leri getir
router.get('/:id/similar', async (req, res) => {
  try {
    const currentProperty = await Property.findById(req.params.id);
    if (!currentProperty) {
      return res.status(404).json({ message: 'Property bulunamadı' });
    }

    const similarProperties = await Property.find({
      _id: { $ne: req.params.id },
      propertyType: currentProperty.propertyType,
      price: {
        $gte: currentProperty.price * 0.7,
        $lte: currentProperty.price * 1.3
      }
    }).limit(6);

    res.json(similarProperties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Property oluştur
router.post('/', async (req, res) => {
  try {
    const property = new Property(req.body);
    const savedProperty = await property.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Property güncelle
router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!property) {
      return res.status(404).json({ message: 'Property bulunamadı' });
    }
    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Property sil
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property bulunamadı' });
    }
    res.json({ message: 'Property başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
