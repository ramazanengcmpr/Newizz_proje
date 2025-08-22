const mongoose = require('mongoose');
const { calculateScore10 } = require('../scoring'); 


// Alt şemalar
const NearbyItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  distance: { type: String, required: true },
  type: { type: String, required: true }
}, { _id: false });

const FloorPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String }
}, { _id: false });

const propertySchema = new mongoose.Schema({
  // Ana bilgiler
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  size: { type: Number, required: true }, // m² cinsinden
  status: {
    type: String,
    enum: ['For Sale', 'For Rent', 'Sold', 'Rented', 'Under Construction', 'Ready','Off-Plan'],
    default: 'For Sale'
  },
  score: { type: Number, min: 0, max: 10, default: 0 },
  description: { type: String, required: true },

  // Görseller
  mainImage: { type: String, required: true },
  images: [{ type: String }],

  // Özellikler
  features: [{ type: String }],

  // Kat planları
  floorPlans: [FloorPlanSchema],

  // Video linkleri
  videoUrl: String,
  virtualVideoUrl: String,

  // Çevredeki alanlar
  nearby: {
    education: [NearbyItemSchema],
    stores: [NearbyItemSchema],
    health: [NearbyItemSchema]
  },

  // Ek bilgiler
  propertyType: {
    type: String,
    enum: ['Apartment', 'Villa', 'House', 'Condo', 'Townhouse'],
    required: true
  },
  yearBuilt: {
    type: Number,
    min: 1900,
    max: 2030,
    validate: {
      validator: function (v) {
        return !v || (v >= 1900 && v <= 2030);
      },
      message: 'Year Built must be between 1900 and 2030'
    }
  },

  // Faktörler (skor için gerekli alanlar)
  roi: Number,
  payment_plan: Number,
  delivery: Number,
  urgency: Number,
  prestige: Number,
  amenities: Number,
  velocity: Number,
  launch: Number,
  price_per_sqm: Number,
  horizon: Number,
  type_fit: Number,
  legal: Number,

  // SEO ve meta
  slug: { type: String, unique: true, required: false },

  // Tarih bilgileri
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }

}, { timestamps: true });

// Slug oluşturma middleware
propertySchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  // ✅ Skor otomatik hesaplama
  const factors = {
    roi: this.roi,
    payment_plan: this.payment_plan,
    delivery: this.delivery,
    urgency: this.urgency,
    prestige: this.prestige,
    amenities: this.amenities,
    velocity: this.velocity,
    launch: this.launch,
    price_per_sqm: this.price_per_sqm,
    horizon: this.horizon,
    type_fit: this.type_fit,
    legal: this.legal
  };
    this.score = calculateScore10(factors);


  next();
});

module.exports = mongoose.model('Property', propertySchema);
