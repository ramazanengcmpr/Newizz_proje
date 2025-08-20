const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const calculate_score_10 = require('./scoring');

// Route modules
const propertiesRouter = require('./routes/properties');
const faqsRouter = require('./routes/faqs');
const toursRouter = require('./routes/tours');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS ayarı
const allowedOrigins = [
  "http://localhost:3000",                 // geliştirme
  "http://127.0.0.1:3000",                 // geliştirme alternatif
  "https://newizz-frontend.vercel.app"     // Vercel frontend domainin
];

app.use(cors({
  origin: function (origin, callback) {
    // origin boş olabilir (ör. Postman) -> izin ver
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS Engellendi:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ✅ Score calculator route'lara aktar
app.locals.calculateScore10 = calculate_score_10;

// ✅ MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/newizz_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ MongoDB bağlantı hatası:'));
db.once('open', () => {
  console.log('✅ MongoDB\'ye başarıyla bağlandı');
});

// ✅ Router'ları mount et
app.use('/api/properties', propertiesRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/tours', toursRouter);
app.use('/api/auth', authRouter);

// ✅ Test route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Newizz Backend API çalışıyor!' });
});

// ✅ Server başlat
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
});
