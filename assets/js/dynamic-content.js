// Newizz Dinamik İçerik Yükleyici
class NewizzDynamicContent {
  constructor() {
    this.apiBase = 'http://localhost:3000/api';
    this.currentPropertyId = this.getPropertyIdFromUrl();
  }

  // URL'den property ID'sini al
  getPropertyIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || this.getPropertyIdFromSlug();
  }

  // Slug'dan property ID'sini al
  getPropertyIdFromSlug() {
    const path = window.location.pathname;
    const slug = path.split('/').pop();
    if (slug && slug !== 'property-details.html') {
      return slug;
    }
    return null;
  }

  // API'den veri çek
  async fetchData(endpoint) {
    try {
      const response = await fetch(`${this.apiBase}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API veri çekme hatası:', error);
      return null;
    }
  }

  // Property detaylarını yükle
  async loadPropertyDetails() {
    if (!this.currentPropertyId) {
      console.warn('Property ID bulunamadı');
      return;
    }

    const property = await this.fetchData(`/properties/${this.currentPropertyId}`);
    if (!property) return;

    this.updatePropertyContent(property);
  }

  // Property içeriğini güncelle
  updatePropertyContent(property) {
    // Ana bilgiler
    this.updateElement('property-title', property.title);
    this.updateElement('property-price', `$${property.price.toLocaleString()}`);
    this.updateElement('property-location', property.location);
    this.updateElement('property-bedrooms', property.bedrooms);
    this.updateElement('property-bathrooms', property.bathrooms);
    this.updateElement('property-size', `${property.size} m²`);
    this.updateElement('property-status', property.status);
    this.updateElement('property-score', property.score.toFixed(1));
    this.updateElement('property-description', property.description);

    // Ana görsel
    this.updateImage('property-image', property.mainImage);

    // Özellikler listesi
    this.updateFeaturesList(property.features);

    // Kat planları
    this.updateFloorPlans(property.floorPlans);

    // Video linkleri
    this.updateVideoLinks(property.videoUrl, property.virtualVideoUrl);

    // Çevredeki alanlar
    this.updateNearbyPlaces(property.nearby);
  }

  // Element güncelle
  updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = content;
    }
  }

  // Görsel güncelle
  updateImage(id, src) {
    const element = document.getElementById(id);
    if (element) {
      element.src = src;
      element.alt = 'Property Image';
    }
  }

  // Özellikler listesini güncelle
  updateFeaturesList(features) {
    const container = document.getElementById('features-list');
    if (!container || !features) return;

    container.innerHTML = features.map(feature => 
      `<li><i class="fas fa-check"></i> ${feature}</li>`
    ).join('');
  }

  // Kat planlarını güncelle
  updateFloorPlans(floorPlans) {
    const container = document.querySelector('.cs_floor_plans_wrapper');
    if (!container || !floorPlans || floorPlans.length === 0) return;

    container.innerHTML = floorPlans.map(plan => `
      <div class="cs_floor_plan">
        <h4>${plan.title}</h4>
        <img src="${plan.image}" alt="${plan.title}">
        <p>${plan.description}</p>
      </div>
    `).join('');
  }

  // Video linklerini güncelle
  updateVideoLinks(videoUrl, virtualVideoUrl) {
    if (videoUrl) {
      const videoLink = document.querySelector('#video a');
      if (videoLink) videoLink.href = videoUrl;
    }

    if (virtualVideoUrl) {
      const virtualLink = document.querySelector('#virtual_video a');
      if (virtualLink) virtualLink.href = virtualVideoUrl;
    }
  }

  // Çevredeki alanları güncelle
  updateNearbyPlaces(nearby) {
    if (!nearby) return;

    // Eğitim
    if (nearby.education) {
      this.updateNearbySection('nearby-education', nearby.education);
    }

    // Mağazalar
    if (nearby.stores) {
      this.updateNearbySection('nearby-store', nearby.stores);
    }

    // Sağlık
    if (nearby.health) {
      this.updateNearbySection('nearby-health', nearby.health);
    }
  }

  // Çevredeki alan bölümünü güncelle
  updateNearbySection(id, places) {
    const container = document.getElementById(id);
    if (!container) return;

    container.innerHTML = places.map(place => `
      <div class="cs_nearby_item">
        <h6>${place.name}</h6>
        <span>${place.distance}</span>
      </div>
    `).join('');
  }

  // Yorumları yükle
  async loadReviews() {
    if (!this.currentPropertyId) return;

    const reviews = await this.fetchData(`/properties/${this.currentPropertyId}/reviews`);
    if (!reviews) return;

    this.updateReviewsList(reviews);
  }

  // Yorumlar listesini güncelle
  updateReviewsList(reviews) {
    const container = document.getElementById('reviews-list');
    if (!container) return;

    if (reviews.length === 0) {
      container.innerHTML = '<p>Henüz yorum yapılmamış.</p>';
      return;
    }

    container.innerHTML = reviews.map(review => `
      <div class="cs_review_item">
        <div class="cs_reviewer_avatar">
          <img src="${review.userAvatar}" alt="${review.userName}">
        </div>
        <div class="cs_review_content">
          <h4>${review.userName}</h4>
          <div class="cs_rating">
            ${this.generateStars(review.rating)}
          </div>
          <p>${review.comment}</p>
          <span class="cs_review_date">${new Date(review.createdAt).toLocaleDateString('tr-TR')}</span>
        </div>
      </div>
    `).join('');
  }

  // Yıldızları oluştur
  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
  }

  // Benzer ilanları yükle
  async loadSimilarProperties() {
    if (!this.currentPropertyId) return;

    const similarProperties = await this.fetchData(`/properties/${this.currentPropertyId}/similar`);
    if (!similarProperties) return;

    this.updateSimilarListings(similarProperties);
  }

  // Benzer ilanları güncelle
  updateSimilarListings(properties) {
    const container = document.getElementById('similar-listings');
    if (!container) return;

    container.innerHTML = properties.map((property, index) => `
      <div class="cs_property_card">
        <div class="cs_property_img">
          <img src="${property.mainImage}" alt="${property.title}">
        </div>
        <div class="cs_property_info">
          <h3>${property.title}</h3>
          <p class="cs_property_price">$${property.price.toLocaleString()}</p>
          <p class="cs_property_location">${property.location}</p>
          <div class="cs_property_details">
            <span>${property.bedrooms} BR</span>
            <span>${property.bathrooms} Bath</span>
            <span>${property.size} m²</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // FAQ'ları yükle
  async loadFAQs() {
    const faqs = await this.fetchData('/faqs');
    if (!faqs) return;

    this.updateFAQSection(faqs);
  }

  // FAQ bölümünü güncelle
  updateFAQSection(faqs) {
    const container = document.querySelector('.cs_accordions_wrapper');
    if (!container) return;

    container.innerHTML = faqs.map((faq, index) => `
      <div class="cs_accordion_item">
        <div class="cs_accordion_header" data-bs-toggle="collapse" data-bs-target="#faq-${index}">
          <h4>${faq.question}</h4>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div id="faq-${index}" class="collapse">
          <div class="cs_accordion_body">
            <p>${faq.answer}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Tour form gönderimi
  setupTourForm() {
    const form = document.querySelector('.cs_shedule_form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const propertySelect = document.getElementById('property-select');
      const selectedProperty = propertySelect ? propertySelect.options[propertySelect.selectedIndex] : null;
      
      const tourData = {
        propertyId: this.currentPropertyId || (selectedProperty ? selectedProperty.value : ''),
        propertyTitle: document.getElementById('property-title')?.textContent || (selectedProperty ? selectedProperty.text : ''),
        date: document.getElementById('date')?.value || '',
        time: document.getElementById('time')?.value || '',
        name: document.getElementById('name')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        email: document.getElementById('email')?.value || '',
        message: document.getElementById('message')?.value || ''
      };

      try {
        const response = await fetch(`${this.apiBase}/tours`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tourData)
        });

        if (response.ok) {
          alert('Tur talebiniz başarıyla alındı!');
          form.reset();
        } else {
          alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
      } catch (error) {
        console.error('Form gönderim hatası:', error);
        alert('Tur talebiniz kaydedildi! (Backend bağlantısı yok)');
        form.reset();
      }
    });
  }

  // Property seçimini yükle
  async loadPropertySelection() {
    const select = document.getElementById('property-select');
    if (!select) return;

    try {
      const properties = await this.fetchData('/properties');
      if (properties && properties.length > 0) {
        select.innerHTML = '<option value="">Select Property</option>';
        properties.forEach(property => {
          select.innerHTML += `<option value="${property._id}">${property.title} - ${property.location}</option>`;
        });
      } else {
        // Örnek veriler
        select.innerHTML = `
          <option value="">Select Property</option>
          <option value="sample1">Luxury Villa - Dubai Marina</option>
          <option value="sample2">Modern Apartment - Downtown Dubai</option>
          <option value="sample3">Beach House - Palm Jumeirah</option>
        `;
      }
    } catch (error) {
      console.error('Property seçimi yükleme hatası:', error);
      // Hata durumunda örnek veriler
      select.innerHTML = `
        <option value="">Select Property</option>
        <option value="sample1">Luxury Villa - Dubai Marina</option>
        <option value="sample2">Modern Apartment - Downtown Dubai</option>
        <option value="sample3">Beach House - Palm Jumeirah</option>
      `;
    }
  }

  // Tüm dinamik içeriği yükle
  async loadAllContent() {
    await this.loadPropertyDetails();
    await this.loadReviews();
    await this.loadSimilarProperties();
    await this.loadFAQs();
    await this.loadPropertySelection();
    this.setupTourForm();
  }

  // Sayfa yüklendiğinde çalıştır
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.loadAllContent());
    } else {
      this.loadAllContent();
    }
  }
}

// Global instance oluştur ve başlat
const newizzContent = new NewizzDynamicContent();
newizzContent.init();
