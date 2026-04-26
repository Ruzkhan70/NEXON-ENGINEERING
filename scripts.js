/* scripts.js - NEXON Engineering Services - Enhanced Animations */

document.addEventListener("DOMContentLoaded", function() {
  if (typeof feather !== "undefined") {
    feather.replace();
  }

  // Start Visitor Tracking
  if (typeof trackVisitors === "function") {
    trackVisitors();
  }

  // Custom Cursor logic
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    cursor.style.opacity = "1";
  });

  document.querySelectorAll("a, button, .clickable").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("active"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
  });

  // Mobile menu toggle
  const mobileBtn = document.getElementById("mobile-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      mobileMenu.classList.toggle("animate-slide-down");
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
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Staggered reveal
        setTimeout(() => {
          entry.target.classList.add("show");
          if (entry.target.classList.contains("counter")) {
            animateCounter(entry.target);
          }
        }, index * 100);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in-left, .fade-in-right, .fade-in-up, .service-card, .project-item, .counter, .glass-card")
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

  // High-Performance 3D Tilt Effect
  const tiltElements = document.querySelectorAll(".tilt, .glass-card, .service-card, .project-card");
  
  tiltElements.forEach(card => {
    let rect;
    let isTilting = false;
    let requestRef;

    let mouseX = 0, mouseY = 0;

    const updateTilt = () => {
      if (!isTilting) return;
      if (!rect) rect = card.getBoundingClientRect();
      
      const x = mouseX - rect.left;
      const y = mouseY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation (max 15 degrees)
      const rotateX = ((y - centerY) / centerY) * -10; 
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(30, 136, 229, 0.25)`;
      
      const inner = card.querySelector('i, .icon-container, img');
      if (inner) {
        inner.style.transform = `translateZ(50px) translateX(${rotateY * 2}px) translateY(${rotateX * -2}px)`;
      }
      
      requestRef = requestAnimationFrame(updateTilt);
    };

    card.addEventListener("mouseenter", () => {
      rect = card.getBoundingClientRect();
      card.style.transition = "transform 0.1s ease-out, box-shadow 0.1s ease-out";
      isTilting = true;
      requestRef = requestAnimationFrame(updateTilt);
    });

    card.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    card.addEventListener("mouseleave", () => {
      isTilting = false;
      if (requestRef) cancelAnimationFrame(requestRef);
      card.style.transition = "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      card.style.boxShadow = "none";
      
      const inner = card.querySelector('i, .icon-container, img');
      if (inner) {
        inner.style.transform = "translateZ(0) translateX(0) translateY(0)";
        inner.style.transition = "all 0.6s ease";
      }
    });
  });

  // particles.js init
  const particlesEl = document.getElementById("particles-js");
  if (particlesEl && window.particlesJS) {
    try {
      particlesJS("particles-js", {
        "particles": {
          "number": {
            "value": 40,
            "density": { "enable": true, "value_area": 700 }
          },
          "color": { "value": "#8FC1FA" },
          "shape": { "type": "circle" },
          "opacity": { 
            "value": 1,
            "random": true,
            "anim": { "enable": true, "speed": 1, "opacity_min": 0.5 }
          },
          "size": { "value": 2, "random": true },
          "line_linked": {
            "enable": true,
            "distance": 60,
            "color": "#8FC1FA",
            "opacity": 1,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 1,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": true
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
            "repulse": { "distance": 80, "duration": 0.3 },
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

  // Dynamic content sync from Firebase
  function loadDynamicContent() {
    syncWithFirebase('site', (site) => {
      if (!site) return;

      // Hero
      const heroTitle = document.getElementById('heroTitle');
      if (heroTitle) heroTitle.textContent = site.heroTitle || 'Premier Engineering Solutions';
      
      const heroSubtitle = document.getElementById('heroSubtitle');
      if (heroSubtitle) heroSubtitle.textContent = site.heroSubtitle || 'Innovating Industry Standards';

      // Stats
      if (site.stats) {
        const statsMap = {
          statsProjects: site.stats.projects,
          statsClients: site.stats.clients,
          statsYears: site.stats.years,
          statsEmergency: site.stats.support
        };
        for (const [id, value] of Object.entries(statsMap)) {
          const el = document.getElementById(id);
          if (el) el.textContent = value;
        }
      }

      // Contact Info
      const emailText = document.getElementById('contactEmailText');
      if (emailText) emailText.textContent = site.contact?.email;

      const phoneText = document.getElementById('contactPhoneText');
      if (phoneText) phoneText.textContent = site.contact?.phone;

      const addressText = document.getElementById('contactAddressText');
      if (addressText) addressText.textContent = site.contact?.address;
    });

    // Sync Services
    syncWithFirebase('services', (services) => {
      if (!services) return;
      // You can implement dynamic service card rendering here if needed
    });
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
