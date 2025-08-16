// Index.html Testimonials Dinamik Yükleme
class IndexTestimonials {
    constructor() {
        this.apiBase = 'http://localhost:3000/api';
        this.init();
    }

    init() {
        this.loadTestimonials();
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

    // Load testimonials
    async loadTestimonials() {
        const container = document.getElementById('testimonials-container');
        
        if (!container) {
            console.log('Testimonials container bulunamadı');
            return;
        }

        console.log('Testimonials yükleniyor...');

        try {
            let allReviews = [];

            // 1. LocalStorage'dan test review'ları al
            const testReviews = JSON.parse(localStorage.getItem('testReviews') || '[]');
            console.log('LocalStorage test reviews:', testReviews);
            allReviews = allReviews.concat(testReviews);

            // 2. Backend'den property'leri al
            const properties = await this.apiCall('/properties');
            console.log('Backend properties:', properties);
            
            // 3. Backend'den review'ları al
            if (properties && properties.length > 0) {
                for (const property of properties) {
                    const reviews = await this.apiCall(`/properties/${property._id}/reviews`);
                    console.log(`Property ${property.title} reviews:`, reviews);
                    if (reviews && reviews.length > 0) {
                        allReviews = allReviews.concat(reviews.map(review => ({
                            ...review,
                            propertyTitle: property.title,
                            propertyLocation: property.location
                        })));
                    }
                }
            }

            console.log('Toplam review sayısı:', allReviews.length);

            // Yorumları tarihe göre sırala (en yeni önce)
            allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // İlk 6 yorumu al
            const topReviews = allReviews.slice(0, 6);

            if (topReviews.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-4">
                        <p class="text-muted">Henüz yorum bulunmuyor.</p>
                    </div>
                `;
                return;
            }

            const testimonialsHTML = topReviews.map((review, index) => {
                const avatarUrl = review.avatarUrl || 'https://via.placeholder.com/50x50';
                const location = review.propertyLocation || review.location || 'Dubai, UAE';
                const date = new Date(review.createdAt).toLocaleDateString('tr-TR');
                const stars = ''.repeat(review.rating);
                
                return `
                    <div class="cs_slide">
                        <div class="cs_card cs_style_5">
                            <div class="cs_avatar cs_style_1 cs_accent_bg cs_radius_15">
                                <div class="cs_avatar_thumbnail cs_center cs_accent_bg cs_fs_20 cs_white_color cs_radius_50">
                                    <img src="${avatarUrl}" alt="${review.userName}" onerror="this.src='https://via.placeholder.com/50x50'">
                                </div>
                                <div class="cs_avatar_info">
                                    <h3 class="cs_fs_18 cs_white_color cs_semibold cs_body_font">${review.userName}</h3>
                                    <p class="cs_fs_14 cs_white_color mb-0">${location}</p>
                                    <small class="cs_fs_12 cs_white_color">${date}</small>
                                </div>
                            </div>
                            <div class="cs_card_content_wrapper">
                                <div class="cs_card_content cs_white_bg cs_radius_15">
                                    <blockquote>${review.comment}</blockquote>
                                    <div class="cs_rating cs_accent_color" style="font-size: 16px; line-height: 1; letter-spacing: 2px;">
                                        <span class="cs_rating_stars">${stars}</span>
                                    </div>
                                    <small class="text-muted">Property: ${review.propertyTitle}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = testimonialsHTML;
            console.log('Testimonials HTML eklendi');

            // Slider fonksiyonlarını yeniden başlat
            this.initSlider();

        } catch (error) {
            console.error('Testimonials yükleme hatası:', error);
            container.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-muted">Yorumlar yüklenirken bir hata oluştu.</p>
                </div>
            `;
        }
    }

    // Slider fonksiyonlarını başlat
    initSlider() {
        // Slider'ı yeniden başlat
        setTimeout(() => {
            console.log('Slider yeniden başlatılıyor...');
            
            // Slick slider varsa yeniden başlat
            if (typeof $ !== 'undefined' && $.fn.slick) {
                try {
                    $('.cs_slider_container').slick('refresh');
                    console.log('Slick slider yeniden başlatıldı');
                } catch (e) {
                    console.log('Slick slider yeniden başlatılamadı:', e);
                }
            }
            
            // Mevcut slider kodunu yeniden çalıştır
            if (typeof window.initSlider === 'function') {
                try {
                    window.initSlider();
                    console.log('initSlider fonksiyonu çalıştırıldı');
                } catch (e) {
                    console.log('initSlider fonksiyonu çalıştırılamadı:', e);
                }
            }
            
            // WOW.js animasyonlarını yeniden başlat
            if (typeof WOW !== 'undefined') {
                try {
                    new WOW().init();
                    console.log('WOW animasyonları yeniden başlatıldı');
                } catch (e) {
                    console.log('WOW animasyonları yeniden başlatılamadı:', e);
                }
            }
        }, 500);
    }
}

// Sayfa yüklendiğinde testimonials'ları yükle
document.addEventListener('DOMContentLoaded', function() {
    console.log('IndexTestimonials başlatılıyor...');
    new IndexTestimonials();
});
