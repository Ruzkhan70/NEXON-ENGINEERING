/* scripts.js - NEXON Engineering Services - Enhanced Animations */

document.addEventListener("DOMContentLoaded", function() {
  if (typeof feather !== "undefined") {
    feather.replace();
  }

  // Mobile menu toggle
  const mobileBtn = document.getElementById("mobile-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Navbar background blur on scroll
  const nav = document.getElementById("navbar");
  if (nav && nav.classList.contains('bg-transparent')) {
    function adjustNavOnScroll() {
      if (window.scrollY > 50) {
        nav.classList.add("bg-navy/60", "backdrop-blur-xl", "shadow-lg");
      } else {
        nav.classList.remove("bg-navy/60", "backdrop-blur-xl", "shadow-lg");
      }
    }
    adjustNavOnScroll();
    window.addEventListener("scroll", adjustNavOnScroll);
  }

  // Scroll Progress Bar
  const scrollProgress = document.getElementById("scroll-progress");
  if (scrollProgress) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = scrollPercent + "%";
    });
  }

  // IntersectionObserver for reveal animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        
        // Trigger counter animation if it's a counter element
        if (entry.target.classList.contains("counter")) {
          animateCounter(entry.target);
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in-left, .fade-in-right, .fade-in-up, .service-card, .project-item, .counter")
    .forEach(el => observer.observe(el));

  // Counter Animation
  function animateCounter(element) {
    const target = parseInt(element.getAttribute("data-target"));
    if (!target) return;
    
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        element.textContent = Math.floor(current) + "+";
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + "+";
      }
    };
    
    updateCounter();
  }

  // Show hero content and logo
  const heroContent = document.getElementById("hero-content");
  const mainLogo = document.getElementById("main-logo");
  if (heroContent) {
    window.addEventListener("load", () => {
      heroContent.style.opacity = "1";
      if (mainLogo) mainLogo.classList.add("show");
    });
    if (document.readyState === "complete") {
      heroContent.style.opacity = "1";
      if (mainLogo) mainLogo.classList.add("show");
    }
  }

  // Parallax effect for background shapes
  const bgShapes = document.querySelectorAll(".bg-float-1, .bg-float-2, .bg-float-3");
  if (bgShapes.length > 0) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      bgShapes.forEach((shape, index) => {
        const speed = 0.1 + (index * 0.05);
        shape.style.transform = `translateY(${scrollY * speed}px)`;
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // Add ripple effect to buttons
  document.querySelectorAll(".btn-glow, .btn-glow-animated").forEach(btn => {
    btn.addEventListener("click", function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position: absolute;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        pointer-events: none;
        width: 100px;
        height: 100px;
        left: ${x - 50}px;
        top: ${y - 50}px;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
      `;
      
      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Magnetic hover effect for cards
  document.querySelectorAll(".magnetic-hover").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    });
  });

  // particles.js init
  const particlesEl = document.getElementById("particles-js");
  if (particlesEl && window.particlesJS) {
    try {
      particlesJS("particles-js", {
        "particles": {
          "number": {
            "value": 120,
            "density": { "enable": true, "value_area": 500 }
          },
          "color": { "value": "#ffffff" },
          "shape": { "type": "circle" },
          "opacity": { 
            "value": 1,
            "random": false,
            "anim": { "enable": false }
          },
          "size": { "value": 4, "random": true },
          "line_linked": {
            "enable": true,
            "distance": 140,
            "color": "#ffffff",
            "opacity": 0.6,
            "width": 1.5
          },
          "move": {
            "enable": true,
            "speed": 0.5,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": { "enable": true, "mode": "repulse" },
            "onclick": { "enable": true, "mode": "push" },
            "resize": true
          },
          "modes": {
            "repulse": { "distance": 150, "duration": 0.5 },
            "push": { "particles_nb": 4 }
          }
        },
        "retina_detect": true
      });
    } catch (e) {
      console.warn("particles.js init failed:", e);
    }
  }

  // Light client-side contact form behaviour
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      alert("Thanks — your message was submitted (demo). Replace with backend endpoint to save messages.");
      contactForm.reset();
    });
  }

  // Dynamic content sync from Admin JSON API
  async function loadDynamicContent() {
    try {
      const [pagesRes, contentRes] = await Promise.all([
        fetch('/api/pages/public'),
        fetch('/api/content')
      ]);
      const pages = await pagesRes.json();
      const content = await contentRes.json();

      // Page visibility safeguard on direct route access
      const path = window.location.pathname.split('/').pop() || 'index.html';
      const pageMap = {
        'index.html': 'home',
        'about.html': 'about',
        'services.html': 'services',
        'projects.html': 'projects',
        'our-clients.html': 'our-clients',
        'contact.html': 'contact'
      };
      const currentPage = pageMap[path];
      if (currentPage && currentPage !== 'home' && !pages[currentPage]?.visible) {
        return window.location.href = '/';
      }

      const home = content.home || {};
      if (home.heroTitle) {
        const el = document.getElementById('heroTitle');
        if (el) el.textContent = home.heroTitle;
      }
      if (home.heroSubtitle) {
        const el = document.getElementById('heroSubtitle');
        if (el) el.textContent = home.heroSubtitle;
      }
      if (home.aboutPreview) {
        const el = document.getElementById('aboutPreviewText');
        if (el) el.textContent = home.aboutPreview;
      }
      if (home.stats) {
        const stats = home.stats;
        const statsMap = {
          statsProjects: stats.projectsDone,
          statsClients: stats.industrialClients,
          statsYears: stats.yearsExperience,
          statsEmergency: stats.emergencySupport
        };
        for (const [id, value] of Object.entries(statsMap)) {
          const el = document.getElementById(id);
          if (el) el.textContent = value;
        }
      }

      const about = content.about || {};
      if (about.whoWeAre) {
        const el = document.getElementById('aboutWhoWeAreText');
        if (el) el.textContent = about.whoWeAre.description || '';
      }
      if (about.mission) {
        const el = document.getElementById('aboutMissionText');
        if (el) el.textContent = about.mission.description || '';
      }
      if (about.vision) {
        const el = document.getElementById('aboutVisionText');
        if (el) el.textContent = about.vision.description || '';
      }

      const contactData = content.contact || {};
      if (contactData.address) {
        const el = document.getElementById('contactAddressText');
        if (el) el.textContent = contactData.address;
      }
      if (contactData.email) {
        const el = document.getElementById('contactEmailText');
        if (el) el.textContent = contactData.email;
      }
      if (contactData.phone) {
        const el = document.getElementById('contactPhoneText');
        if (el) el.textContent = contactData.phone;
      }
      if (contactData.whatsapp) {
        const el = document.getElementById('contactWhatsappText');
        if (el) el.textContent = contactData.whatsapp;
      }

      const footer = content.footer || {};
      if (footer.companyDescription) {
        const el = document.getElementById('footerCompanyDescription');
        if (el) el.textContent = footer.companyDescription;
      }
      if (footer.copyright) {
        const el = document.getElementById('footerCopyright');
        if (el) el.textContent = footer.copyright;
      }
    } catch (err) {
      console.warn('Dynamic content sync failed:', err);
    }
  }

  loadDynamicContent();
});

// Add ripple animation keyframes dynamically
const style = document.createElement("style");
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
