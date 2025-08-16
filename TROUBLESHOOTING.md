# 🔧 Admin Panel Sorun Giderme Rehberi

## ❌ "500 Internal Server Error" Hatası

Bu hata genellikle backend server'ın çalışmadığından kaynaklanır.

### 🔍 Adım 1: Backend Server'ı Başlatın

```bash
# Backend klasörüne gidin
cd Backend

# Bağımlılıkları yükleyin (eğer yüklemediyseniz)
npm install

# Server'ı başlatın
npm start
```

### 🔍 Adım 2: MongoDB'nin Çalıştığını Kontrol Edin

MongoDB'nin çalıştığından emin olun:

**Windows için:**
```bash
# MongoDB servisinin durumunu kontrol edin
sc query MongoDB

# Eğer çalışmıyorsa başlatın
net start MongoDB
```

**Alternatif olarak:**
- MongoDB Compass'ı açın
- `mongodb://localhost:27017` adresine bağlanmayı deneyin

### 🔍 Adım 3: Test Verisini Yükleyin

```bash
cd Backend
npm run seed
```

### 🔍 Adım 4: Bağlantıyı Test Edin

```bash
cd Backend
node test-connection.js
```

### 🔍 Adım 5: Port Kontrolü

```bash
# 3000 portunda ne çalışıyor kontrol edin
netstat -an | findstr :3000
```

## 🚨 Yaygın Hatalar ve Çözümleri

### 1. "MongoDB bağlantı hatası"
- MongoDB'nin yüklü ve çalışır durumda olduğundan emin olun
- MongoDB servisini yeniden başlatın

### 2. "Port 3000 zaten kullanımda"
- Başka bir uygulama 3000 portunu kullanıyor olabilir
- Server'ı durdurun ve yeniden başlatın
- Veya farklı bir port kullanın

### 3. "Module not found"
- `npm install` komutunu çalıştırın
- `node_modules` klasörünün var olduğundan emin olun

## ✅ Başarılı Kurulum Kontrol Listesi

- [ ] MongoDB çalışıyor
- [ ] Backend server çalışıyor (port 3000)
- [ ] Test verisi yüklendi
- [ ] Admin panel açılıyor
- [ ] Dashboard verileri görünüyor

## 🌐 Admin Panel URL'leri

- **Ana sayfa**: `http://localhost:3000/index.html`
- **Admin panel**: `http://localhost:3000/admin.html`
- **API endpoint**: `http://localhost:3000/api`

## 📞 Hala Sorun Yaşıyorsanız

1. **Console loglarını kontrol edin** (F12 → Console)
2. **Network sekmesini kontrol edin** (F12 → Network)
3. **Backend server loglarını kontrol edin**
4. **MongoDB loglarını kontrol edin**

## 🔄 Hızlı Yeniden Başlatma

```bash
# 1. Tüm işlemleri durdurun
# 2. MongoDB'yi yeniden başlatın
# 3. Backend'i başlatın
cd Backend
npm start

# 4. Yeni terminal açın ve test verisini yükleyin
cd Backend
npm run seed

# 5. Admin paneli açın
# http://localhost:3000/admin.html
```
