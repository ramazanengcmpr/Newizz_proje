console.log("✅ seed.js route yüklendi");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const seedRoutes = require("./routes/seed");
const { calculateScore, calculateScore10 } = require('./scoring');

// Route modules
const propertiesRouter = require('./routes/properties');
const faqsRouter = require('./routes/faqs');
const toursRouter = require('./routes/tours');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS ayarı
const allowedOrigins = [
  "http://localhost:3000",        // geliştirme
  "http://127.0.0.1:3000",        // geliştirme alternatifi
  "https://newizz-frontend.vercel.app" // Vercel frontend domaini
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      // Postman, curl gibi araçlarda origin olmayabilir → izin verelim
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.error("❌ CORS Engellendi:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// ✅ Score calculator’ları app.locals içine koy
app.locals.calculateScore = calculateScore;
app.locals.calculateScore10 = calculateScore10;

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/newizz_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ MongoDB bağlantı hatası:'));
db.once('open', () => {
  console.log('✅ MongoDB\'ye başarıyla bağlandı');
});

// Router’ları mount et
app.use('/api/properties', propertiesRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/tours', toursRouter);
app.use('/api/auth', authRouter);
app.use("/api/seed", seedRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Newizz Backend API çalışıyor!' });
});

// Server başlat
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
