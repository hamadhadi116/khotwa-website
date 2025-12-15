/**
 * Pagination System for Khotwa Website
 * نظام تقسيم الصفحات للأخبار والفعاليات
 */

(function() {
  'use strict';

  const ITEMS_PER_PAGE = 6; // عدد العناصر في كل صفحة

  class Pagination {
    constructor(containerId, items, renderFunction) {
      this.container = document.getElementById(containerId);
      this.items = items;
      this.renderFunction = renderFunction;
      this.currentPage = 1;
      this.totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
      
      this.init();
    }

    init() {
      this.render();
      this.createPaginationControls();
    }

    render() {
      const start = (this.currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const pageItems = this.items.slice(start, end);
      
      this.renderFunction(pageItems);
      this.updatePaginationControls();
      
      // Scroll to top of content
      this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    createPaginationControls() {
      const paginationContainer = document.createElement('div');
      paginationContainer.className = 'pagination-controls';
      paginationContainer.id = 'pagination-controls';
      paginationContainer.setAttribute('role', 'navigation');
      paginationContainer.setAttribute('aria-label', 'التنقل بين الصفحات');
      
      // Previous button
      const prevBtn = document.createElement('button');
      prevBtn.className = 'pagination-btn pagination-prev';
      prevBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        <span data-lang="ar">السابق</span>
        <span data-lang="en" hidden>Previous</span>
      `;
      prevBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
      
      // Page numbers container
      const pagesContainer = document.createElement('div');
      pagesContainer.className = 'pagination-pages';
      pagesContainer.id = 'pagination-pages';
      
      // Next button
      const nextBtn = document.createElement('button');
      nextBtn.className = 'pagination-btn pagination-next';
      nextBtn.innerHTML = `
        <span data-lang="ar">التالي</span>
        <span data-lang="en" hidden>Next</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      `;
      nextBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
      
      paginationContainer.appendChild(prevBtn);
      paginationContainer.appendChild(pagesContainer);
      paginationContainer.appendChild(nextBtn);
      
      // Insert after container
      this.container.parentNode.insertBefore(paginationContainer, this.container.nextSibling);
      
      this.updatePaginationControls();
    }

    updatePaginationControls() {
      const pagesContainer = document.getElementById('pagination-pages');
      if (!pagesContainer) return;
      
      pagesContainer.innerHTML = '';
      
      // Show page numbers with ellipsis for large page counts
      const maxVisible = 5;
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);
      
      if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }
      
      // First page
      if (startPage > 1) {
        this.createPageButton(pagesContainer, 1);
        if (startPage > 2) {
          const ellipsis = document.createElement('span');
          ellipsis.className = 'pagination-ellipsis';
          ellipsis.textContent = '...';
          pagesContainer.appendChild(ellipsis);
        }
      }
      
      // Page numbers
      for (let i = startPage; i <= endPage; i++) {
        this.createPageButton(pagesContainer, i);
      }
      
      // Last page
      if (endPage < this.totalPages) {
        if (endPage < this.totalPages - 1) {
          const ellipsis = document.createElement('span');
          ellipsis.className = 'pagination-ellipsis';
          ellipsis.textContent = '...';
          pagesContainer.appendChild(ellipsis);
        }
        this.createPageButton(pagesContainer, this.totalPages);
      }
      
      // Update button states
      const prevBtn = document.querySelector('.pagination-prev');
      const nextBtn = document.querySelector('.pagination-next');
      
      if (prevBtn) {
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.setAttribute('aria-disabled', this.currentPage === 1);
      }
      
      if (nextBtn) {
        nextBtn.disabled = this.currentPage === this.totalPages;
        nextBtn.setAttribute('aria-disabled', this.currentPage === this.totalPages);
      }
      
      // Update page info
      this.updatePageInfo();
    }

    createPageButton(container, pageNum) {
      const btn = document.createElement('button');
      btn.className = 'pagination-page';
      btn.textContent = pageNum;
      btn.setAttribute('aria-label', `الصفحة ${pageNum}`);
      
      if (pageNum === this.currentPage) {
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'page');
      }
      
      btn.addEventListener('click', () => this.goToPage(pageNum));
      container.appendChild(btn);
    }

    updatePageInfo() {
      let infoElement = document.getElementById('pagination-info');
      if (!infoElement) {
        infoElement = document.createElement('div');
        infoElement.id = 'pagination-info';
        infoElement.className = 'pagination-info';
        const controls = document.getElementById('pagination-controls');
        controls.parentNode.insertBefore(infoElement, controls.nextSibling);
      }
      
      const start = (this.currentPage - 1) * ITEMS_PER_PAGE + 1;
      const end = Math.min(this.currentPage * ITEMS_PER_PAGE, this.items.length);
      
      infoElement.innerHTML = `
        <span data-lang="ar">عرض ${start}-${end} من ${this.items.length}</span>
        <span data-lang="en" hidden>Showing ${start}-${end} of ${this.items.length}</span>
      `;
    }

    goToPage(pageNum) {
      if (pageNum < 1 || pageNum > this.totalPages) return;
      this.currentPage = pageNum;
      this.render();
    }

    updateItems(newItems) {
      this.items = newItems;
      this.totalPages = Math.ceil(newItems.length / ITEMS_PER_PAGE);
      this.currentPage = 1;
      this.render();
    }
  }

  // Export to global scope
  window.KhotwaPagination = Pagination;

})();
