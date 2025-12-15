/**
 * تحسينات Mobile والميزات التفاعلية
 */

(function() {
  'use strict';
  
  // ========== Dark Mode Toggle ==========
  
  class DarkModeToggle {
    constructor() {
      this.init();
    }
    
    init() {
      // Get saved preference or system preference
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      this.currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      this.applyTheme(this.currentTheme);
      
      // Create toggle button
      this.createToggleButton();
      
      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.currentTheme = e.matches ? 'dark' : 'light';
          this.applyTheme(this.currentTheme);
        }
      });
    }
    
    createToggleButton() {
      // Check if button already exists
      if (document.getElementById('theme-toggle')) return;
      
      const button = document.createElement('button');
      button.id = 'theme-toggle';
      button.className = 'theme-toggle';
      button.setAttribute('aria-label', 'تبديل الوضع الداكن');
      button.innerHTML = this.currentTheme === 'dark' 
        ? '<span>☀️</span>' 
        : '<span>🌙</span>';
      
      button.addEventListener('click', () => this.toggle());
      
      // Add to navbar
      const navbar = document.querySelector('.navbar .nav-inner');
      if (navbar) {
        navbar.appendChild(button);
      }
    }
    
    toggle() {
      this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.applyTheme(this.currentTheme);
      localStorage.setItem('theme', this.currentTheme);
      
      // Update button icon
      const button = document.getElementById('theme-toggle');
      if (button) {
        button.innerHTML = this.currentTheme === 'dark' 
          ? '<span>☀️</span>' 
          : '<span>🌙</span>';
      }
    }
    
    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
  
  // ========== Enhanced Mobile Menu ==========
  
  class MobileMenu {
    constructor() {
      this.init();
    }
    
    init() {
      this.createMenuToggle();
      this.createOverlay();
      this.setupEventListeners();
    }
    
    createMenuToggle() {
      // Check if already exists
      if (document.querySelector('.menu-toggle')) return;
      
      const toggle = document.createElement('button');
      toggle.className = 'menu-toggle';
      toggle.setAttribute('aria-label', 'فتح القائمة');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
      `;
      
      const navbar = document.querySelector('.navbar .nav-inner');
      if (navbar) {
        navbar.insertBefore(toggle, navbar.querySelector('.nav-links'));
      }
    }
    
    createOverlay() {
      // Check if already exists
      if (document.querySelector('.nav-overlay')) return;
      
      const overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }
    
    setupEventListeners() {
      const toggle = document.querySelector('.menu-toggle');
      const navLinks = document.querySelector('.nav-links');
      const overlay = document.querySelector('.nav-overlay');
      
      if (!toggle || !navLinks || !overlay) return;
      
      // Toggle menu
      toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        
        if (isOpen) {
          this.closeMenu();
        } else {
          this.openMenu();
        }
      });
      
      // Close on overlay click
      overlay.addEventListener('click', () => this.closeMenu());
      
      // Close on link click
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
      
      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeMenu();
        }
      });
    }
    
    openMenu() {
      const toggle = document.querySelector('.menu-toggle');
      const navLinks = document.querySelector('.nav-links');
      const overlay = document.querySelector('.nav-overlay');
      
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'إغلاق القائمة');
      navLinks.setAttribute('data-open', 'true');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    closeMenu() {
      const toggle = document.querySelector('.menu-toggle');
      const navLinks = document.querySelector('.nav-links');
      const overlay = document.querySelector('.nav-overlay');
      
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'فتح القائمة');
      navLinks.setAttribute('data-open', 'false');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  // ========== Touch Enhancements ==========
  
  class TouchEnhancements {
    constructor() {
      this.init();
    }
    
    init() {
      // Add touch feedback to buttons
      this.addTouchFeedback();
      
      // Improve form inputs on mobile
      this.enhanceFormInputs();
    }
    
    addTouchFeedback() {
      const interactiveElements = document.querySelectorAll('a, button, .card');
      
      interactiveElements.forEach(el => {
        el.addEventListener('touchstart', function() {
          this.style.opacity = '0.7';
        }, { passive: true });
        
        el.addEventListener('touchend', function() {
          this.style.opacity = '';
        }, { passive: true });
      });
    }
    
    enhanceFormInputs() {
      // Add appropriate input modes
      const emailInputs = document.querySelectorAll('input[type="email"]');
      emailInputs.forEach(input => {
        input.setAttribute('inputmode', 'email');
        input.setAttribute('autocomplete', 'email');
      });
      
      const telInputs = document.querySelectorAll('input[type="tel"]');
      telInputs.forEach(input => {
        input.setAttribute('inputmode', 'tel');
        input.setAttribute('autocomplete', 'tel');
      });
      
      const numberInputs = document.querySelectorAll('input[type="number"]');
      numberInputs.forEach(input => {
        input.setAttribute('inputmode', 'numeric');
      });
      
      // Prevent zoom on iOS
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        const fontSize = window.getComputedStyle(input).fontSize;
        if (parseFloat(fontSize) < 16) {
          input.style.fontSize = '16px';
        }
      });
    }
  }
  
  // ========== Responsive Images ==========
  
  class ResponsiveImages {
    constructor() {
      this.init();
    }
    
    init() {
      // Add loading="lazy" to images
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
      });
      
      // Add aspect ratio to prevent layout shift
      images.forEach(img => {
        if (img.width && img.height) {
          img.style.aspectRatio = `${img.width} / ${img.height}`;
        }
      });
    }
  }
  
  // ========== Smooth Scroll ==========
  
  class SmoothScroll {
    constructor() {
      this.init();
    }
    
    init() {
      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href === '#') return;
          
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    }
  }
  
  // ========== Performance Monitoring ==========
  
  class PerformanceMonitor {
    constructor() {
      this.init();
    }
    
    init() {
      // Log performance metrics
      if ('performance' in window) {
        window.addEventListener('load', () => {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          const connectTime = perfData.responseEnd - perfData.requestStart;
          const renderTime = perfData.domComplete - perfData.domLoading;
          
          console.log('Performance Metrics:');
          console.log(`Page Load Time: ${pageLoadTime}ms`);
          console.log(`Connect Time: ${connectTime}ms`);
          console.log(`Render Time: ${renderTime}ms`);
        });
      }
    }
  }
  
  // ========== Initialize All ==========
  
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initModules);
    } else {
      initModules();
    }
  }
  
  function initModules() {
    // Initialize all modules
    new DarkModeToggle();
    new MobileMenu();
    new TouchEnhancements();
    new ResponsiveImages();
    new SmoothScroll();
    new PerformanceMonitor();
    
    console.log('Mobile enhancements initialized');
  }
  
  // Start
  init();
  
  // Export for external use
  window.MobileEnhancements = {
    DarkModeToggle,
    MobileMenu,
    TouchEnhancements,
    ResponsiveImages,
    SmoothScroll,
    PerformanceMonitor
  };
  
})();
