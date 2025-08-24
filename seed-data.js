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
    title: "Luxury Villa - Sea View",
    price: 2500000,
    location: "Beşiktaş, Istanbul",
    bedrooms: 4,
    bathrooms: 3,
    size: 280,                // m²
    status: "For Sale",
    score: 4.8,               // optional
    description:
      "Luxury villa with sea view, private pool, modern design, and high-quality materials.",
    mainImage: "/assets/img/property_img_1.jpg",
    images: [
      "/assets/img/property_img_1.jpg",
      "/assets/img/property_img_2.jpg",
      "/assets/img/property_img_3.jpg"
    ],
    features: [
      "Private Pool",
      "Smart Home System",
      "Security System",
      "Garage (2 Cars)",
      "Garden",
      "Terrace",
      "Air Conditioning",
      "Elevator"
    ],
    floorPlans: [
      {
        title: "Ground Floor",
        image: "/assets/img/floor_1.png",
        description: "Living room, dining room, kitchen, 1 bedroom"
      },
      {
        title: "First Floor",
        image: "/assets/img/floor_1.png",
        description: "3 bedrooms, 2 bathrooms, study room"
      }
    ],
    videoUrl: "https://www.youtube.com/watch?v=example1",
    virtualVideoUrl: "https://www.youtube.com/watch?v=example2",
    nearby: {
      education: [
        { name: "Istanbul Technical University", distance: "1.2 km", type: "University" },
        { name: "Beşiktaş Anatolian High School", distance: "0.8 km", type: "High School" }
      ],
      stores: [
        { name: "Carrefour", distance: "0.5 km", type: "Supermarket" },
        { name: "Migros", distance: "1.0 km", type: "Supermarket" }
      ],
      health: [
        { name: "Beşiktaş State Hospital", distance: "1.5 km", type: "Hospital" },
        { name: "Private Medical Center", distance: "0.7 km", type: "Medical Center" }
      ]
    },
    propertyType: "Villa",
    slug: "luxury-villa-sea-view"
  },
  {
    title: "Modern Apartment - City Center",
    price: 850000,
    location: "Kadıköy, Istanbul",
    bedrooms: 2,
    bathrooms: 1,
    size: 95,                 // m²
    status: "For Sale",
    score: 4.5,               // optional
    description:
      "Modern apartment located in the city center, easy transportation access, close to metro and bus stops.",
    mainImage: "/assets/img/card_img_1.jpg",
    images: [
      "/assets/img/card_img_1.jpg",
      "/assets/img/card_img_2.jpg",
      "/assets/img/card_img_3.jpg"
    ],
    features: [
      "Air Conditioning",
      "Elevator",
      "Security",
      "Parking Lot",
      "Balcony",
      "En-Suite Bathroom"
    ],
    floorPlans: [
      {
        title: "Single Floor",
        image: "/assets/img/floor_1.png",
        description: "2 bedrooms, 1 bathroom, living room, kitchen"
      }
    ],
    videoUrl: "https://www.youtube.com/watch?v=example3",
    virtualVideoUrl: null,
    nearby: {
      education: [
        { name: "Kadıköy Anatolian High School", distance: "0.3 km", type: "High School" },
        { name: "Marmara University", distance: "2.1 km", type: "University" }
      ],
      stores: [
        { name: "A101", distance: "0.2 km", type: "Market" },
        { name: "BIM", distance: "0.4 km", type: "Market" }
      ],
      health: [
        { name: "Kadıköy State Hospital", distance: "1.8 km", type: "Hospital" },
        { name: "Private Clinic", distance: "0.6 km", type: "Clinic" }
      ]
    },
    propertyType: "Apartment",
    slug: "modern-apartment-city-center"
  }
];

// Reviews
const sampleReviews = [
  {
    propertyId: null, // will be linked during seeding
    userName: "Ahmet Yılmaz",
    userAvatar: "/assets/img/avatar_1.jpg",
    rating: 5,
    comment:
      "Amazing house! The sea view is incredible and the location is very central. Highly recommended."
  },
  {
    propertyId: null,
    userName: "Ayşe Demir",
    userAvatar: "/assets/img/avatar_2.jpg",
    rating: 4,
    comment: "Beautiful house but a bit expensive. Still, the quality is worth the price."
  },
  {
    propertyId: null,
    userName: "Mehmet Kaya",
    userAvatar: "/assets/img/avatar_3.jpg",
    rating: 5,
    comment:
      "Perfect! Met all my expectations. Especially impressed with the security system."
  }
];

// FAQs
const sampleFAQs = [
  {
    question: "Which documents are required for real estate transactions?",
    answer:
      "ID copy, title deed, real estate declaration, tax certificate, and other required documents.",
    category: "Property",
    order: 1
  },
  {
    question: "What are the conditions for taking a loan?",
    answer:
      "Regular income, credit score, collateral, and other conditions determined by the bank.",
    category: "Payment",
    order: 2
  },
  {
    question: "When is property tax paid?",
    answer:
      "Property tax is paid twice a year, in March and November.",
    category: "Legal",
    order: 3
  },
  {
    question: "How long do title deed transactions take?",
    answer: "Under normal conditions, title deed transactions are completed within 1–3 business days.",
    category: "Property",
    order: 4
  }
];

const samplePropertiesWithScore = sampleProperties.map(property => {
  return {
    ...property,
    score: calculateScore(property) // use scoring.js function
  };
});


// Script çalıştırılırsa seed işlemini başlat
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
