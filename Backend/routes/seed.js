const express = require("express");
const router = express.Router();
const Property = require("../models/Property");
const sampleProperties = require("../seed-data");
// Senin sampleProperties verilerini buraya koyuyoruz:


router.get("/", async (req, res) => {
  try {
    await Property.deleteMany({});
    console.log("Mevcut veriler temizlendi");

    const inserted = [];
    for (const property of sampleProperties) {
      const doc = new Property(property);
      await doc.save(); // ✅ Score pre('save') ile otomatik hesaplanıyor
      inserted.push(doc);
      console.log(`${property.title} eklendi (skor: ${doc.score})`);
    }

    res.json({
      message: "Seed data başarıyla eklendi",
      count: inserted.length,
      data: inserted.map(p => ({
        title: p.title,
        score: p.score
      }))
    });
  } catch (error) {
    console.error("Seed data hatası:", error);
    res.status(500).json({ message: "Seed data eklenemedi", error: error.message });
  }
});

module.exports = router;
