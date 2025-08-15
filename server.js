// Environment variables'ları yükle
require('dotenv').config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
// SCORE HESAPLAMA FONKSİYONU
const calculateScore10 = require('./scoring');
app.locals.calculateScore10 = calculateScore10;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// MongoDB bağlantı konfigürasyonu
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/newizz_db";

// MongoDB bağlantısı
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB'ye başarıyla bağlandı");
})
.catch((err) => {
  console.error("❌ MongoDB bağlantı hatası:", err.message);
  process.exit(1);
});

// MongoDB bağlantı durumu dinleyicileri
mongoose.connection.on('connected', () => {
  console.log('Mongoose MongoDB\'ye bağlandı');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose bağlantı hatası:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose MongoDB bağlantısı kesildi');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB bağlantısı kapatıldı');
  //process.exit(0);
});

// SCORE HESAPLAMA FONKSİYONU
function calculateScore10(factors) {
    const weights = {
        roi: 0.35,
        payment_plan: 0.10,
        delivery: 0.05,
        urgency: 0.10,
        prestige: 0.05,
        amenities: 0.02,
        velocity: 0.05,
        launch: 0.03,
        price_per_sqm: 0.05,
        horizon: 0.03,
        type_fit: 0.02,
        legal: 0.05
    };

    let score = 0.0;
    for (let factor in weights) {
        let value = factors[factor] || 0;
        let normalized = value / 10;
        score += normalized * weights[factor] * 10;
    }
    return Math.round(score * 100) / 100;
}
app.locals.calculateScore10 = calculateScore10;

// Routes
const propertyRoutes = require('./routes/properties');
const faqRoutes = require('./routes/faqs');
const tourRoutes = require('./routes/tours');

app.use('/api/properties', propertyRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/tours', tourRoutes);

// Ana endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Newizz API çalışıyor!",
    endpoints: {
      properties: "/api/properties",
      faqs: "/api/faqs", 
      tours: "/api/tours"
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 Server ${port} portunda çalışıyor`);
  console.log(`📡 API: http://localhost:${port}/api`);
});
