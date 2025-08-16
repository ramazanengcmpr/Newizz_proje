// Environment variables'ları yükle
require('dotenv').config();
const authRoutes = require('./routes/auth');

const userRoutes = require("./routes/users");

const propertyRoutes = require('./routes/properties');


// Middleware import
const authMiddleware = require("./middleware/authMiddleware");

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
// SCORE HESAPLAMA FONKSİYONU
const calculateScore10 = require('./scoring');
app.locals.calculateScore10 = calculateScore10;

// Middleware
app.use('/api/properties', authMiddleware, propertyRoutes);
app.use("/api/users", userRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
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
