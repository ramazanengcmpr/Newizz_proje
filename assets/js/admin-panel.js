// Newizz Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.apiBase = 'http://localhost:3000/api';
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadDashboard();
    }

    // Navigation setup
    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('.nav-link').dataset.section;
                this.showSection(section);
            });
        });
    }

    // Show section
    showSection(section) {
        // Hide all sections
        document.querySelectorAll('[id$="-section"]').forEach(el => {
            el.style.display = 'none';
        });

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected section
        document.getElementById(`${section}-section`).style.display = 'block';

        // Add active class to selected nav link
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        this.currentSection = section;

        // Load section data
        switch(section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'properties':
                this.loadProperties();
                break;
            case 'reviews':
                this.loadReviews();
                break;
            case 'faqs':
                this.loadFAQs();
                break;
            case 'tours':
                this.loadTours();
                break;
        }
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
                const errorData = await response.json().catch(() => ({}));
                console.error('Response error data:', errorData);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    }

    // Show alert
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        const container = document.querySelector('.main-content .p-4');
        container.insertBefore(alertDiv, container.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // Load dashboard
    async loadDashboard() {
        try {
            // Önce properties'i yükle
            const properties = await this.apiCall('/properties');
            document.getElementById('total-properties').textContent = properties?.length || 0;

            // Reviews sayısını hesapla
            let totalReviews = 0;
            if (properties && properties.length > 0) {
                for (const property of properties) {
                    const reviews = await this.apiCall(`/properties/${property._id}/reviews`);
                    if (reviews) {
                        totalReviews += reviews.length;
                    }
                }
            }

            // Test review'ları da ekle
            const testReviews = JSON.parse(localStorage.getItem('testReviews') || '[]');
            totalReviews += testReviews.length;
            
            document.getElementById('total-reviews').textContent = totalReviews;

            // FAQs ve Tours
            const faqs = await this.apiCall('/faqs');
            const tours = await this.apiCall('/tours');

            document.getElementById('total-faqs').textContent = faqs?.length || 0;
            document.getElementById('total-tours').textContent = tours?.length || 0;

        } catch (error) {
            console.error('Dashboard load error:', error);
            this.showAlert('Dashboard yüklenirken hata oluştu. Backend server\'ın çalıştığından emin olun.', 'warning');
        }
    }

    // Load properties
    async loadProperties() {
        const container = document.getElementById('properties-table');
        const loading = container.parentNode.querySelector('.loading');

        loading.style.display = 'block';
        container.innerHTML = '';

        const properties = await this.apiCall('/properties');

        loading.style.display = 'none';

        if (!properties || properties.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No properties found.</p>';
            return;
        }

        const table = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${properties.map(property => `
                        <tr>
                            <td>${property.title}</td>
                            <td>$${property.price?.toLocaleString()}</td>
                            <td>${property.location}</td>
                            <td>${property.propertyType}</td>
                            <td><span class="badge bg-${property.status === 'For Sale' ? 'success' : 'warning'}">${property.status}</span></td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary btn-action" onclick="adminPanel.editProperty('${property._id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger btn-action" onclick="adminPanel.deleteProperty('${property._id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = table;
    }

    // Load reviews
    async loadReviews() {
        const container = document.getElementById('reviews-table');
        const loading = container.parentNode.querySelector('.loading');

        loading.style.display = 'block';
        container.innerHTML = '';

        // Get all properties first to get their reviews
        const properties = await this.apiCall('/properties');
        let allReviews = [];

        if (properties) {
            for (const property of properties) {
                const reviews = await this.apiCall(`/properties/${property._id}/reviews`);
                if (reviews) {
                    allReviews = allReviews.concat(reviews.map(review => ({
                        ...review,
                        propertyTitle: property.title
                    })));
                }
            }
        }

        // Test review'ları da ekle
        const testReviews = JSON.parse(localStorage.getItem('testReviews') || '[]');
        allReviews = allReviews.concat(testReviews);

        loading.style.display = 'none';

        if (allReviews.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No reviews found.</p>';
            return;
        }

        const table = `
            <table class="table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Property</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${allReviews.map(review => `
                        <tr>
                            <td>${review.userName}</td>
                            <td>${review.propertyTitle}</td>
                            <td style="font-size: 18px; line-height: 1; letter-spacing: 1px;">${'★'.repeat(review.rating)}</td>
                            <td>${review.comment.substring(0, 50)}${review.comment.length > 50 ? '...' : ''}</td>
                            <td>${new Date(review.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-danger btn-action" onclick="adminPanel.deleteReview('${review._id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = table;
    }

    // Load FAQs
    async loadFAQs() {
        const container = document.getElementById('faqs-table');
        const loading = container.parentNode.querySelector('.loading');

        loading.style.display = 'block';
        container.innerHTML = '';

        const faqs = await this.apiCall('/faqs');

        loading.style.display = 'none';

        if (!faqs || faqs.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No FAQs found.</p>';
            return;
        }

        const table = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Category</th>
                        <th>Order</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${faqs.map(faq => `
                        <tr>
                            <td>${faq.question}</td>
                            <td><span class="badge bg-info">${faq.category}</span></td>
                            <td>${faq.order}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary btn-action" onclick="adminPanel.editFAQ('${faq._id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger btn-action" onclick="adminPanel.deleteFAQ('${faq._id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = table;
    }

    // Load tours
    async loadTours() {
        const container = document.getElementById('tours-table');
        const loading = container.parentNode.querySelector('.loading');

        loading.style.display = 'block';
        container.innerHTML = '';

        const tours = await this.apiCall('/tours');

        loading.style.display = 'none';

        if (!tours || tours.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No tour requests found.</p>';
            return;
        }

        const table = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Property</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Date Requested</th>
                    </tr>
                </thead>
                <tbody>
                    ${tours.map(tour => `
                        <tr>
                            <td>${tour.name}</td>
                            <td>${tour.propertyTitle}</td>
                            <td>${tour.date}</td>
                            <td>${tour.time}</td>
                            <td>${tour.email}</td>
                            <td>${tour.phone}</td>
                            <td>${new Date(tour.createdAt).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = table;
    }

    // Add property
    async addProperty() {
        const form = document.getElementById('addPropertyForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // yearBuilt alanını kontrol et
        if (data.yearBuilt === '' || data.yearBuilt === '0') {
            delete data.yearBuilt;
        } else {
            data.yearBuilt = parseInt(data.yearBuilt);
        }

        // Additional Images
        if (data.additionalImages) {
            data.images = data.additionalImages.split('\n').filter(url => url.trim() !== '');
            delete data.additionalImages;
        }

        // Features
        if (data.features) {
            data.features = data.features.split('\n').filter(feature => feature.trim() !== '');
        }

        // Floor Plans
        if (data.floorPlans && data.floorPlans.trim() !== '') {
            try {
                data.floorPlans = JSON.parse(data.floorPlans);
            } catch (e) {
                console.error('Floor plans JSON parse error:', e);
                delete data.floorPlans;
            }
        }

        // Nearby Education
        if (data.nearbyEducation && data.nearbyEducation.trim() !== '') {
            try {
                data.nearby = data.nearby || {};
                data.nearby.education = JSON.parse(data.nearbyEducation);
                delete data.nearbyEducation;
            } catch (e) {
                console.error('Nearby education JSON parse error:', e);
            }
        }

        // Nearby Stores
        if (data.nearbyStores && data.nearbyStores.trim() !== '') {
            try {
                data.nearby = data.nearby || {};
                data.nearby.stores = JSON.parse(data.nearbyStores);
                delete data.nearbyStores;
            } catch (e) {
                console.error('Nearby stores JSON parse error:', e);
            }
        }

        // Nearby Health
        if (data.nearbyHealth && data.nearbyHealth.trim() !== '') {
            try {
                data.nearby = data.nearby || {};
                data.nearby.health = JSON.parse(data.nearbyHealth);
                delete data.nearbyHealth;
            } catch (e) {
                console.error('Nearby health JSON parse error:', e);
            }
        }

        console.log('Property data:', data);

        try {
            const result = await this.apiCall('/properties', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            if (result) {
                this.showAlert('Property başarıyla eklendi!', 'success');
                form.reset();
                bootstrap.Modal.getInstance(document.getElementById('addPropertyModal')).hide();
                this.loadProperties();
            }
        } catch (error) {
            console.error('Property ekleme hatası:', error);
            this.showAlert(`Property eklenirken hata oluştu: ${error.message}`, 'danger');
        }
    }

    // Add FAQ
    async addFAQ() {
        const form = document.getElementById('addFAQForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const result = await this.apiCall('/faqs', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        if (result) {
            this.showAlert('FAQ başarıyla eklendi!', 'success');
            form.reset();
            bootstrap.Modal.getInstance(document.getElementById('addFAQModal')).hide();
            this.loadFAQs();
        }
    }

    // Delete property
    async deleteProperty(id) {
        if (!confirm('Bu property\'yi silmek istediğinizden emin misiniz?')) {
            return;
        }

        const result = await this.apiCall(`/properties/${id}`, {
            method: 'DELETE'
        });

        if (result) {
            this.showAlert('Property başarıyla silindi!', 'success');
            this.loadProperties();
        }
    }

    // Delete FAQ
    async deleteFAQ(id) {
        if (!confirm('Bu FAQ\'yu silmek istediğinizden emin misiniz?')) {
            return;
        }

        const result = await this.apiCall(`/faqs/${id}`, {
            method: 'DELETE'
        });

        if (result) {
            this.showAlert('FAQ başarıyla silindi!', 'success');
            this.loadFAQs();
        }
    }

    // Delete review
    async deleteReview(id) {
        if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
            return;
        }

        // Test review kontrolü
        if (id.startsWith('test_')) {
            const testReviews = JSON.parse(localStorage.getItem('testReviews') || '[]');
            const updatedReviews = testReviews.filter(review => review._id !== id);
            localStorage.setItem('testReviews', JSON.stringify(updatedReviews));
            this.showAlert('Test review başarıyla silindi!', 'success');
            this.loadReviews();
            return;
        }

        // Find the property ID for this review
        const properties = await this.apiCall('/properties');
        let propertyId = null;
        
        for (const property of properties) {
            const reviews = await this.apiCall(`/properties/${property._id}/reviews`);
            if (reviews && reviews.find(r => r._id === id)) {
                propertyId = property._id;
                break;
            }
        }

        if (!propertyId) {
            this.showAlert('Review bulunamadı.', 'danger');
            return;
        }

        const result = await this.apiCall(`/properties/${propertyId}/reviews/${id}`, {
            method: 'DELETE'
        });

        if (result) {
            this.showAlert('Review başarıyla silindi!', 'success');
            this.loadReviews();
        }
    }

    // Edit property (placeholder)
    editProperty(id) {
        this.showAlert('Property düzenleme özelliği henüz eklenmedi.', 'info');
    }

    // Edit FAQ (placeholder)
    editFAQ(id) {
        this.showAlert('FAQ düzenleme özelliği henüz eklenmedi.', 'info');
    }

    // Load properties for review modal
    async loadPropertiesForReview() {
        const select = document.getElementById('reviewPropertySelect');
        if (!select) return;

        try {
            const properties = await this.apiCall('/properties');
            if (properties && properties.length > 0) {
                select.innerHTML = '<option value="">Select Property</option>';
                properties.forEach(property => {
                    select.innerHTML += `<option value="${property._id}">${property.title} - ${property.location}</option>`;
                });
                this.showAlert('✅ Gerçek property\'ler yüklendi!', 'success');
            } else {
                // Eğer property yoksa örnek veriler ekle (seçilebilir)
                select.innerHTML = `
                    <option value="">Select Property</option>
                    <option value="sample1">Luxury Villa - Dubai Marina (Test)</option>
                    <option value="sample2">Modern Apartment - Downtown Dubai (Test)</option>
                    <option value="sample3">Beach House - Palm Jumeirah (Test)</option>
                `;
                this.showAlert('⚠️ Backend bağlantısı yok. Test property\'leri kullanabilirsiniz.', 'warning');
            }
        } catch (error) {
            console.error('Property yükleme hatası:', error);
            // Hata durumunda örnek veriler göster (seçilebilir)
            select.innerHTML = `
                <option value="">Select Property</option>
                <option value="sample1">Luxury Villa - Dubai Marina (Test)</option>
                <option value="sample2">Modern Apartment - Downtown Dubai (Test)</option>
                <option value="sample3">Beach House - Palm Jumeirah (Test)</option>
            `;
            this.showAlert('⚠️ Backend bağlantısı yok. Test property\'leri kullanabilirsiniz.', 'warning');
        }
    }

    // Show property selection modal
    async showPropertyModal() {
        try {
            const properties = await this.apiCall('/properties');
            if (properties && properties.length > 0) {
                this.renderPropertySelectionTable(properties);
                new bootstrap.Modal(document.getElementById('propertySelectionModal')).show();
            } else {
                // Test verilerle modal göster
                const sampleProperties = [
                    { _id: 'sample1', title: 'Luxury Villa', location: 'Dubai Marina', price: 2500000, propertyType: 'Villa' },
                    { _id: 'sample2', title: 'Modern Apartment', location: 'Downtown Dubai', price: 1500000, propertyType: 'Apartment' },
                    { _id: 'sample3', title: 'Beach House', location: 'Palm Jumeirah', price: 3500000, propertyType: 'House' }
                ];
                this.renderPropertySelectionTable(sampleProperties);
                new bootstrap.Modal(document.getElementById('propertySelectionModal')).show();
                this.showAlert('Backend bağlantısı yok. Test property\'leri kullanabilirsiniz.', 'warning');
            }
        } catch (error) {
            console.error('Property modal hatası:', error);
            // Hata durumunda test verilerle modal göster
            const sampleProperties = [
                { _id: 'sample1', title: 'Luxury Villa', location: 'Dubai Marina', price: 2500000, propertyType: 'Villa' },
                { _id: 'sample2', title: 'Modern Apartment', location: 'Downtown Dubai', price: 1500000, propertyType: 'Apartment' },
                { _id: 'sample3', title: 'Beach House', location: 'Palm Jumeirah', price: 3500000, propertyType: 'House' }
            ];
            this.renderPropertySelectionTable(sampleProperties);
            new bootstrap.Modal(document.getElementById('propertySelectionModal')).show();
            this.showAlert('Backend bağlantısı yok. Test property\'leri kullanabilirsiniz.', 'warning');
        }
    }

    // Render property selection table
    renderPropertySelectionTable(properties) {
        const tbody = document.getElementById('propertySelectionTable');
        if (!tbody) return;

        tbody.innerHTML = properties.map(property => `
            <tr>
                <td>${property.title}</td>
                <td>${property.location}</td>
                <td>$${property.price?.toLocaleString()}</td>
                <td>${property.propertyType}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="adminPanel.selectProperty('${property._id}', '${property.title}')">
                        Select
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Filter properties in modal
    async filterModalProperties(searchTerm) {
        const properties = await this.apiCall('/properties');
        if (!properties) return;

        const filtered = properties.filter(property => 
            property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.propertyType.toLowerCase().includes(searchTerm.toLowerCase())
        );

        this.renderPropertySelectionTable(filtered);
    }

    // Filter properties in select dropdown
    async filterProperties(searchTerm) {
        const select = document.getElementById('reviewPropertySelect');
        if (!select) return;

        const properties = await this.apiCall('/properties');
        if (!properties) return;

        const filtered = properties.filter(property => 
            property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.location.toLowerCase().includes(searchTerm.toLowerCase())
        );

        select.innerHTML = '<option value="">Select Property</option>';
        filtered.forEach(property => {
            select.innerHTML += `<option value="${property._id}">${property.title} - ${property.location}</option>`;
        });
    }

    // Select property from modal
    selectProperty(propertyId, propertyTitle) {
        const select = document.getElementById('reviewPropertySelect');
        if (select) {
            select.value = propertyId;
        }
        
        const searchInput = document.getElementById('propertySearch');
        if (searchInput) {
            searchInput.value = propertyTitle;
        }

        // Test property seçildiyse bilgi mesajı göster
        if (propertyId.startsWith('sample')) {
            this.showAlert('Test property seçtiniz. Review local storage\'a kaydedilecek.', 'info');
        }

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('propertySelectionModal')).hide();
    }

    // Add review
    async addReview() {
        const form = document.getElementById('addReviewForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Property ID'yi al
        const propertyId = data.propertyId;
        if (!propertyId) {
            this.showAlert('Lütfen bir property seçin.', 'warning');
            return;
        }

        // Review verilerini hazırla
        const reviewData = {
            userName: data.userName,
            userEmail: data.userEmail,
            rating: parseInt(data.rating),
            comment: data.comment,
            avatarUrl: data.avatarUrl || 'https://via.placeholder.com/50x50'
        };

        // Örnek ID'ler için test review'ı ekle
        if (propertyId.startsWith('sample')) {
            // Test review'ı local storage'a kaydet
            const testReviews = JSON.parse(localStorage.getItem('testReviews') || '[]');
            const testReview = {
                _id: 'test_' + Date.now(),
                propertyId: propertyId,
                propertyTitle: data.propertyId === 'sample1' ? 'Luxury Villa - Dubai Marina' : 
                              data.propertyId === 'sample2' ? 'Modern Apartment - Downtown Dubai' : 
                              'Beach House - Palm Jumeirah',
                ...reviewData,
                createdAt: new Date().toISOString()
            };
            testReviews.push(testReview);
            localStorage.setItem('testReviews', JSON.stringify(testReviews));
            
            this.showAlert('✅ Test review başarıyla eklendi! (Local storage\'a kaydedildi)', 'success');
            form.reset();
            bootstrap.Modal.getInstance(document.getElementById('addReviewModal')).hide();
            this.loadReviews();
            return;
        }

        try {
            const result = await this.apiCall(`/properties/${propertyId}/reviews`, {
                method: 'POST',
                body: JSON.stringify(reviewData)
            });

            if (result) {
                this.showAlert('Review başarıyla eklendi!', 'success');
                form.reset();
                bootstrap.Modal.getInstance(document.getElementById('addReviewModal')).hide();
                this.loadReviews();
            }
        } catch (error) {
            console.error('Review ekleme hatası:', error);
            this.showAlert('Review eklenirken hata oluştu. Backend server\'ın çalıştığından emin olun.', 'danger');
        }
    }
}

// Global functions for modal buttons
function showAddPropertyModal() {
    new bootstrap.Modal(document.getElementById('addPropertyModal')).show();
}

function showAddFAQModal() {
    new bootstrap.Modal(document.getElementById('addFAQModal')).show();
}

function addProperty() {
    adminPanel.addProperty();
}

function addFAQ() {
    adminPanel.addFAQ();
}

function showAddReviewModal() {
    adminPanel.loadPropertiesForReview();
    new bootstrap.Modal(document.getElementById('addReviewModal')).show();
}

function addReview() {
    adminPanel.addReview();
}

// Initialize admin panel
const adminPanel = new AdminPanel();
