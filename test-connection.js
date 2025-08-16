const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('MongoDB bağlantısı test ediliyor...');
    await mongoose.connect('mongodb://localhost:27017/newizz_db');
    console.log('✅ MongoDB bağlantısı başarılı!');
    
    // Test verisi var mı kontrol et
    const Property = require('./models/Property');
    const count = await Property.countDocuments();
    console.log(`📊 Veritabanında ${count} property bulundu`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error.message);
    process.exit(1);
  }
}

testConnection();
