/* navigation.js - Dynamic page visibility management */

async function loadNavigation() {
    try {
        const response = await fetch('/api/pages/public');
        const pages = await response.json();
        
        const navContainer = document.getElementById('dynamic-nav');
        const mobileNavContainer = document.getElementById('dynamic-mobile-nav');

        if (navContainer) navContainer.innerHTML = '';
        if (mobileNavContainer) mobileNavContainer.innerHTML = '';
        
        const pageOrder = ['about', 'services', 'projects', 'our-clients', 'contact'];
        
        for (const pageId of pageOrder) {
            if (pages[pageId] && pages[pageId].visible) {
                const pageLabels = {
                    'about': 'About',
                    'services': 'Services',
                    'projects': 'Projects',
                    'our-clients': 'Our Clients',
                    'contact': 'Contact'
                };
                
                const pageUrl = pageId === 'our-clients' ? 'our-clients.html' : `${pageId}.html`;
                const currentPage = window.location.pathname.split('/').pop();
                const isActive = currentPage === pageUrl || (currentPage === '' && pageUrl === 'index.html');
                
                const link = document.createElement('a');
                link.href = pageUrl;
                link.className = isActive ? 'text-royal' : 'hover:text-[#8FC1FA]';
                link.textContent = pageLabels[pageId] || pageId;
                if (navContainer) navContainer.appendChild(link);

                if (mobileNavContainer) {
                    const mobileLink = document.createElement('a');
                    mobileLink.href = pageUrl;
                    mobileLink.className = 'block py-2 hover:text-royal';
                    mobileLink.textContent = pageLabels[pageId] || pageId;
                    mobileNavContainer.appendChild(mobileLink);
                }
            }
        }
    } catch (err) {
        console.error('Error loading navigation:', err);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavigation);
} else {
    loadNavigation();
}
