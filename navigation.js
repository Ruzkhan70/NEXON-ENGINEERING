/* navigation.js - Dynamic page visibility management using localStorage */

function loadNavigation() {
    // Firebase Listener for Navigation
    syncWithFirebase('site/pages', (pagesData) => {
        let pagesArray = [];
        if (pagesData && !Array.isArray(pagesData)) {
            const order = ['home', 'about', 'services', 'projects', 'clients', 'contact'];
            pagesArray = order.map(slug => ({
                slug: slug === 'clients' ? 'our-clients' : slug,
                label: slug === 'clients' ? 'Our Clients' : (pagesData[slug]?.title || slug.charAt(0).toUpperCase() + slug.slice(1)),
                visible: pagesData[slug]?.visible !== false
            }));
        } else {
            pagesArray = pagesData || [
                { id: '1', slug: 'home', label: 'Home', visible: true },
                { id: '2', slug: 'about', label: 'About', visible: true },
                { id: '3', slug: 'services', label: 'Services', visible: true },
                { id: '4', slug: 'projects', label: 'Projects', visible: true },
                { id: '6', slug: 'our-clients', label: 'Our Clients', visible: true },
                { id: '5', slug: 'contact', label: 'Contact', visible: true }
            ];
        }

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

        pagesArray.forEach(page => {
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
    // Try Firebase first, fallback to localStorage
    syncWithFirebase('site', (siteData) => {
        if (siteData) {
            localStorage.setItem('nexon_site', JSON.stringify(siteData));
            applySiteSettings(siteData);
        }
    });
    
    // Also try loading from localStorage (fallback)
    setTimeout(() => {
        try {
            const stored = localStorage.getItem('nexon_site');
            if (stored) {
                const siteData = JSON.parse(stored);
                applySiteSettings(siteData);
            }
        } catch(e) {}
    }, 1500);
}

function applySiteSettings(siteData) {
    if (!siteData) return;
    
    // Global settings
    const globals = {
        companyName: siteData.companyName,
        tagline: siteData.tagline,
        email: siteData.email,
        phone: siteData.phone,
        whatsapp: siteData.whatsapp,
        address: siteData.address,
        facebook: siteData.facebook,
        instagram: siteData.instagram,
        linkedin: siteData.linkedin
    };
    
    // Update elements with data-setting
    document.querySelectorAll('[data-setting]').forEach(el => {
        const key = el.getAttribute('data-setting');
        if (globals[key]) {
            el.textContent = globals[key];
        }
        else if (siteData.pages) {
            Object.keys(siteData.pages).forEach(page => {
                const pageData = siteData.pages[page];
                if (pageData && pageData[key]) {
                    el.textContent = pageData[key];
                }
            });
        }
    });
    
    document.querySelectorAll('[data-setting-href]').forEach(el => {
        const key = el.getAttribute('data-setting-href');
        if (globals[key]) {
            el.href = globals[key];
        }
    });
    
    // Update Title
    if (siteData.companyName) {
        document.title = siteData.companyName + (window.location.pathname.includes('index') ? ' — Home' : '');
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
