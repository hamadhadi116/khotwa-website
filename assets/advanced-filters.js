/**
 * Advanced Filtering and Sorting System
 * نظام التصفية والفرز المتقدم
 */

(function() {
  'use strict';

  class AdvancedFilters {
    constructor(items, containerId, renderFunction) {
      this.allItems = items;
      this.filteredItems = items;
      this.containerId = containerId;
      this.renderFunction = renderFunction;
      this.currentSort = 'date-desc'; // date-desc, date-asc, title-asc, title-desc
      this.currentFilters = {
        category: 'all',
        dateRange: 'all',
        search: ''
      };
      
      this.init();
    }

    init() {
      this.createFilterControls();
      this.applyFilters();
    }

    createFilterControls() {
      const container = document.getElementById(this.containerId);
      if (!container) return;

      const filtersHTML = `
        <div class="advanced-filters" role="region" aria-label="خيارات التصفية والفرز">
          <!-- Sort Options -->
          <div class="filter-group">
            <label for="sort-select" class="filter-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="4" y1="6" x2="16" y2="6"/><line x1="4" y1="12" x2="13" y2="12"/><line x1="4" y1="18" x2="10" y2="18"/>
              </svg>
              <span data-lang="ar">الترتيب</span>
              <span data-lang="en" hidden>Sort</span>
            </label>
            <select id="sort-select" class="filter-select">
              <option value="date-desc" data-lang-ar="الأحدث أولاً" data-lang-en="Newest First">الأحدث أولاً</option>
              <option value="date-asc" data-lang-ar="الأقدم أولاً" data-lang-en="Oldest First">الأقدم أولاً</option>
              <option value="title-asc" data-lang-ar="العنوان (أ-ي)" data-lang-en="Title (A-Z)">العنوان (أ-ي)</option>
              <option value="title-desc" data-lang-ar="العنوان (ي-أ)" data-lang-en="Title (Z-A)">العنوان (ي-أ)</option>
            </select>
          </div>

          <!-- Date Range Filter -->
          <div class="filter-group">
            <label for="date-range-select" class="filter-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span data-lang="ar">الفترة الزمنية</span>
              <span data-lang="en" hidden>Date Range</span>
            </label>
            <select id="date-range-select" class="filter-select">
              <option value="all" data-lang-ar="كل الفترات" data-lang-en="All Time">كل الفترات</option>
              <option value="today" data-lang-ar="اليوم" data-lang-en="Today">اليوم</option>
              <option value="week" data-lang-ar="هذا الأسبوع" data-lang-en="This Week">هذا الأسبوع</option>
              <option value="month" data-lang-ar="هذا الشهر" data-lang-en="This Month">هذا الشهر</option>
              <option value="year" data-lang-ar="هذه السنة" data-lang-en="This Year">هذه السنة</option>
            </select>
          </div>

          <!-- Reset Filters -->
          <button id="reset-filters-btn" class="filter-reset-btn" title="إعادة تعيين الفلاتر">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
            <span data-lang="ar">إعادة تعيين</span>
            <span data-lang="en" hidden>Reset</span>
          </button>

          <!-- Results Count -->
          <div class="filter-results-count" id="filter-results-count">
            <span data-lang="ar">عرض ${this.filteredItems.length} من ${this.allItems.length}</span>
            <span data-lang="en" hidden>Showing ${this.filteredItems.length} of ${this.allItems.length}</span>
          </div>
        </div>
      `;

      // Insert before the content container
      const filtersDiv = document.createElement('div');
      filtersDiv.innerHTML = filtersHTML;
      container.parentNode.insertBefore(filtersDiv.firstElementChild, container);

      // Add event listeners
      document.getElementById('sort-select')?.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.applyFilters();
      });

      document.getElementById('date-range-select')?.addEventListener('change', (e) => {
        this.currentFilters.dateRange = e.target.value;
        this.applyFilters();
      });

      document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
        this.resetFilters();
      });
    }

    applyFilters() {
      let filtered = [...this.allItems];

      // Apply date range filter
      if (this.currentFilters.dateRange !== 'all') {
        filtered = this.filterByDateRange(filtered, this.currentFilters.dateRange);
      }

      // Apply search filter (if exists)
      if (this.currentFilters.search) {
        const searchLower = this.currentFilters.search.toLowerCase();
        filtered = filtered.filter(item => 
          item.title?.toLowerCase().includes(searchLower) ||
          item.summary?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      filtered = this.sortItems(filtered, this.currentSort);

      this.filteredItems = filtered;
      this.updateResultsCount();
      
      // Trigger render
      if (this.renderFunction) {
        this.renderFunction(filtered);
      }

      // Update pagination if exists
      if (window.currentPagination) {
        window.currentPagination.updateItems(filtered);
      }
    }

    filterByDateRange(items, range) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      return items.filter(item => {
        const itemDate = new Date(item.date);
        
        switch(range) {
          case 'today':
            return itemDate >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return itemDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return itemDate >= monthAgo;
          case 'year':
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return itemDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    sortItems(items, sortType) {
      const sorted = [...items];
      
      switch(sortType) {
        case 'date-desc':
          return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'date-asc':
          return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        case 'title-asc':
          return sorted.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
        case 'title-desc':
          return sorted.sort((a, b) => b.title.localeCompare(a.title, 'ar'));
        default:
          return sorted;
      }
    }

    updateResultsCount() {
      const countElement = document.getElementById('filter-results-count');
      if (countElement) {
        countElement.innerHTML = `
          <span data-lang="ar">عرض ${this.filteredItems.length} من ${this.allItems.length}</span>
          <span data-lang="en" hidden>Showing ${this.filteredItems.length} of ${this.allItems.length}</span>
        `;
      }
    }

    resetFilters() {
      this.currentSort = 'date-desc';
      this.currentFilters = {
        category: 'all',
        dateRange: 'all',
        search: ''
      };

      // Reset UI
      const sortSelect = document.getElementById('sort-select');
      const dateRangeSelect = document.getElementById('date-range-select');
      
      if (sortSelect) sortSelect.value = 'date-desc';
      if (dateRangeSelect) dateRangeSelect.value = 'all';

      this.applyFilters();
    }

    setSearchQuery(query) {
      this.currentFilters.search = query;
      this.applyFilters();
    }
  }

  // Export to global scope
  window.KhotwaAdvancedFilters = AdvancedFilters;

})();
