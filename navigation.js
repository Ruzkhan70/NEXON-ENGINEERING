/* navigation.js - Dynamic page visibility management using localStorage */

function loadNavigation() {
    // Firebase Listener for Navigation
    syncWithFirebase('site/pages', (pagesData) => {
        const pages = pagesData || [
            { id: '1', slug: 'home', label: 'Home', visible: true },
            { id: '2', slug: 'about', label: 'About', visible: true },
            { id: '3', slug: 'services', label: 'Services', visible: true },
            { id: '4', slug: 'projects', label: 'Projects', visible: true },
            { id: '6', slug: 'our-clients', label: 'Our Clients', visible: true },
            { id: '5', slug: 'contact', label: 'Contact', visible: true }
        ];

        const navContainer = document.getElementById('dynamic-nav');
        const mobileNavContainer = document.getElementById('dynamic-mobile-nav');

        if (navContainer) navContainer.innerHTML = '';
        if (mobileNavContainer) mobileNavContainer.innerHTML = '';

        const pageUrls = {
            'about': 'about.html',
            'services': 'services.html',
            'projects': 'projects.html',
            'our-clients': 'our-clients.html',
            'contact': 'contact.html'
        };

        pages.forEach(page => {
            if (page.visible && page.slug !== 'home') {
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                const pageUrl = pageUrls[page.slug] || `${page.slug}.html`;
                const isActive = currentPage === pageUrl;

                const link = document.createElement('a');
                link.href = pageUrl;
                link.className = isActive ? 'text-royal' : 'hover:text-[#8FC1FA]';
                link.textContent = page.label;
                if (navContainer) navContainer.appendChild(link);

                if (mobileNavContainer) {
                    const mobileLink = document.createElement('a');
                    mobileLink.href = pageUrl;
                    mobileLink.className = 'block py-2 hover:text-royal';
                    mobileLink.textContent = page.label;
                    mobileNavContainer.appendChild(mobileLink);
                }
            }
        });
    });
}

function loadSettings() {
    syncWithFirebase('site', (site) => {
        if (!site) return;
        
        const settings = {
            companyName: site.companyName,
            tagline: site.tagline || 'Industrial Excellence, Trusted Solutions',
            email: site.contact?.email,
            phone: site.contact?.phone,
            whatsapp: site.contact?.whatsapp,
            address: site.contact?.address,
            facebook: site.contact?.facebook,
            instagram: site.contact?.instagram,
            linkedin: site.contact?.linkedin
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
        
        // Update Title
        if (site.companyName) {
            document.title = site.companyName + (window.location.pathname.includes('index') ? ' — Home' : '');
        }
    });
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
