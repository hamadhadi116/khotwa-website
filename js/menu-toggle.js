/**
 * Menu Toggle - Mobile Navigation
 * Handles opening/closing the mobile menu
 */

(function() {
  'use strict';
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    console.log('[Menu Toggle] Initializing...');
    
    const btn = document.getElementById('menu-toggle');
    const nav = document.getElementById('primary-nav');
    
    if (!btn || !nav) {
      console.warn('[Menu Toggle] Elements not found:', { btn: !!btn, nav: !!nav });
      return;
    }
    
    console.log('[Menu Toggle] Elements found, attaching event listener');
    
    // Set initial state
    nav.setAttribute('data-open', 'false');
    
    // Toggle function
    function setMenu(open) {
      nav.setAttribute('data-open', open ? 'true' : 'false');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      console.log('[Menu Toggle] Menu state:', open ? 'OPEN' : 'CLOSED');
    }
    
    // Click handler
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const isOpen = nav.getAttribute('data-open') === 'true';
      setMenu(!isOpen);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      const isOpen = nav.getAttribute('data-open') === 'true';
      if (isOpen && !nav.contains(e.target) && !btn.contains(e.target)) {
        setMenu(false);
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const isOpen = nav.getAttribute('data-open') === 'true';
        if (isOpen) {
          setMenu(false);
        }
      }
    });
    
    console.log('[Menu Toggle] Initialized successfully');
  }
})();
