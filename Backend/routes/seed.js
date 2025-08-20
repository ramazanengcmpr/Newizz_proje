const express = require("express");
const router = express.Router();
const Property = require("../models/Property");
const sampleProperties = require("../seed-data");

// Seed endpoint
router.get("/", async (req, res) => {
  try {
    // Eski verileri sil
    await Property.deleteMany({});
    console.log("🗑️ Mevcut veriler temizlendi");

    const inserted = [];

    // Yeni verileri ekle
    for (const property of sampleProperties) {
      const doc = new Property(property);
      await doc.save();
      inserted.push(doc);
      console.log(`✅ ${property.title} eklendi (skor: ${doc.score}, lat: ${doc.lat}, lng: ${doc.lng})`);
    }

    // JSON cevabı (lat/lng dahil)
    res.json({
      message: "🌱 Seed data başarıyla eklendi",
      count: inserted.length,
      data: inserted.map((p) => ({
        title: p.title,
        score: p.score,
        lat: p.lat,
        lng: p.lng,
      })),
    });
  } catch (error) {
    console.error("❌ Seed data hatası:", error);
    res.status(500).json({ message: "Seed data eklenemedi", error: error.message });
  }
});

module.exports = router;
