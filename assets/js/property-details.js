// Property Details Dinamik Yükleme
console.log('Property Details JS yüklendi!');

class PropertyDetails {
    constructor() {
        this.apiBase = 'http://localhost:3000/api';
        this.propertyId = this.getPropertyIdFromUrl();
        this.init();
    }

    init() {
        // Eğer URL'de property ID yoksa, tüm property'leri listele
        if (!this.propertyId || this.propertyId === 'sample1') {
            this.listAllProperties();
        } else {
            this.loadPropertyDetails();
        }
    }

    // URL'den property ID'sini al
    getPropertyIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || 'sample1';
    }

    // API call helper
    async apiCall(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.apiBase}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call error:', error);
            return null;
        }
    }

    // Tüm property'leri listele
    async listAllProperties() {
        try {
            console.log('Tüm property\'ler listeleniyor...');
            const properties = await this.apiCall('/properties');
            
            if (properties && properties.length > 0) {
                console.log('Backend\'den gelen property\'ler:', properties);
                this.showPropertyList(properties);
            } else {
                console.log('Backend\'de property bulunamadı, test property gösteriliyor...');
                this.loadPropertyDetails();
            }
        } catch (error) {
            console.error('Property listesi yükleme hatası:', error);
            this.loadPropertyDetails();
        }
    }

    // Property listesini göster
    showPropertyList(properties) {
        console.log('Property listesi gösteriliyor:', properties);
        
        // İlk property'yi detay olarak göster
        if (properties.length > 0) {
            const firstProperty = properties[0];
            console.log('İlk property detayları gösteriliyor:', firstProperty);
            this.updatePropertyDetails(firstProperty);
            this.loadReviews(firstProperty._id);
            this.loadSimilarProperties(firstProperty._id);
        }
    }

    // Property detaylarını yükle
    async loadPropertyDetails() {
        try {
            console.log('Property ID:', this.propertyId);
            
            let property;
            
            // Backend'den property'yi al
            if (this.propertyId && !this.propertyId.startsWith('sample')) {
                console.log('Backend\'den property çekiliyor...');
                property = await this.apiCall(`/properties/${this.propertyId}`);
                console.log('Backend\'den gelen property:', property);
            }

            // Eğer backend'den veri gelmezse, test property kullan
            if (!property) {
                console.log('Backend\'den veri gelmedi, test property kullanılıyor...');
                property = this.getTestProperty();
            }

            if (property) {
                this.updatePropertyDetails(property);
                this.loadReviews(property._id);
                this.loadSimilarProperties(property._id);
            }

        } catch (error) {
            console.error('Property details yükleme hatası:', error);
            // Hata durumunda test property göster
            const testProperty = this.getTestProperty();
            this.updatePropertyDetails(testProperty);
        }
    }

    // Test property verisi
    getTestProperty() {
        return {
            _id: 'sample1',
            title: 'Luxury Villa - Dubai Marina',
            price: 2500000,
            location: 'Dubai Marina, Dubai, UAE',
            bedrooms: 4,
            bathrooms: 3,
            size: 450,
            status: 'For Sale',
            score: 4.8,
            description: 'Lüks villa, Dubai Marina\'da muhteşem deniz manzarası ile. Modern tasarım, yüksek kaliteli malzemeler ve premium konum. Bu villa, Dubai\'nin en prestijli bölgelerinden birinde yer almaktadır.',
            mainImage: 'assets/img/property_img_1.jpg',
            propertyType: 'Villa',
            features: [
                'Swimming Pool',
                'Garden',
                'Balcony',
                'Parking',
                'Security System',
                'Air Conditioning'
            ]
        };
    }

    // Property detaylarını güncelle
    updatePropertyDetails(property) {
        console.log('Property güncelleniyor:', property);
        
        // Başlık
        const titleElement = document.getElementById('property-title');
        if (titleElement) {
            titleElement.textContent = property.title;
            console.log('Başlık güncellendi:', property.title);
        }
        
        // Breadcrumb
        const breadcrumbElement = document.getElementById('property-breadcrumb');
        if (breadcrumbElement) {
            breadcrumbElement.textContent = property.title;
            console.log('Breadcrumb güncellendi:', property.title);
        }
        
        // Konum
        const locationElement = document.getElementById('property-location');
        if (locationElement) {
            locationElement.textContent = property.location;
            console.log('Konum güncellendi:', property.location);
        }
        
        // Fiyat
        const priceElement = document.getElementById('property-price');
        if (priceElement) {
            priceElement.textContent = `$${property.price.toLocaleString()}`;
            console.log('Fiyat güncellendi:', property.price);
        }
        
        // Açıklama
        const descriptionElement = document.getElementById('property-description');
        if (descriptionElement) {
            descriptionElement.innerHTML = `<p>${property.description}</p>`;
            console.log('Açıklama güncellendi');
        }
        
        // Property features listesi (bedroom, bathroom, size)
        this.updatePropertyFeaturesList(property);
        
        // Property details bölümünü güncelle
        this.updatePropertyDetailsSection(property);
        
        // Özellikler listesi
        const featuresList = document.getElementById('features-list');
        if (featuresList && property.features) {
            featuresList.innerHTML = property.features.map(feature => 
                `<li><i class="fa-solid fa-check"></i> ${feature}</li>`
            ).join('');
            console.log('Özellikler güncellendi');
        }
    }

    // Property features listesini güncelle (bedroom, bathroom, size)
    updatePropertyFeaturesList(property) {
        const featuresList = document.getElementById('property-features-list');
        if (featuresList) {
            featuresList.innerHTML = `
                <li>
                    <p class="mb-0">Bedrooms</p>
                    <span class="cs_accent_color">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 8.40005V13.3C16 13.6864 15.744 14 15.4286 14C15.1131 14 14.8571 13.6864 14.8571 13.3V12.6H1.14286V13.3C1.14286 13.6864 0.886857 14 0.571429 14C0.256 14 0 13.6864 0 13.3V8.40005C0 7.24225 0.769143 6.30005 1.71429 6.30005H14.2857C15.2309 6.30005 16 7.24225 16 8.40005Z" fill="currentColor"/>
                            <path d="M1.71436 4.9V0.7C1.71436 0.3136 1.97036 0 2.28578 0H13.7144C14.0298 0 14.2858 0.3136 14.2858 0.7V4.9H12.5715V4.2C12.5715 3.4279 12.0589 2.8 11.4286 2.8H9.71435C9.08407 2.8 8.5715 3.4279 8.5715 4.2V4.9H7.42864V4.2C7.42864 3.4279 6.91607 2.8 6.28578 2.8H4.5715C3.94121 2.8 3.42864 3.4279 3.42864 4.2V4.9H1.71436Z" fill="currentColor"/>
                        </svg>
                    </span>
                    ${property.bedrooms || 0} BR
                </li>
                <li>
                    <p class="mb-0">Bathrooms</p>
                    <span class="cs_accent_color">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.586426 10.1277V11.3364C0.586426 12.7334 1.6131 13.8949 2.95153 14.1064V15.0001H3.83049V14.1409H11.1695V15.0001H12.0485V14.1064C13.3869 13.8949 14.4136 12.7334 14.4136 11.3364V10.1277H0.586426Z" fill="currentColor"/>
                            <path d="M1.46535 7.48943V2.41863C1.46535 1.56964 2.1561 0.878936 3.00511 0.878936C3.7914 0.878936 4.44145 1.47144 4.5333 2.23333C3.61804 2.43946 2.93216 3.25834 2.93216 4.23492V4.82098H7.03651V4.23492C7.03651 3.25131 6.34075 2.42754 5.41568 2.22879C5.31839 0.983643 4.27481 0 3.00511 0C1.67143 0 0.586391 1.08498 0.586391 2.41863V7.48943H0V9.24867H15V7.48943H1.46535Z" fill="currentColor"/>
                        </svg>
                    </span>
                    ${property.bathrooms || 0} baths
                </li>
                <li>
                    <p class="mb-0">Size</p>
                    <span class="cs_accent_color">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5 4.5H3V10.5H1.5V4.5Z" fill="currentColor"/>
                            <path d="M4.5 12H10.5V13.5H4.5V12Z" fill="currentColor"/>
                            <path d="M0 0H3.75V3.75H0V0Z" fill="currentColor"/>
                            <path d="M0 11.25H3.75V15H0V11.25Z" fill="currentColor"/>
                            <path d="M12 4.5H13.5V10.5H12V4.5Z" fill="currentColor"/>
                            <path d="M4.5 1.5H10.5V3H4.5V1.5Z" fill="currentColor"/>
                            <path d="M11.25 0H15V3.75H11.25V0Z" fill="currentColor"/>
                            <path d="M11.25 11.25H15V15H11.25V11.25Z" fill="currentColor"/>
                        </svg>
                    </span>
                    ${property.size || 0} m²
                </li>
            `;
            console.log('Property features listesi güncellendi:', property.bedrooms, property.bathrooms, property.size);
        }
    }

    // Property details bölümünü güncelle
    updatePropertyDetailsSection(property) {
        console.log('Property details bölümü güncelleniyor:', property);
        
        // Property ID
        const propertyIdElement = document.getElementById('property-id');
        if (propertyIdElement) {
            propertyIdElement.textContent = property._id || 'N/A';
            console.log('Property ID güncellendi:', property._id);
        }
        
        // Bathrooms
        const bathroomsElement = document.getElementById('property-bathrooms');
        if (bathroomsElement) {
            bathroomsElement.textContent = property.bathrooms || 0;
            console.log('Bathrooms güncellendi:', property.bathrooms);
        }
        
        // Price
        const priceElement = document.getElementById('property-details-price');
        if (priceElement) {
            priceElement.textContent = `$${property.price?.toLocaleString() || 'N/A'}`;
            console.log('Property details price güncellendi:', property.price);
        }
        
        // Property Size
        const sizeElement = document.getElementById('property-details-size');
        if (sizeElement) {
            sizeElement.textContent = `${property.size || 0} m²`;
            console.log('Property details size güncellendi:', property.size);
        }
        
        // Year Built (eğer varsa)
        const yearBuiltElement = document.getElementById('property-year-built');
        if (yearBuiltElement) {
            yearBuiltElement.textContent = property.yearBuilt || 'N/A';
            console.log('Year built güncellendi:', property.yearBuilt);
        }
        
        // Property Type
        const typeElement = document.getElementById('property-details-type');
        if (typeElement) {
            typeElement.textContent = property.propertyType || 'N/A';
            console.log('Property type güncellendi:', property.propertyType);
        }
        
        // Bedrooms
        const bedroomsElement = document.getElementById('property-details-bedrooms');
        if (bedroomsElement) {
            bedroomsElement.textContent = property.bedrooms || 0;
            console.log('Property details bedrooms güncellendi:', property.bedrooms);
        }
        
        // Property Status
        const statusElement = document.getElementById('property-details-status');
        if (statusElement) {
            statusElement.textContent = property.status || 'N/A';
            console.log('Property status güncellendi:', property.status);
        }
    }

    // Yorumları yükle
    async loadReviews(propertyId) {
        try {
            let reviews = [];
            
            if (propertyId && !propertyId.startsWith('sample')) {
                reviews = await this.apiCall(`/properties/${propertyId}/reviews`);
            }

            // Test review'ları ekle
            const testReviews = JSON.parse(localStorage.getItem('testReviews') || '[]');
            const propertyTestReviews = testReviews.filter(review => 
                review.propertyId === propertyId || review.propertyId === 'sample1'
            );
            
            reviews = reviews.concat(propertyTestReviews);

            this.updateReviews(reviews);
        } catch (error) {
            console.error('Reviews yükleme hatası:', error);
        }
    }

    // Yorumları güncelle
    updateReviews(reviews) {
        const reviewsList = document.getElementById('reviews-list');
        if (reviewsList) {
            if (reviews.length === 0) {
                reviewsList.innerHTML = '<p class="text-muted">Henüz yorum bulunmuyor.</p>';
                return;
            }

            reviewsList.innerHTML = reviews.map(review => `
                <div class="cs_review">
                    <div class="cs_review_header">
                        <img src="${review.avatarUrl || 'https://via.placeholder.com/50x50'}" alt="${review.userName}">
                        <div>
                            <h4>${review.userName}</h4>
                            <div class="cs_rating">
                                ${'★'.repeat(review.rating)}
                            </div>
                            <small>${new Date(review.createdAt).toLocaleDateString('tr-TR')}</small>
                        </div>
                    </div>
                    <p>${review.comment}</p>
                </div>
            `).join('');
        }
    }

    // Benzer property'leri yükle
    async loadSimilarProperties(propertyId) {
        try {
            let similarProperties = [];
            
            if (propertyId && !propertyId.startsWith('sample')) {
                similarProperties = await this.apiCall(`/properties/${propertyId}/similar`);
            }

            // Eğer benzer property yoksa, test property'ler göster
            if (!similarProperties || similarProperties.length === 0) {
                similarProperties = this.getTestSimilarProperties();
            }

            this.updateSimilarProperties(similarProperties);
        } catch (error) {
            console.error('Similar properties yükleme hatası:', error);
            const testSimilar = this.getTestSimilarProperties();
            this.updateSimilarProperties(testSimilar);
        }
    }

    // Test benzer property'ler
    getTestSimilarProperties() {
        return [
            {
                _id: 'sample2',
                title: 'Modern Apartment - Downtown Dubai',
                price: 1800000,
                location: 'Downtown Dubai, Dubai, UAE',
                bedrooms: 3,
                bathrooms: 2,
                size: 280,
                mainImage: 'assets/img/property_img_2.jpg'
            },
            {
                _id: 'sample3',
                title: 'Beach House - Palm Jumeirah',
                price: 3200000,
                location: 'Palm Jumeirah, Dubai, UAE',
                bedrooms: 5,
                bathrooms: 4,
                size: 520,
                mainImage: 'assets/img/property_img_3.jpg'
            }
        ];
    }

    // Benzer property'leri güncelle
    updateSimilarProperties(properties) {
        const similarList = document.getElementById('similar-listings');
        if (similarList) {
            similarList.innerHTML = properties.map((property, index) => `
                <div class="cs_slide">
                    <div class="cs_card cs_style_1 cs_white_bg cs_radius_15 position-relative">
                        <a href="property-details.html?id=${property._id}" aria-label="Click to view details" class="cs_card_thumbnail cs_radius_20">
                            <img src="${property.mainImage || 'assets/img/card_img_1.jpg'}" alt="${property.title}">
                        </a>
                        <div class="cs_card_content">
                            <div class="cs_card_text cs_mb_16">
                                <h3 class="cs_card_title cs_fs_28 cs_semibold cs_body_font cs_mb_10">
                                    <a href="property-details.html?id=${property._id}" aria-label="Click to view details">${property.title}</a>
                                </h3>
                                <p class="cs_card_subtitle cs_fs_14 cs_mb_18">
                                    <i class="fa-solid fa-location-dot"></i> ${property.location}
                                </p>
                                <ul class="cs_card_features_list cs_mp_0">
                                    <li>
                                        <span class="cs_accent_color">
                                            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16 8.40005V13.3C16 13.6864 15.744 14 15.4286 14C15.1131 14 14.8571 13.6864 14.8571 13.3V12.6H1.14286V13.3C1.14286 13.6864 0.886857 14 0.571429 14C0.256 14 0 13.6864 0 13.3V8.40005C0 7.24225 0.769143 6.30005 1.71429 6.30005H14.2857C15.2309 6.30005 16 7.24225 16 8.40005Z" fill="currentColor"/>
                                                <path d="M1.71436 4.9V0.7C1.71436 0.3136 1.97036 0 2.28578 0H13.7144C14.0298 0 14.2858 0.3136 14.2858 0.7V4.9H12.5715V4.2C12.5715 3.4279 12.0589 2.8 11.4286 2.8H9.71435C9.08407 2.8 8.5715 3.4279 8.5715 4.2V4.9H7.42864V4.2C7.42864 3.4279 6.91607 2.8 6.28578 2.8H4.5715C3.94121 2.8 3.42864 3.4279 3.42864 4.2V4.9H1.71436Z" fill="currentColor"/>
                                            </svg>
                                        </span>
                                        ${property.bedrooms || 0} BR
                                    </li>
                                    <li>
                                        <span class="cs_accent_color">
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0.586426 10.1277V11.3364C0.586426 12.7334 1.6131 13.8949 2.95153 14.1064V15.0001H3.83049V14.1409H11.1695V15.0001H12.0485V14.1064C13.3869 13.8949 14.4136 12.7334 14.4136 11.3364V10.1277H0.586426Z" fill="currentColor"/>
                                                <path d="M1.46535 7.48943V2.41863C1.46535 1.56964 2.1561 0.878936 3.00511 0.878936C3.7914 0.878936 4.44145 1.47144 4.5333 2.23333C3.61804 2.43946 2.93216 3.25834 2.93216 4.23492V4.82098H7.03651V4.23492C7.03651 3.25131 6.34075 2.42754 5.41568 2.22879C5.31839 0.983643 4.27481 0 3.00511 0C1.67143 0 0.586391 1.08498 0.586391 2.41863V7.48943H0V9.24867H15V7.48943H1.46535Z" fill="currentColor"/>
                                            </svg>
                                        </span>
                                        ${property.bathrooms || 0} baths
                                    </li>
                                    <li>
                                        <span class="cs_accent_color">
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.5 4.5H3V10.5H1.5V4.5Z" fill="currentColor"/>
                                                <path d="M4.5 12H10.5V13.5H4.5V12Z" fill="currentColor"/>
                                                <path d="M0 0H3.75V3.75H0V0Z" fill="currentColor"/>
                                                <path d="M0 11.25H3.75V15H0V11.25Z" fill="currentColor"/>
                                                <path d="M12 4.5H13.5V10.5H12V4.5Z" fill="currentColor"/>
                                                <path d="M4.5 1.5H10.5V3H4.5V1.5Z" fill="currentColor"/>
                                                <path d="M11.25 0H15V3.75H11.25V0Z" fill="currentColor"/>
                                                <path d="M11.25 11.25H15V15H11.25V11.25Z" fill="currentColor"/>
                                            </svg>
                                        </span>
                                        ${property.size || 0} m²
                                    </li>
                                </ul>
                            </div>
                            <div class="cs_card_btns_wrapper">
                                <div class="cs_card_price cs_radius_10">
                                    <p class="cs_card_price_for cs_fs_16 cs_normal cs_body_font mb-0">Ready</p>
                                    <h3 class="cs_card_price_value cs_fs_24 cs_semibold cs_body_font mb-0">$${property.price?.toLocaleString() || 'N/A'}</h3>
                                </div>
                                <a href="property-details.html?id=${property._id}" aria-label="Click to view details" class="cs_card_btn cs_center cs_accent_bg cs_white_color cs_radius_7">
                                    <span><i class="fa-solid fa-arrow-right"></i></span>
                                    <span><i class="fa-solid fa-arrow-right"></i></span>
                                </a>
                            </div>
                        </div>
                        <button type="button" aria-label="Heart button" class="cs_heart_icon cs_center cs_white_bg cs_accent_color cs_radius_50 position-absolute">
                            <i class="fa-regular fa-heart"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM yüklendi, property details başlatılıyor...');
    
    // Property details'i başlat
    new PropertyDetails();
    
    console.log('Property details başlatıldı!');
});
