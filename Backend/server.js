const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { calculate_score_10 } = require('./scoring');
// Route modules
const propertiesRouter = require('./routes/properties');
const faqsRouter = require('./routes/faqs');
const toursRouter = require('./routes/tours');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Expose score calculator for routes needing it
app.locals.calculateScore10 = calculate_score_10;

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/newizz_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB bağlantı hatası:'));
db.once('open', () => {
    console.log('MongoDB\'ye başarıyla bağlandı');
});

// Mount routers
app.use('/api/properties', propertiesRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/tours', toursRouter);
app.use('/api/auth', authRouter);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Newizz Backend API çalışıyor!' });
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});
