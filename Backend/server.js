console.log("✅ seed.js route yüklendi");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Route modules
const propertiesRouter = require('./routes/properties');
const faqsRouter = require('./routes/faqs');
const toursRouter = require('./routes/tours');
const authRouter = require('./routes/auth');
const seedRoutes = require('./routes/seed');

// Scoring
const { calculateScore, calculateScore10 } = require('./scoring');

const app = express();
const PORT = process.env.PORT || 3000;

// 🌍 CORS ayarı
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://newizz-frontend.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman, curl gibi durumlar için izin
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.error("❌ CORS Engellendi:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🧮 Score calculator global
app.locals.calculateScore = calculateScore;
app.locals.calculateScore10 = calculateScore10;

// 🔗 MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/newizz_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB'ye başarıyla bağlandı"))
.catch((err) => console.error("❌ MongoDB bağlantı hatası:", err.message));

const db = mongoose.connection;
db.on('error', console.error.bind(console, "❌ MongoDB bağlantı hatası:"));
db.once('open', () => console.log("📡 MongoDB bağlantısı aktif"));

// 📌 Router'ları mount et
app.use('/api/properties', propertiesRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/tours', toursRouter);
app.use('/api/auth', authRouter);
app.use('/api/seed', seedRoutes); // ✅ seed.js burada mount edildi

// Ana endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Newizz API çalışıyor!",
    endpoints: {
      properties: "/api/properties",
      faqs: "/api/faqs",
      tours: "/api/tours",
      seed: "/api/seed"
    }
  });
});

// 🚀 Server başlat
app.listen(PORT, () => {
  console.log(`🌍 Server ${PORT} portunda çalışıyor`);
});
