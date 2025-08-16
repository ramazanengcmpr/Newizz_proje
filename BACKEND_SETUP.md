# 🚀 Backend Server Kurulum Rehberi

## 📋 Gereksinimler
- Node.js (v14 veya üzeri)
- MongoDB (yerel veya cloud)

## 🔧 Kurulum Adımları

### 1. MongoDB Kurulumu
**Windows için:**
```bash
# MongoDB Community Server'ı indirin ve kurun
# https://www.mongodb.com/try/download/community

# MongoDB servisini başlatın
net start MongoDB
```

**Alternatif - MongoDB Atlas (Cloud):**
- https://cloud.mongodb.com adresine gidin
- Ücretsiz cluster oluşturun
- Connection string'i kopyalayın

### 2. Backend Server'ı Başlatın
```bash
# Backend klasörüne gidin
cd Backend

# Bağımlılıkları yükleyin
npm install

# .env dosyası oluşturun
echo MONGO_URI=mongodb://localhost:27017/newizz_db > .env
echo PORT=3000 >> .env

# Server'ı başlatın
npm start
```

### 3. Test Verilerini Yükleyin
```bash
# Yeni terminal açın
cd Backend
npm run seed
```

## ✅ Başarılı Kurulum Kontrolü

Server başarıyla çalıştığında şu mesajları görmelisiniz:
```
✅ MongoDB bağlantısı başarılı!
🚀 Server http://localhost:3000 adresinde çalışıyor
📊 Test verileri yüklendi
```

## 🔍 Sorun Giderme

### MongoDB Bağlantı Hatası
```bash
# MongoDB servisinin durumunu kontrol edin
sc query MongoDB

# Servisi yeniden başlatın
net stop MongoDB
net start MongoDB
```

### Port Çakışması
```bash
# 3000 portunu kullanan işlemleri bulun
netstat -ano | findstr :3000

# İşlemi sonlandırın (PID'yi değiştirin)
taskkill /PID <PID> /F
```

### Node.js Hatası
```bash
# Node.js versiyonunu kontrol edin
node --version

# npm cache'ini temizleyin
npm cache clean --force
```

## 🌐 API Endpoint'leri

Server çalıştığında şu endpoint'ler kullanılabilir:
- `GET http://localhost:3000/api/properties` - Tüm property'ler
- `GET http://localhost:3000/api/faqs` - Tüm FAQ'lar
- `POST http://localhost:3000/api/tours` - Tour talebi ekleme

## 📱 Admin Panel Erişimi

Backend çalıştıktan sonra:
1. `http://localhost:3000/admin.html` adresine gidin
2. Property'ler, FAQ'lar ve Review'lar yönetilebilir
3. Gerçek verilerle çalışmaya başlayın

## 🆘 Yardım

Sorun yaşarsanız:
1. Console'da hata mesajlarını kontrol edin
2. MongoDB'nin çalıştığından emin olun
3. Port 3000'in boş olduğunu kontrol edin
4. Node.js versiyonunun güncel olduğunu kontrol edin
