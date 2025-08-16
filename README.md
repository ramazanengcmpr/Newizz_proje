# Newizz Backend API

Bu proje Newizz emlak sitesi için dinamik backend API'sidir.

## 🚀 Kurulum

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Environment variables ayarlayın:**
`.env` dosyası oluşturun:
```
MONGO_URI=mongodb://localhost:27017/newizz_db
PORT=3000
NODE_ENV=development
```

3. **MongoDB'yi başlatın:**
MongoDB'nin çalıştığından emin olun.

4. **Test verisini yükleyin:**
```bash
npm run seed
```

5. **Server'ı başlatın:**
```bash
npm start
```

## 📡 API Endpoints

### Properties
- `GET /api/properties` - Tüm property'leri getir
- `GET /api/properties/:id` - ID ile property getir
- `GET /api/properties/slug/:slug` - Slug ile property getir
- `GET /api/properties/:id/reviews` - Property yorumlarını getir
- `GET /api/properties/:id/similar` - Benzer property'leri getir
- `POST /api/properties` - Yeni property oluştur
- `PUT /api/properties/:id` - Property güncelle
- `DELETE /api/properties/:id` - Property sil

### Reviews
- `GET /api/properties/:id/reviews` - Property yorumlarını getir
- `DELETE /api/properties/:propertyId/reviews/:reviewId` - Review sil

### FAQs
- `GET /api/faqs` - Tüm FAQ'ları getir
- `GET /api/faqs/category/:category` - Kategoriye göre FAQ'ları getir
- `POST /api/faqs` - Yeni FAQ oluştur
- `PUT /api/faqs/:id` - FAQ güncelle
- `DELETE /api/faqs/:id` - FAQ sil

### Tours
- `POST /api/tours` - Tur talebi oluştur
- `GET /api/tours` - Tüm tur taleplerini getir (admin)

## 🗄️ Veritabanı Modelleri

### Property
- Ana property bilgileri (başlık, fiyat, konum, vb.)
- Görseller ve özellikler
- Kat planları ve video linkleri
- Çevredeki alanlar

### Review
- Property yorumları
- Kullanıcı bilgileri ve puanlama

### FAQ
- Sık sorulan sorular
- Kategori ve sıralama

## 🔧 Scripts

- `npm start` - Production server başlat
- `npm run dev` - Development server başlat (nodemon)
- `npm run seed` - Test verisi yükle

## 🌐 Frontend Entegrasyonu

Frontend'de `assets/js/dynamic-content.js` dosyası kullanılarak:
- Property detayları dinamik olarak yüklenir
- Yorumlar ve benzer ilanlar çekilir
- FAQ'lar otomatik doldurulur
- Tour formu backend'e gönderilir

## 🛠️ Admin Panel

Admin paneline erişmek için:
1. Ana sayfada "Admin" butonuna tıklayın
2. Veya direkt `admin.html` sayfasına gidin

### Admin Panel Özellikleri:
- **Dashboard**: Genel istatistikler
- **Properties**: Property ekleme, silme, düzenleme
- **Reviews**: Yorumları görüntüleme ve silme
- **FAQs**: FAQ ekleme, silme, düzenleme
- **Tour Requests**: Tur taleplerini görüntüleme

### Admin Panel URL:
```
http://localhost:3000/admin.html
```

## 📝 Örnek Kullanım

```javascript
// Property detaylarını getir
fetch('http://localhost:3000/api/properties/123')
  .then(response => response.json())
  .then(property => {
    console.log(property);
  });

// Yorumları getir
fetch('http://localhost:3000/api/properties/123/reviews')
  .then(response => response.json())
  .then(reviews => {
    console.log(reviews);
  });
```

## 🔒 Güvenlik

- CORS ayarları yapılandırıldı
- Environment variables kullanımı
- Input validation (Mongoose schemas)

## 🚀 Production

Production için:
1. Environment variables'ları ayarlayın
2. MongoDB Atlas veya cloud MongoDB kullanın
3. PM2 veya benzeri process manager kullanın
4. SSL sertifikası ekleyin
5. Admin panel için authentication ekleyin
