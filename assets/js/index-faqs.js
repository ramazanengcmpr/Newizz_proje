// Index.html FAQ Dinamik Yükleme
class IndexFAQs {
    constructor() {
        this.apiBase = 'http://localhost:3000/api';
        this.init();
    }

    init() {
        this.loadFAQs();
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

    // Load FAQs
    async loadFAQs() {
        const container = document.getElementById('faqs-container');
        
        if (!container) {
            console.log('FAQ container bulunamadı');
            return;
        }

        try {
            const faqs = await this.apiCall('/faqs');
            
            if (!faqs || faqs.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-4">
                        <p class="text-muted">Henüz FAQ bulunmuyor.</p>
                    </div>
                `;
                return;
            }

            // FAQ'ları sırala (order'a göre)
            const sortedFaqs = faqs.sort((a, b) => (a.order || 0) - (b.order || 0));

            const faqsHTML = sortedFaqs.map((faq, index) => {
                const delay = index * 150; // Her FAQ için farklı delay
                return `
                    <div class="cs_accordian cs_style_2 cs_white_bg cs_radius_15 wow fadeInUp" data-wow-delay="${delay}ms">
                        <div class="cs_accordian_head position-relative">
                            <h2 class="cs_accordian_title cs_fs_24 cs_medium cs_body_font mb-0">${faq.question}</h2>
                            <span class="cs_accordian_toggle cs_accent_bg cs_radius_50 position-absolute"></span>
                        </div>
                        <div class="cs_accordian_body">
                            <p>${faq.answer}</p>
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = faqsHTML;

            // Accordion fonksiyonlarını yeniden başlat
            this.initAccordion();

        } catch (error) {
            console.error('FAQ yükleme hatası:', error);
            container.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-muted">FAQ'lar yüklenirken bir hata oluştu.</p>
                </div>
            `;
        }
    }

    // Accordion fonksiyonlarını başlat
    initAccordion() {
        // Mevcut accordion kodunu yeniden çalıştır
        if (typeof window.initAccordion === 'function') {
            window.initAccordion();
        } else {
            // Basit accordion fonksiyonu
            const accordionHeads = document.querySelectorAll('.cs_accordian_head');
            accordionHeads.forEach(head => {
                head.addEventListener('click', function() {
                    const accordion = this.closest('.cs_accordian');
                    const body = accordion.querySelector('.cs_accordian_body');
                    const toggle = this.querySelector('.cs_accordian_toggle');
                    
                    // Diğer açık accordion'ları kapat
                    document.querySelectorAll('.cs_accordian').forEach(acc => {
                        if (acc !== accordion) {
                            acc.classList.remove('active');
                            acc.querySelector('.cs_accordian_body').style.display = 'none';
                            acc.querySelector('.cs_accordian_toggle').classList.remove('active');
                        }
                    });
                    
                    // Bu accordion'u aç/kapat
                    accordion.classList.toggle('active');
                    if (accordion.classList.contains('active')) {
                        body.style.display = 'block';
                        toggle.classList.add('active');
                    } else {
                        body.style.display = 'none';
                        toggle.classList.remove('active');
                    }
                });
            });
        }
    }
}

// Sayfa yüklendiğinde FAQ'ları yükle
document.addEventListener('DOMContentLoaded', function() {
    new IndexFAQs();
});
