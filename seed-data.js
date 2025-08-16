const { calculateScore } = require('./scoring');
const mongoose = require('mongoose');
require('dotenv').config();

const Property = require('./models/Property');
const Review = require('./models/Review');
const FAQ = require('./models/FAQ');

// ✅ MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/newizz', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB'ye başarıyla bağlandı"))
.catch(err => {
  console.error("❌ MongoDB bağlantı hatası:", err);
  process.exit(1);
});

// ==== DÜZELTİLMİŞ TEST VERİLERİ ====

// Properties
const sampleProperties = [
  {
    title: "Lüks Villa - Deniz Manzaralı",
    price: 2500000,
    location: "Beşiktaş, İstanbul",
    bedrooms: 4,
    bathrooms: 3,
    size: 280,                // m²
    status: "For Sale",
    score: 4.8,               // opsiyonel
    description:
      "Deniz manzaralı, lüks donanımlı, özel havuzlu villa. Modern tasarım ve yüksek kaliteli malzemeler kullanılmıştır.",
    mainImage: "/assets/img/property_img_1.jpg",
    images: [
      "/assets/img/property_img_1.jpg",
      "/assets/img/property_img_2.jpg",
      "/assets/img/property_img_3.jpg"
    ],
    features: [
      "Özel Havuz",
      "Akıllı Ev Sistemi",
      "Güvenlik Sistemi",
      "Garaj (2 Araç)",
      "Bahçe",
      "Teras",
      "Klima",
      "Asansör"
    ],
    floorPlans: [
      {
        title: "Zemin Kat",
        image: "/assets/img/floor_1.png",
        description: "Oturma odası, yemek odası, mutfak, 1 yatak odası"
      },
      {
        title: "1. Kat",
        image: "/assets/img/floor_1.png",
        description: "3 yatak odası, 2 banyo, çalışma odası"
      }
    ],
    videoUrl: "https://www.youtube.com/watch?v=example1",
    virtualVideoUrl: "https://www.youtube.com/watch?v=example2",
    nearby: {
      education: [
        { name: "İstanbul Teknik Üniversitesi", distance: "1.2 km", type: "Üniversite" },
        { name: "Beşiktaş Anadolu Lisesi", distance: "0.8 km", type: "Lise" }
      ],
      stores: [
        { name: "Carrefour", distance: "0.5 km", type: "Süpermarket" },
        { name: "Migros", distance: "1.0 km", type: "Süpermarket" }
      ],
      health: [
        { name: "Beşiktaş Devlet Hastanesi", distance: "1.5 km", type: "Hastane" },
        { name: "Özel Tıp Merkezi", distance: "0.7 km", type: "Sağlık Merkezi" }
      ]
    },
    propertyType: "Villa",
    slug: "luks-villa-deniz-manzarali"
  },
  {
    title: "Modern Daire - Şehir Merkezi",
    price: 850000,
    location: "Kadıköy, İstanbul",
    bedrooms: 2,
    bathrooms: 1,
    size: 95,                 // m²
    status: "For Sale",
    score: 4.5,               // opsiyonel
    description:
      "Şehir merkezinde, ulaşımı kolay, modern tasarımlı daire. Metro ve otobüs duraklarına yakın.",
    mainImage: "/assets/img/card_img_1.jpg",
    images: [
      "/assets/img/card_img_1.jpg",
      "/assets/img/card_img_2.jpg",
      "/assets/img/card_img_3.jpg"
    ],
    features: [
      "Klima",
      "Asansör",
      "Güvenlik",
      "Otopark",
      "Balkon",
      "Ebeveyn Banyosu"
    ],
    floorPlans: [
      {
        title: "Tek Kat",
        image: "/assets/img/floor_1.png",
        description: "2 yatak odası, 1 banyo, oturma odası, mutfak"
      }
    ],
    videoUrl: "https://www.youtube.com/watch?v=example3",
    virtualVideoUrl: null,
    nearby: {
      education: [
        { name: "Kadıköy Anadolu Lisesi", distance: "0.3 km", type: "Lise" },
        { name: "Marmara Üniversitesi", distance: "2.1 km", type: "Üniversite" }
      ],
      stores: [
        { name: "A101", distance: "0.2 km", type: "Market" },
        { name: "BİM", distance: "0.4 km", type: "Market" }
      ],
      health: [
        { name: "Kadıköy Devlet Hastanesi", distance: "1.8 km", type: "Hastane" },
        { name: "Özel Klinik", distance: "0.6 km", type: "Klinik" }
      ]
    },
    propertyType: "Apartment",
    slug: "modern-daire-sehir-merkezi"
  }
];

// Reviews
const sampleReviews = [
  {
    propertyId: null, // seed sırasında ilişkilendirilecek
    userName: "Ahmet Yılmaz",
    userAvatar: "/assets/img/avatar_1.jpg",
    rating: 5,
    comment:
      "Harika bir ev! Deniz manzarası muhteşem ve konumu çok merkezi. Kesinlikle tavsiye ederim."
  },
  {
    propertyId: null,
    userName: "Ayşe Demir",
    userAvatar: "/assets/img/avatar_2.jpg",
    rating: 4,
    comment: "Güzel ev ama fiyat biraz yüksek. Yine de kalitesi fiyatına değer."
  },
  {
    propertyId: null,
    userName: "Mehmet Kaya",
    userAvatar: "/assets/img/avatar_3.jpg",
    rating: 5,
    comment:
      "Mükemmel! Tüm beklentilerimi karşıladı. Özellikle güvenlik sistemi çok iyi."
  }
];

// FAQs
const sampleFAQs = [
  {
    question: "Emlak alım-satım işlemlerinde hangi belgeler gerekli?",
    answer:
      "Kimlik fotokopisi, tapu, emlak beyannamesi, vergi levhası ve gerekli diğer belgeler gereklidir.",
    category: "Property",
    order: 1
  },
  {
    question: "Kredi çekmek için hangi şartlar aranır?",
    answer:
      "Düzenli gelir, kredi notu, teminat ve bankanın belirlediği diğer şartlar aranır.",
    category: "Payment",
    order: 2
  },
  {
    question: "Emlak vergisi ne zaman ödenir?",
    answer:
      "Emlak vergisi yılda iki taksit halinde Mart ve Kasım aylarında ödenir.",
    category: "Legal",
    order: 3
  },
  {
    question: "Tapu işlemleri ne kadar sürer?",
    answer: "Normal şartlarda tapu işlemleri 1–3 iş günü içinde tamamlanır.",
    category: "Property",
    order: 4
  }
];

const samplePropertiesWithScore = sampleProperties.map(property => {
  return {
    ...property,
    score: calculateScore(property) // scoring.js fonksiyonunu kullan
  };
});


// --- Veritabanını doldur ---
async function seedDatabase() {
  try {
    await Property.deleteMany({});
    await Review.deleteMany({});
    await FAQ.deleteMany({});

    const savedProperties = await Property.insertMany(samplePropertiesWithScore);

    console.log(`${savedProperties.length} property eklendi`);

    const reviewsWithPropertyId = sampleReviews.map((review, index) => ({
      ...review,
      propertyId: savedProperties[index % savedProperties.length]._id
    }));
    const savedReviews = await Review.insertMany(reviewsWithPropertyId);
    console.log(`${savedReviews.length} review eklendi`);

    const savedFAQs = await FAQ.insertMany(sampleFAQs);
    console.log(`${savedFAQs.length} FAQ eklendi`);

    console.log('✅ Test verisi başarıyla eklendi!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test verisi eklenirken hata:', error);
    process.exit(1);
  }
}

// Script çalıştırılırsa seed işlemini başlat
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
