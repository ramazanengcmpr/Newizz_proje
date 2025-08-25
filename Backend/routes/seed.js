const express = require("express");
const router = express.Router();
const Property = require("../models/Property");
const { sampleProperties } = require("../seed-data");
const calculateScore = require("../scoring");

// Seed endpoint
router.get("/", async (req, res) => {
  try {
    // Eski verileri sil
    await Property.deleteMany({});
    console.log("🗑️ Mevcut veriler temizlendi");

    // Skor eklenmiş veriler
    const samplePropertiesWithScore = sampleProperties.map(p => ({
      ...p,
      score: calculateScore(p),
    }));

    // Yeni verileri ekle
    const inserted = await Property.insertMany(samplePropertiesWithScore);

    console.log(`✅ ${inserted.length} property eklendi`);

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
