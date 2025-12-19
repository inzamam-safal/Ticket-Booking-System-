// টিকিট বুকিং সিস্টেম - Complete Code
class TicketBookingSystem {
    constructor() {
        this.data = { events: [], tickets: [], customers: [], organizers: [], venues: [] };
        this.currentUser = null;
        this.charts = {};
        this.editingId = null;
        this.checkAuth();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateDashboard();
        this.renderAllSections();
        this.initCharts();
    }

    checkAuth() {
        this.initializeDemoUser();
        this.setupAuthEventListeners();
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.showMainApp();
        } else {
            this.showLoginPage();
        }
    }

    initializeDemoUser() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (!users.some(u => u.email === 'admin@tickets.com')) {
            users.push({
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                name: 'অ্যাডমিন ইউজার',
                email: 'admin@tickets.com',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    showLoginPage() {
        document.getElementById('login-page').style.display = 'grid';
        document.getElementById('register-page').style.display = 'none';
        document.getElementById('main-app').style.display = 'none';
    }

    showRegisterPage() {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('register-page').style.display = 'grid';
        document.getElementById('main-app').style.display = 'none';
    }

    showMainApp() {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('register-page').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';
        if (this.currentUser) {
            document.getElementById('current-user-name').textContent = this.currentUser.name;
        }
        this.init();
    }

    register(name, email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.email === email)) {
            alert('এই ইমেইলটি ইতিমধ্যে নিবন্ধিত!');
            return false;
        }
        users.push({
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            name, email, password, role: 'user', createdAt: new Date().toISOString()
        });
        localStorage.setItem('users', JSON.stringify(users));
        alert('নিবন্ধন সফল! দয়া করে লগইন করুন।');
        this.showLoginPage();
        return true;
    }

    login(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = { id: user.id, name: user.name, email: user.email, role: user.role || 'user' };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            const userIndex = users.findIndex(u => u.id === user.id);
            users[userIndex].lastLogin = new Date().toISOString();
            localStorage.setItem('users', JSON.stringify(users));
            this.showMainApp();
            return true;
        }
        alert('ভুল ইমেইল বা পাসওয়ার্ড!');
        return false;
    }

    logout() {
        if (confirm('আপনি কি নিশ্চিত লগআউট করতে চান?')) {
            this.currentUser = null;
            localStorage.removeItem('currentUser');
            Object.values(this.charts).forEach(chart => { if (chart) chart.destroy(); });
            this.charts = {};
            this.showLoginPage();
        }
    }

    loadData() {
        const savedData = localStorage.getItem('ticketBookingData');
        if (savedData) {
            this.data = JSON.parse(savedData);
        } else {
            this.data = {
                events: [
                    { id: 1, title: 'রক কনসার্ট ২০২৫', description: 'একটি দুর্দান্ত রক কনসার্ট যেখানে শীর্ষ ব্যান্ডগুলি পারফর্ম করবে', date: '2025-12-25', time: '20:00', category: 'সঙ্গীত', venueId: 1, price: 1500, totalSeats: 500, availableSeats: 350, status: 'available', organizerId: 1 },
                    { id: 2, title: 'টেক কনফারেন্স', description: 'শিল্প নেতাদের সাথে বার্ষিক প্রযুক্তি সম্মেলন', date: '2025-12-30', time: '09:00', category: 'সম্মেলন', venueId: 2, price: 3000, totalSeats: 200, availableSeats: 120, status: 'available', organizerId: 2 }
                ],
                tickets: [{ id: 1, eventId: 1, customerId: 1, seatNumber: 'A15', price: 1500, purchaseDate: '2025-12-15', status: 'confirmed' }],
                customers: [
                    { id: 1, name: 'মোঃ করিম', email: 'karim@email.com', phone: '+৮৮০১৭১২৩৪৫৬৭৮', address: 'ধানমন্ডি, ঢাকা' },
                    { id: 2, name: 'ফাতেমা আক্তার', email: 'fatema@email.com', phone: '+৮৮০১৮১২৩৪৫৬৭৮', address: 'বনানী, ঢাকা' }
                ],
                organizers: [
                    { id: 1, name: 'ইভেন্ট মাস্টার্স', email: 'contact@eventmasters.com', phone: '+৮৮০১৯১২৩৪৫৬৭৮', specialty: 'সঙ্গীত অনুষ্ঠান' },
                    { id: 2, name: 'টেক সলিউশনস', email: 'info@techsolutions.com', phone: '+৮৮০১৬১২৩৪৫৬৭৮', specialty: 'প্রযুক্তি সম্মেলন' }
                ],
                venues: [
                    { id: 1, name: 'গ্র্যান্ড এরিনা', address: 'স্টেডিয়াম রোড, ঢাকা', capacity: 500, type: 'এরিনা' },
                    { id: 2, name: 'কনভেনশন সেন্টার', address: 'আগারগাঁও, ঢাকা', capacity: 200, type: 'কনভেনশন সেন্টার' }
                ]
            };
            this.saveData();
        }
    }

    saveData() {
        localStorage.setItem('ticketBookingData', JSON.stringify(this.data));
    }

    setupAuthEventListeners() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                this.login(formData.get('email'), formData.get('password'));
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const password = formData.get('password');
                const confirmPassword = formData.get('confirmPassword');
                if (password !== confirmPassword) {
                    alert('পাসওয়ার্ড মিলছে না!');
                    return;
                }
                this.register(formData.get('name'), formData.get('email'), password);
            });
        }

        const showRegister = document.getElementById('show-register');
        const showLogin = document.getElementById('show-login');
        
        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterPage();
            });
        }
        
        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginPage();
            });
        }
    }

    setupEventListeners() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());

        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(e.currentTarget.dataset.section);
            });
        });

        const addEventBtn = document.getElementById('add-event-btn');
        const addTicketBtn = document.getElementById('add-ticket-btn');
        const addCustomerBtn = document.getElementById('add-customer-btn');
        const addOrganizerBtn = document.getElementById('add-organizer-btn');
        const addVenueBtn = document.getElementById('add-venue-btn');
        
        if (addEventBtn) addEventBtn.addEventListener('click', () => this.showEventModal());
        if (addTicketBtn) addTicketBtn.addEventListener('click', () => this.showTicketModal());
        if (addCustomerBtn) addCustomerBtn.addEventListener('click', () => this.showCustomerModal());
        if (addOrganizerBtn) addOrganizerBtn.addEventListener('click', () => this.showOrganizerModal());
        if (addVenueBtn) addVenueBtn.addEventListener('click', () => this.showVenueModal());

        const closeModal = document.getElementById('close-modal');
        const modal = document.getElementById('modal');

        if (closeModal) closeModal.addEventListener('click', () => this.closeModal());
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'modal') this.closeModal();
            });
        }
    }

    switchSection(section) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(section).classList.add('active');

        const titles = { dashboard: 'ড্যাশবোর্ড', events: 'ইভেন্ট ম্যানেজমেন্ট', tickets: 'টিকিট ম্যানেজমেন্ট', customers: 'গ্রাহক ম্যানেজমেন্ট', organizers: 'আয়োজক ম্যানেজমেন্ট', venues: 'স্থান ম্যানেজমেন্ট' };
        document.getElementById('section-title').textContent = titles[section];

        if (section === 'dashboard') this.updateDashboard();
    }

    updateDashboard() {
        const totalEventsEl = document.getElementById('total-events');
        const availableEventsEl = document.getElementById('available-events');
        const totalTicketsEl = document.getElementById('total-tickets');
        const totalCustomersEl = document.getElementById('total-customers');
        
        if (totalEventsEl) totalEventsEl.textContent = this.data.events.length;
        if (availableEventsEl) availableEventsEl.textContent = this.data.events.filter(e => e.status === 'available').length;
        if (totalTicketsEl) totalTicketsEl.textContent = this.data.tickets.filter(t => t.status === 'confirmed' || t.status === 'pending').length;
        if (totalCustomersEl) totalCustomersEl.textContent = this.data.customers.length;

        this.renderRecentTickets();
        this.updateCharts();
    }

    initCharts() {
        this.createEventChart();
        this.createTicketChart();
    }

    createEventChart() {
        const ctx = document.getElementById('eventChart');
        if (!ctx) return;

        const available = this.data.events.filter(e => e.status === 'available').length;
        const soldOut = this.data.events.filter(e => e.status === 'sold-out').length;

        if (this.charts.eventChart) this.charts.eventChart.destroy();

        this.charts.eventChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['উপলব্ধ', 'বিক্রিত'],
                datasets: [{
                    data: [available, soldOut],
                    backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
                    borderColor: ['rgba(16, 185, 129, 1)', 'rgba(239, 68, 68, 1)'],
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 20, font: { size: 14, family: "'Noto Sans Bengali', sans-serif" }, usePointStyle: true, pointStyle: 'circle' } },
                    tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 12, titleFont: { size: 14, family: "'Noto Sans Bengali', sans-serif" }, bodyFont: { size: 13, family: "'Noto Sans Bengali', sans-serif" }, cornerRadius: 8 }
                },
                animation: { animateRotate: true, animateScale: true }
            }
        });
    }

    createTicketChart() {
        const ctx = document.getElementById('ticketChart');
        if (!ctx) return;

        const confirmed = this.data.tickets.filter(t => t.status === 'confirmed').length;
        const pending = this.data.tickets.filter(t => t.status === 'pending').length;
        const cancelled = this.data.tickets.filter(t => t.status === 'cancelled').length;

        if (this.charts.ticketChart) this.charts.ticketChart.destroy();

        this.charts.ticketChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['নিশ্চিত', 'অপেক্ষমাণ', 'বাতিল'],
                datasets: [{
                    label: 'টিকিট সংখ্যা',
                    data: [confirmed, pending, cancelled],
                    backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(251, 146, 60, 0.8)', 'rgba(168, 85, 247, 0.8)'],
                    borderColor: ['rgba(59, 130, 246, 1)', 'rgba(251, 146, 60, 1)', 'rgba(168, 85, 247, 1)'],
                    borderWidth: 2,
                    borderRadius: 10,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 12, titleFont: { size: 14, family: "'Noto Sans Bengali', sans-serif" }, bodyFont: { size: 13, family: "'Noto Sans Bengali', sans-serif" }, cornerRadius: 8 } },
                scales: { y: { beginAtZero: true, ticks: { font: { family: "'Noto Sans Bengali', sans-serif" } }, grid: { color: 'rgba(0, 0, 0, 0.05)' } }, x: { ticks: { font: { size: 13, family: "'Noto Sans Bengali', sans-serif" } }, grid: { display: false } } },
                animation: { duration: 1000, easing: 'easeInOutQuart' }
            }
        });
    }

    updateCharts() {
        if (this.charts.eventChart) {
            const available = this.data.events.filter(e => e.status === 'available').length;
            const soldOut = this.data.events.filter(e => e.status === 'sold-out').length;
            this.charts.eventChart.data.datasets[0].data = [available, soldOut];
            this.charts.eventChart.update();
        }

        if (this.charts.ticketChart) {
            const confirmed = this.data.tickets.filter(t => t.status === 'confirmed').length;
            const pending = this.data.tickets.filter(t => t.status === 'pending').length;
            const cancelled = this.data.tickets.filter(t => t.status === 'cancelled').length;
            this.charts.ticketChart.data.datasets[0].data = [confirmed, pending, cancelled];
            this.charts.ticketChart.update();
        }
    }

    renderRecentTickets() {
        const container = document.getElementById('recent-tickets-list');
        const recentTickets = this.data.tickets.slice(-5).reverse();

        if (recentTickets.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-ticket-alt"></i><p>কোনো সাম্প্রতিক টিকিট নেই</p></div>';
            return;
        }

        let html = '<table><thead><tr><th>টিকিট আইডি</th><th>ইভেন্ট</th><th>গ্রাহক</th><th>সিট</th><th>ক্রয়ের তারিখ</th><th>স্ট্যাটাস</th></tr></thead><tbody>';

        recentTickets.forEach(ticket => {
            const event = this.data.events.find(e => e.id === ticket.eventId);
            const customer = this.data.customers.find(c => c.id === ticket.customerId);
            const statusText = { 'confirmed': 'নিশ্চিত', 'pending': 'অপেক্ষমাণ', 'cancelled': 'বাতিল' };
            html += `<tr><td>#${ticket.id}</td><td>${event ? event.title : 'অজানা ইভেন্ট'}</td><td>${customer ? customer.name : 'অজানা'}</td><td>${ticket.seatNumber || 'সাধারণ'}</td><td>${ticket.purchaseDate}</td><td><span class="status-badge status-${ticket.status}">${statusText[ticket.status]}</span></td></tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    renderAllSections() {
        this.renderEvents();
        this.renderTickets();
        this.renderCustomers();
        this.renderOrganizers();
        this.renderVenues();
    }

    renderEvents() {
        const container = document.getElementById('events-list');
        if (this.data.events.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-alt"></i><p>কোনো ইভেন্ট নেই</p></div>';
            return;
        }

        const statusText = { 'available': 'উপলব্ধ', 'sold-out': 'বিক্রিত', 'cancelled': 'বাতিল' };
        let html = '<table><thead><tr><th>শিরোনাম</th><th>তারিখ</th><th>ক্যাটাগরি</th><th>মূল্য</th><th>উপলব্ধ সিট</th><th>স্ট্যাটাস</th><th>কার্যক্রম</th></tr></thead><tbody>';

        this.data.events.forEach(event => {
            html += `<tr><td>${event.title}</td><td>${event.date} ${event.time}</td><td>${event.category}</td><td>৳${event.price}</td><td>${event.availableSeats}/${event.totalSeats}</td><td><span class="status-badge status-${event.status}">${statusText[event.status]}</span></td><td><div class="action-buttons"><button class="btn btn-secondary btn-small" onclick="tbs.editEvent(${event.id})"><i class="fas fa-edit"></i> সম্পাদনা</button><button class="btn btn-danger btn-small" onclick="tbs.deleteEvent(${event.id})"><i class="fas fa-trash"></i> মুছুন</button></div></td></tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    renderTickets() {
        const container = document.getElementById('tickets-list');
        if (this.data.tickets.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-ticket-alt"></i><p>কোনো টিকিট নেই</p></div>';
            return;
        }

        const statusText = { 'confirmed': 'নিশ্চিত', 'pending': 'অপেক্ষমাণ', 'cancelled': 'বাতিল' };
        let html = '<table><thead><tr><th>আইডি</th><th>ইভেন্ট</th><th>গ্রাহক</th><th>সিট</th><th>মূল্য</th><th>ক্রয়ের তারিখ</th><th>স্ট্যাটাস</th><th>কার্যক্রম</th></tr></thead><tbody>';

        this.data.tickets.forEach(ticket => {
            const event = this.data.events.find(e => e.id === ticket.eventId);
            const customer = this.data.customers.find(c => c.id === ticket.customerId);
            html += `<tr><td>#${ticket.id}</td><td>${event ? event.title : 'অজানা ইভেন্ট'}</td><td>${customer ? customer.name : 'অজানা'}</td><td>${ticket.seatNumber || 'সাধারণ'}</td><td>৳${ticket.price}</td><td>${ticket.purchaseDate}</td><td><span class="status-badge status-${ticket.status}">${statusText[ticket.status]}</span></td><td><div class="action-buttons"><button class="btn btn-secondary btn-small" onclick="tbs.editTicket(${ticket.id})"><i class="fas fa-edit"></i> সম্পাদনা</button><button class="btn btn-danger btn-small" onclick="tbs.deleteTicket(${ticket.id})"><i class="fas fa-trash"></i> মুছুন</button></div></td></tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    renderCustomers() {
        const container = document.getElementById('customers-list');
        if (this.data.customers.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-users"></i><p>কোনো গ্রাহক নেই</p></div>';
            return;
        }

        let html = '<table><thead><tr><th>আইডী</th><th>নাম</th><th>ইমেইল</th><th>ফোন</th><th>ঠিকানা</th><th>কার্যক্রম</th></tr></thead><tbody>';

        this.data.customers.forEach(customer => {
            html += `<tr><td>#${customer.id}</td><td>${customer.name}</td><td>${customer.email}</td><td>${customer.phone}</td><td>${customer.address}</td><td><div class="action-buttons"><button class="btn btn-secondary btn-small" onclick="tbs.editCustomer(${customer.id})"><i class="fas fa-edit"></i> সম্পাদনা</button><button class="btn btn-danger btn-small" onclick="tbs.deleteCustomer(${customer.id})"><i class="fas fa-trash"></i> মুছুন</button></div></td></tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    renderOrganizers() {
        const container = document.getElementById('organizers-list');
        if (this.data.organizers.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-user-tie"></i><p>কোনো আয়োজক নেই</p></div>';
            return;
        }

        let html = '<table><thead><tr><th>আইডি</th><th>নাম</th><th>বিশেষত্ব</th><th>ইমেইল</th><th>ফোন</th><th>কার্যক্রম</th></tr></thead><tbody>';

        this.data.organizers.forEach(organizer => {
            html += `<tr><td>#${organizer.id}</td><td>${organizer.name}</td><td>${organizer.specialty}</td><td>${organizer.email}</td><td>${organizer.phone}</td><td><div class="action-buttons"><button class="btn btn-secondary btn-small" onclick="tbs.editOrganizer(${organizer.id})"><i class="fas fa-edit"></i> সম্পাদনা</button><button class="btn btn-danger btn-small" onclick="tbs.deleteOrganizer(${organizer.id})"><i class="fas fa-trash"></i> মুছুন</button></div></td></tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    renderVenues() {
        const container = document.getElementById('venues-list');
        if (this.data.venues.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-map-marker-alt"></i><p>কোনো স্থান নেই</p></div>';
            return;
        }

        let html = '<table><thead><tr><th>আইডি</th><th>নাম</th><th>ঠিকানা</th><th>ধারণক্ষমতা</th><th>ধরন</th><th>কার্যক্রম</th></tr></thead><tbody>';

        this.data.venues.forEach(venue => {
            html += `<tr><td>#${venue.id}</td><td>${venue.name}</td><td>${venue.address}</td><td>${venue.capacity}</td><td>${venue.type}</td><td><div class="action-buttons"><button class="btn btn-secondary btn-small" onclick="tbs.editVenue(${venue.id})"><i class="fas fa-edit"></i> সম্পাদনা</button><button class="btn btn-danger btn-small" onclick="tbs.deleteVenue(${venue.id})"><i class="fas fa-trash"></i> মুছুন</button></div></td></tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    showModal(title) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal').classList.add('active');
    }

    closeModal() {
        document.getElementById('modal').classList.remove('active');
        this.editingId = null;
    }

    showEventModal(id = null) {
        this.editingId = id;
        const event = id ? this.data.events.find(e => e.id === id) : null;
        const venueOptions = this.data.venues.map(v => `<option value="${v.id}" ${event && event.venueId === v.id ? 'selected' : ''}>${v.name}</option>`).join('');
        const organizerOptions = this.data.organizers.map(o => `<option value="${o.id}" ${event && event.organizerId === o.id ? 'selected' : ''}>${o.name}</option>`).join('');

        this.showModal(id ? 'ইভেন্ট সম্পাদনা করুন' : 'নতুন ইভেন্ট যোগ করুন');
        
        document.getElementById('modal-body').innerHTML = `<form id="event-form"><div class="form-group"><label>শিরোনাম</label><input type="text" name="title" value="${event ? event.title : ''}" required></div><div class="form-group"><label>বিবরণ</label><textarea name="description" required>${event ? event.description : ''}</textarea></div><div class="form-group"><label>তারিখ</label><input type="date" name="date" value="${event ? event.date : ''}" required></div><div class="form-group"><label>সময়</label><input type="time" name="time" value="${event ? event.time : ''}" required></div><div class="form-group"><label>ক্যাটাগরি</label><input type="text" name="category" value="${event ? event.category : ''}" required></div><div class="form-group"><label>স্থান</label><select name="venueId" required><option value="">নির্বাচন করুন</option>${venueOptions}</select></div><div class="form-group"><label>আয়োজক</label><select name="organizerId" required><option value="">নির্বাচন করুন</option>${organizerOptions}</select></div><div class="form-group"><label>মূল্য (৳)</label><input type="number" name="price" value="${event ? event.price : ''}" required></div><div class="form-group"><label>মোট সিট</label><input type="number" name="totalSeats" value="${event ? event.totalSeats : ''}" required></div><div class="form-group"><label>উপলব্ধ সিট</label><input type="number" name="availableSeats" value="${event ? event.availableSeats : ''}" required></div><div class="form-group"><label>স্ট্যাটাস</label><select name="status" required><option value="available" ${event && event.status === 'available' ? 'selected' : ''}>উপলব্ধ</option><option value="sold-out" ${event && event.status === 'sold-out' ? 'selected' : ''}>বিক্রিত</option><option value="cancelled" ${event && event.status === 'cancelled' ? 'selected' : ''}>বাতিল</option></select></div><div class="form-actions"><button type="button" class="btn btn-secondary" onclick="tbs.closeModal()">বাতিল</button><button type="submit" class="btn btn-primary">সংরক্ষণ করুন</button></div></form>`;

        document.getElementById('event-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent(new FormData(e.target));
        });
    }

    saveEvent(formData) {
        const eventData = { title: formData.get('title'), description: formData.get('description'), date: formData.get('date'), time: formData.get('time'), category: formData.get('category'), venueId: parseInt(formData.get('venueId')), organizerId: parseInt(formData.get('organizerId')), price: parseFloat(formData.get('price')), totalSeats: parseInt(formData.get('totalSeats')), availableSeats: parseInt(formData.get('availableSeats')), status: formData.get('status') };

        if (this.editingId) {
            const index = this.data.events.findIndex(e => e.id === this.editingId);
            this.data.events[index] = { ...this.data.events[index], ...eventData };
        } else {
            const newId = this.data.events.length > 0 ? Math.max(...this.data.events.map(e => e.id)) + 1 : 1;
            this.data.events.push({ id: newId, ...eventData });
        }

        this.saveData();
        this.renderEvents();
        this.updateDashboard();
        this.closeModal();
        alert('ইভেন্ট সফলভাবে সংরক্ষিত হয়েছে!');
    }

    editEvent(id) { this.showEventModal(id); }
    
    deleteEvent(id) {
        if (confirm('আপনি কি নিশ্চিত এই ইভেন্টটি মুছতে চান?')) {
            this.data.events = this.data.events.filter(e => e.id !== id);
            this.saveData();
            this.renderEvents();
            this.updateDashboard();
            alert('ইভেন্ট মুছে ফেলা হয়েছে!');
        }
    }

    showTicketModal(id = null) {
        this.editingId = id;
        const ticket = id ? this.data.tickets.find(t => t.id === id) : null;
        const eventOptions = this.data.events.map(e => `<option value="${e.id}" ${ticket && ticket.eventId === e.id ? 'selected' : ''}>${e.title}</option>`).join('');
        const customerOptions = this.data.customers.map(c => `<option value="${c.id}" ${ticket && ticket.customerId === c.id ? 'selected' : ''}>${c.name}</option>`).join('');

        this.showModal(id ? 'টিকিট সম্পাদনা করুন' : 'নতুন টিকিট যোগ করুন');
        
        document.getElementById('modal-body').innerHTML = `<form id="ticket-form"><div class="form-group"><label>ইভেন্ট</label><select name="eventId" required><option value="">নির্বাচন করুন</option>${eventOptions}</select></div><div class="form-group"><label>গ্রাহক</label><select name="customerId" required><option value="">নির্বাচন করুন</option>${customerOptions}</select></div><div class="form-group"><label>সিট নম্বর</label><input type="text" name="seatNumber" value="${ticket ? ticket.seatNumber : ''}" required></div><div class="form-group"><label>মূল্য (৳)</label><input type="number" name="price" value="${ticket ? ticket.price : ''}" required></div><div class="form-group"><label>ক্রয়ের তারিখ</label><input type="date" name="purchaseDate" value="${ticket ? ticket.purchaseDate : new Date().toISOString().split('T')[0]}" required></div><div class="form-group"><label>স্ট্যাটাস</label><select name="status" required><option value="confirmed" ${ticket && ticket.status === 'confirmed' ? 'selected' : ''}>নিশ্চিত</option><option value="pending" ${ticket && ticket.status === 'pending' ? 'selected' : ''}>অপেক্ষমাণ</option><option value="cancelled" ${ticket && ticket.status === 'cancelled' ? 'selected' : ''}>বাতিল</option></select></div><div class="form-actions"><button type="button" class="btn btn-secondary" onclick="tbs.closeModal()">বাতিল</button><button type="submit" class="btn btn-primary">সংরক্ষণ করুন</button></div></form>`;

        document.getElementById('ticket-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTicket(new FormData(e.target));
        });
    }

    saveTicket(formData) {
        const ticketData = { eventId: parseInt(formData.get('eventId')), customerId: parseInt(formData.get('customerId')), seatNumber: formData.get('seatNumber'), price: parseFloat(formData.get('price')), purchaseDate: formData.get('purchaseDate'), status: formData.get('status') };

        if (this.editingId) {
            const index = this.data.tickets.findIndex(t => t.id === this.editingId);
            this.data.tickets[index] = { ...this.data.tickets[index], ...ticketData };
        } else {
            const newId = this.data.tickets.length > 0 ? Math.max(...this.data.tickets.map(t => t.id)) + 1 : 1;
            this.data.tickets.push({ id: newId, ...ticketData });
        }

        this.saveData();
        this.renderTickets();
        this.updateDashboard();
        this.closeModal();
        alert('টিকিট সফলভাবে সংরক্ষিত হয়েছে!');
    }

    editTicket(id) { this.showTicketModal(id); }
    
    deleteTicket(id) {
        if (confirm('আপনি কি নিশ্চিত এই টিকিটটি মুছতে চান?')) {
            this.data.tickets = this.data.tickets.filter(t => t.id !== id);
            this.saveData();
            this.renderTickets();
            this.updateDashboard();
            alert('টিকিট মুছে ফেলা হয়েছে!');
        }
    }

    showCustomerModal(id = null) {
        this.editingId = id;
        const customer = id ? this.data.customers.find(c => c.id === id) : null;

        this.showModal(id ? 'গ্রাহক সম্পাদনা করুন' : 'নতুন গ্রাহক যোগ করুন');
        
        document.getElementById('modal-body').innerHTML = `<form id="customer-form"><div class="form-group"><label>নাম</label><input type="text" name="name" value="${customer ? customer.name : ''}" required></div><div class="form-group"><label>ইমেইল</label><input type="email" name="email" value="${customer ? customer.email : ''}" required></div><div class="form-group"><label>ফোন</label><input type="tel" name="phone" value="${customer ? customer.phone : ''}" required></div><div class="form-group"><label>ঠিকানা</label><input type="text" name="address" value="${customer ? customer.address : ''}" required></div><div class="form-actions"><button type="button" class="btn btn-secondary" onclick="tbs.closeModal()">বাতিল</button><button type="submit" class="btn btn-primary">সংরক্ষণ করুন</button></div></form>`;

        document.getElementById('customer-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCustomer(new FormData(e.target));
        });
    }

    saveCustomer(formData) {
        const customerData = { name: formData.get('name'), email: formData.get('email'), phone: formData.get('phone'), address: formData.get('address') };

        if (this.editingId) {
            const index = this.data.customers.findIndex(c => c.id === this.editingId);
            this.data.customers[index] = { ...this.data.customers[index], ...customerData };
        } else {
            const newId = this.data.customers.length > 0 ? Math.max(...this.data.customers.map(c => c.id)) + 1 : 1;
            this.data.customers.push({ id: newId, ...customerData });
        }

        this.saveData();
        this.renderCustomers();
        this.updateDashboard();
        this.closeModal();
        alert('গ্রাহক সফলভাবে সংরক্ষিত হয়েছে!');
    }

    editCustomer(id) { this.showCustomerModal(id); }
    
    deleteCustomer(id) {
        if (confirm('আপনি কি নিশ্চিত এই গ্রাহকটি মুছতে চান?')) {
            this.data.customers = this.data.customers.filter(c => c.id !== id);
            this.saveData();
            this.renderCustomers();
            this.updateDashboard();
            alert('গ্রাহক মুছে ফেলা হয়েছে!');
        }
    }

    showOrganizerModal(id = null) {
        this.editingId = id;
        const organizer = id ? this.data.organizers.find(o => o.id === id) : null;

        this.showModal(id ? 'আয়োজক সম্পাদনা করুন' : 'নতুন আয়োজক যোগ করুন');
        
        document.getElementById('modal-body').innerHTML = `<form id="organizer-form"><div class="form-group"><label>নাম</label><input type="text" name="name" value="${organizer ? organizer.name : ''}" required></div><div class="form-group"><label>বিশেষত্ব</label><input type="text" name="specialty" value="${organizer ? organizer.specialty : ''}" required></div><div class="form-group"><label>ইমেইল</label><input type="email" name="email" value="${organizer ? organizer.email : ''}" required></div><div class="form-group"><label>ফোন</label><input type="tel" name="phone" value="${organizer ? organizer.phone : ''}" required></div><div class="form-actions"><button type="button" class="btn btn-secondary" onclick="tbs.closeModal()">বাতিল</button><button type="submit" class="btn btn-primary">সংরক্ষণ করুন</button></div></form>`;

        document.getElementById('organizer-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveOrganizer(new FormData(e.target));
        });
    }

    saveOrganizer(formData) {
        const organizerData = { name: formData.get('name'), specialty: formData.get('specialty'), email: formData.get('email'), phone: formData.get('phone') };

        if (this.editingId) {
            const index = this.data.organizers.findIndex(o => o.id === this.editingId);
            this.data.organizers[index] = { ...this.data.organizers[index], ...organizerData };
        } else {
            const newId = this.data.organizers.length > 0 ? Math.max(...this.data.organizers.map(o => o.id)) + 1 : 1;
            this.data.organizers.push({ id: newId, ...organizerData });
        }

        this.saveData();
        this.renderOrganizers();
        this.closeModal();
        alert('আয়োজক সফলভাবে সংরক্ষিত হয়েছে!');
    }

    editOrganizer(id) { this.showOrganizerModal(id); }
    
    deleteOrganizer(id) {
        if (confirm('আপনি কি নিশ্চিত এই আয়োজকটি মুছতে চান?')) {
            this.data.organizers = this.data.organizers.filter(o => o.id !== id);
            this.saveData();
            this.renderOrganizers();
            alert('আয়োজক মুছে ফেলা হয়েছে!');
        }
    }

    showVenueModal(id = null) {
        this.editingId = id;
        const venue = id ? this.data.venues.find(v => v.id === id) : null;

        this.showModal(id ? 'স্থান সম্পাদনা করুন' : 'নতুন স্থান যোগ করুন');
        
        document.getElementById('modal-body').innerHTML = `<form id="venue-form"><div class="form-group"><label>নাম</label><input type="text" name="name" value="${venue ? venue.name : ''}" required></div><div class="form-group"><label>ঠিকানা</label><input type="text" name="address" value="${venue ? venue.address : ''}" required></div><div class="form-group"><label>ধারণক্ষমতা</label><input type="number" name="capacity" value="${venue ? venue.capacity : ''}" required></div><div class="form-group"><label>ধরন</label><input type="text" name="type" value="${venue ? venue.type : ''}" required></div><div class="form-actions"><button type="button" class="btn btn-secondary" onclick="tbs.closeModal()">বাতিল</button><button type="submit" class="btn btn-primary">সংরক্ষণ করুন</button></div></form>`;

        document.getElementById('venue-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveVenue(new FormData(e.target));
        });
    }

    saveVenue(formData) {
        const venueData = { name: formData.get('name'), address: formData.get('address'), capacity: parseInt(formData.get('capacity')), type: formData.get('type') };

        if (this.editingId) {
            const index = this.data.venues.findIndex(v => v.id === this.editingId);
            this.data.venues[index] = { ...this.data.venues[index], ...venueData };
        } else {
            const newId = this.data.venues.length > 0 ? Math.max(...this.data.venues.map(v => v.id)) + 1 : 1;
            this.data.venues.push({ id: newId, ...venueData });
        }

        this.saveData();
        this.renderVenues();
        this.closeModal();
        alert('স্থান সফলভাবে সংরক্ষিত হয়েছে!');
    }

    editVenue(id) { this.showVenueModal(id); }
    
    deleteVenue(id) {
        if (confirm('আপনি কি নিশ্চিত এই স্থানটি মুছতে চান?')) {
            this.data.venues = this.data.venues.filter(v => v.id !== id);
            this.saveData();
            this.renderVenues();
            alert('স্থান মুছে ফেলা হয়েছে!');
        }
    }
}

// Initialize the app
const tbs = new TicketBookingSystem();