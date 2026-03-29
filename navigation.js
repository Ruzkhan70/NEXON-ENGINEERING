/* navigation.js - Dynamic page visibility management using localStorage */

function loadNavigation() {
    try {
        const data = JSON.parse(localStorage.getItem('nexon_admin_data')) || {};
        const pages = data.pages || [
            { id: '1', slug: 'home', label: 'Home', visible: true },
            { id: '2', slug: 'about', label: 'About', visible: true },
            { id: '3', slug: 'services', label: 'Services', visible: true },
            { id: '4', slug: 'projects', label: 'Projects', visible: true },
            { id: '5', slug: 'contact', label: 'Contact', visible: true }
        ];
        
        const navContainer = document.getElementById('dynamic-nav');
        const mobileNavContainer = document.getElementById('dynamic-mobile-nav');

        if (navContainer) navContainer.innerHTML = '';
        if (mobileNavContainer) mobileNavContainer.innerHTML = '';
        
        const pageLabels = {
            'about': 'About',
            'services': 'Services',
            'projects': 'Projects',
            'our-clients': 'Our Clients',
            'contact': 'Contact'
        };
        
        const pageUrls = {
            'about': 'about.html',
            'services': 'services.html',
            'projects': 'projects.html',
            'our-clients': 'our-clients.html',
            'contact': 'contact.html'
        };
        
        pages.forEach(page => {
            if (page.visible && page.slug !== 'home') {
                const currentPage = window.location.pathname.split('/').pop();
                const pageUrl = pageUrls[page.slug] || `${page.slug}.html`;
                const isActive = currentPage === pageUrl;
                
                const link = document.createElement('a');
                link.href = pageUrl;
                link.className = isActive ? 'text-royal' : 'hover:text-[#8FC1FA]';
                link.textContent = page.label || pageLabels[page.slug] || page.slug;
                if (navContainer) navContainer.appendChild(link);

                if (mobileNavContainer) {
                    const mobileLink = document.createElement('a');
                    mobileLink.href = pageUrl;
                    mobileLink.className = 'block py-2 hover:text-royal';
                    mobileLink.textContent = page.label || pageLabels[page.slug] || page.slug;
                    mobileNavContainer.appendChild(mobileLink);
                }
            }
        });
    } catch (err) {
        console.error('Error loading navigation:', err);
    }
}

function loadSettings() {
    try {
        const data = JSON.parse(localStorage.getItem('nexon_admin_data')) || {};
        const settings = data.settings || {
            companyName: 'NEXON Engineering Services',
            tagline: 'Industrial Excellence, Trusted Solutions',
            email: 'nexonengineering.service@gmail.com',
            phone: '+94 77 375 3621',
            whatsapp: '+94773753621',
            address: 'Colombo, Sri Lanka',
            facebook: '',
            instagram: '',
            linkedin: ''
        };
        
        document.querySelectorAll('[data-setting]').forEach(el => {
            const key = el.getAttribute('data-setting');
            if (settings[key]) {
                el.textContent = settings[key];
            }
        });
        
        document.querySelectorAll('[data-setting-href]').forEach(el => {
            const key = el.getAttribute('data-setting-href');
            if (settings[key]) {
                el.href = settings[key];
            }
        });
        
        return settings;
    } catch (err) {
        console.error('Error loading settings:', err);
        return null;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadNavigation();
        loadSettings();
    });
} else {
    loadNavigation();
    loadSettings();
}
