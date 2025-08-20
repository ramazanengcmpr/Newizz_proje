const mongoose = require('mongoose');
const Property = require('./models/Property');

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/newizz_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const sampleProperties = [
  {
    title: "Lüks Villa - Palm Jumeirah",
    location: "Palm Jumeirah, Dubai",
    price: 2500000,
    bedrooms: 4,
    bathrooms: 5,
    size: 4500,
    status: "For Sale",
    propertyType: "Villa",
    description: "Deniz manzaralı, özel havuzlu lüks villa.",
    mainImage: "assets/img/card_img_1.jpg",
    roi: 8, payment_plan: 7, delivery: 6, urgency: 8,
    prestige: 9, amenities: 8, velocity: 7, launch: 6,
    price_per_sqm: 7, horizon: 8, type_fit: 7, legal: 8
  },
  {
    title: "Modern Apartment - Downtown",
    location: "Downtown Dubai",
    price: 1200000,
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    status: "For Rent",
    propertyType: "Apartment",
    description: "Şehir merkezinde modern tasarımlı daire.",
    mainImage: "assets/img/card_img_2.jpg",
    roi: 6, payment_plan: 5, delivery: 7, urgency: 5,
    prestige: 6, amenities: 7, velocity: 6, launch: 5,
    price_per_sqm: 6, horizon: 5, type_fit: 6, legal: 7
  },
  {
    title: "Family House - Jumeirah Village",
    location: "Jumeirah Village Circle",
    price: 1750000,
    bedrooms: 3,
    bathrooms: 3,
    size: 2200,
    status: "For Sale",
    propertyType: "House",
    description: "Aileler için ideal geniş ev, bahçeli.",
    mainImage: "assets/img/card_img_3.jpg",
    roi: 7, payment_plan: 6, delivery: 7, urgency: 6,
    prestige: 6, amenities: 7, velocity: 6, launch: 5,
    price_per_sqm: 6, horizon: 6, type_fit: 6, legal: 6
  },
  {
    title: "Luxury Condo - Dubai Marina",
    location: "Dubai Marina",
    price: 2000000,
    bedrooms: 3,
    bathrooms: 4,
    size: 2800,
    status: "For Sale",
    propertyType: "Condo",
    description: "Dubai Marina’da deniz manzaralı lüks condo.",
    mainImage: "assets/img/card_img_4.jpg",
    roi: 8, payment_plan: 7, delivery: 6, urgency: 7,
    prestige: 8, amenities: 8, velocity: 7, launch: 6,
    price_per_sqm: 7, horizon: 7, type_fit: 7, legal: 8
  },
  {
    title: "Townhouse - Arabian Ranches",
    location: "Arabian Ranches",
    price: 1600000,
    bedrooms: 3,
    bathrooms: 3,
    size: 2100,
    status: "For Sale",
    propertyType: "Townhouse",
    description: "Arabian Ranches’te modern tasarımlı townhouse.",
    mainImage: "assets/img/card_img_5.jpg",
    roi: 7, payment_plan: 6, delivery: 6, urgency: 6,
    prestige: 7, amenities: 7, velocity: 6, launch: 5,
    price_per_sqm: 6, horizon: 6, type_fit: 7, legal: 7
  },
  {
    title: "Cozy Apartment - Business Bay",
    location: "Business Bay",
    price: 950000,
    bedrooms: 1,
    bathrooms: 1,
    size: 800,
    status: "For Rent",
    propertyType: "Apartment",
    description: "Business Bay’de şehir manzaralı stüdyo daire.",
    mainImage: "assets/img/card_img_6.jpg",
    roi: 5, payment_plan: 5, delivery: 6, urgency: 5,
    prestige: 6, amenities: 6, velocity: 6, launch: 5,
    price_per_sqm: 5, horizon: 5, type_fit: 5, legal: 6
  },
  {
    title: "Penthouse - Downtown Dubai",
    location: "Downtown Dubai",
    price: 4500000,
    bedrooms: 5,
    bathrooms: 6,
    size: 5000,
    status: "For Sale",
    propertyType: "Apartment",
    description: "Lüks penthouse, Burj Khalifa manzaralı.",
    mainImage: "assets/img/card_img_7.jpg",
    roi: 9, payment_plan: 8, delivery: 7, urgency: 8,
    prestige: 10, amenities: 9, velocity: 8, launch: 7,
    price_per_sqm: 8, horizon: 8, type_fit: 9, legal: 9
  },
  {
    title: "Beachfront Villa - JBR",
    location: "Jumeirah Beach Residence",
    price: 3800000,
    bedrooms: 4,
    bathrooms: 5,
    size: 4200,
    status: "For Sale",
    propertyType: "Villa",
    description: "Denize sıfır villa, özel plaj erişimli.",
    mainImage: "assets/img/card_img_8.jpg",
    roi: 8, payment_plan: 7, delivery: 7, urgency: 7,
    prestige: 9, amenities: 9, velocity: 7, launch: 6,
    price_per_sqm: 8, horizon: 7, type_fit: 8, legal: 8
  },
  {
    title: "Smart Apartment - Al Barsha",
    location: "Al Barsha",
    price: 1100000,
    bedrooms: 2,
    bathrooms: 2,
    size: 1300,
    status: "For Sale",
    propertyType: "Apartment",
    description: "Akıllı ev sistemleriyle donatılmış modern daire.",
    mainImage: "assets/img/card_img_9.jpg",
    roi: 6, payment_plan: 6, delivery: 7, urgency: 6,
    prestige: 6, amenities: 7, velocity: 6, launch: 6,
    price_per_sqm: 6, horizon: 6, type_fit: 6, legal: 6
  },
  {
    title: "Luxury House - Emirates Hills",
    location: "Emirates Hills",
    price: 5500000,
    bedrooms: 6,
    bathrooms: 7,
    size: 6500,
    status: "For Sale",
    propertyType: "House",
    description: "Emirates Hills’de ultra lüks villa, havuzlu.",
    mainImage: "assets/img/card_img_10.jpg",
    roi: 9, payment_plan: 8, delivery: 7, urgency: 9,
    prestige: 10, amenities: 9, velocity: 8, launch: 8,
    price_per_sqm: 9, horizon: 9, type_fit: 9, legal: 9
  },
  {
    title: "Modern Condo - Dubai Creek",
    location: "Dubai Creek Harbour",
    price: 1800000,
    bedrooms: 3,
    bathrooms: 3,
    size: 2000,
    status: "For Sale",
    propertyType: "Condo",
    description: "Dubai Creek’te modern mimarili condo.",
    mainImage: "assets/img/card_img_11.jpg",
    roi: 7, payment_plan: 6, delivery: 6, urgency: 6,
    prestige: 7, amenities: 7, velocity: 6, launch: 6,
    price_per_sqm: 7, horizon: 7, type_fit: 7, legal: 7
  },
  {
    title: "Townhouse - Mirdif",
    location: "Mirdif",
    price: 1400000,
    bedrooms: 3,
    bathrooms: 3,
    size: 1900,
    status: "For Sale",
    propertyType: "Townhouse",
    description: "Mirdif’te aile yaşamına uygun townhouse.",
    mainImage: "assets/img/card_img_12.jpg",
    roi: 6, payment_plan: 6, delivery: 6, urgency: 6,
    prestige: 6, amenities: 6, velocity: 6, launch: 6,
    price_per_sqm: 6, horizon: 6, type_fit: 6, legal: 6
  },
  {
    title: "Apartment - Dubai Silicon Oasis",
    location: "Dubai Silicon Oasis",
    price: 900000,
    bedrooms: 1,
    bathrooms: 1,
    size: 750,
    status: "For Rent",
    propertyType: "Apartment",
    description: "Dubai Silicon Oasis’te uygun fiyatlı daire.",
    mainImage: "assets/img/card_img_13.jpg",
    roi: 5, payment_plan: 5, delivery: 6, urgency: 5,
    prestige: 5, amenities: 5, velocity: 5, launch: 5,
    price_per_sqm: 5, horizon: 5, type_fit: 5, legal: 5
  },
  {
    title: "Villa - The Springs",
    location: "The Springs",
    price: 2200000,
    bedrooms: 4,
    bathrooms: 4,
    size: 3000,
    status: "For Sale",
    propertyType: "Villa",
    description: "The Springs’te doğa ile iç içe villa.",
    mainImage: "assets/img/card_img_14.jpg",
    roi: 7, payment_plan: 6, delivery: 7, urgency: 7,
    prestige: 7, amenities: 7, velocity: 7, launch: 6,
    price_per_sqm: 7, horizon: 7, type_fit: 7, legal: 7
  },
  {
    title: "Condo - DIFC",
    location: "Dubai International Financial Centre",
    price: 1950000,
    bedrooms: 2,
    bathrooms: 2,
    size: 1500,
    status: "For Sale",
    propertyType: "Condo",
    description: "DIFC’de iş merkezlerine yakın modern condo.",
    mainImage: "assets/img/card_img_15.jpg",
    roi: 7, payment_plan: 6, delivery: 6, urgency: 6,
    prestige: 7, amenities: 7, velocity: 6, launch: 6,
    price_per_sqm: 7, horizon: 7, type_fit: 7, legal: 7
  }
];

// Seed fonksiyonu
async function seedData() {
  try {
    await Property.deleteMany({});
    console.log('Mevcut veriler temizlendi');

    for (const property of sampleProperties) {
      const doc = new Property(property);
      await doc.save(); // ✅ Score otomatik hesaplanıyor (Property.js içinde pre('save'))
      console.log(`${property.title} eklendi (skor: ${doc.score})`);
    }

    const allProperties = await Property.find();
    console.log(`Toplam ${allProperties.length} property eklendi:`);

    allProperties.forEach(property => {
      console.log(`- ${property.title}: Score = ${property.score}`);
    });

  } catch (error) {
    console.error('Seed data hatası:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB bağlantısı kapatıldı');
  }
}

seedData();
//