/**
 * About Page Loader
 * Loads "About Us" content and Council Members from Backend API
 */

// Get Backend URL from config
const BACKEND_URL = window.KHOTWA_CONFIG?.BACKEND_URL || 'https://3000-ivtx8t5s8uaytpylv5zyf-b88825ad.manus-asia.computer';

// Load About Content
async function loadAboutContent() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/trpc/about.get`);
    const data = await response.json();
    
    if (data.result && data.result.data) {
      const content = data.result.data;
      const currentLang = localStorage.getItem('language') || 'ar';
      
      // Update Vision
      const visionCard = document.querySelector('.card:has(h3:contains("الرؤية"))');
      if (visionCard) {
        const p = visionCard.querySelector('p');
        if (p) {
          p.textContent = currentLang === 'ar' ? content.visionAr : content.visionEn;
        }
      }
      
      // Update Mission
      const missionCard = document.querySelector('.card:has(h3:contains("الرسالة"))');
      if (missionCard) {
        const p = missionCard.querySelector('p');
        if (p) {
          p.textContent = currentLang === 'ar' ? content.missionAr : content.missionEn;
        }
      }
      
      // Update Goals
      const goalsCard = document.querySelector('.card:has(h3:contains("الأهداف"))');
      if (goalsCard) {
        const p = goalsCard.querySelector('p');
        if (p) {
          p.textContent = currentLang === 'ar' ? content.goalsAr : content.goalsEn;
        }
      }
      
      // Update Organization
      const orgCard = document.querySelector('.card:has(h3:contains("التنظيم"))');
      if (orgCard) {
        const p = orgCard.querySelector('p');
        if (p) {
          p.textContent = currentLang === 'ar' ? content.organizationAr : content.organizationEn;
        }
      }
    }
  } catch (error) {
    console.error('Failed to load about content:', error);
  }
}

// Load Council Members
async function loadCouncilMembers() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/trpc/councilMembers.list`);
    const data = await response.json();
    
    if (data.result && data.result.data) {
      const members = data.result.data;
      const currentLang = localStorage.getItem('language') || 'ar';
      const membersContainer = document.getElementById('council-members-container');
      
      if (membersContainer && members.length > 0) {
        membersContainer.innerHTML = members.map(member => `
          <div class="member-card">
            <img src="${member.photoUrl || '/assets/apple-touch-icon.png'}" 
                 alt="${currentLang === 'ar' ? member.nameAr : member.nameEn}" 
                 width="360" height="240"
                 loading="lazy" decoding="async" referrerpolicy="no-referrer">
            <h3 data-lang="ar">${member.nameAr}</h3>
            <h3 data-lang="en" hidden aria-hidden="true">${member.nameEn}</h3>
            <p class="muted" data-lang="ar">${member.positionAr}</p>
            <p class="muted" data-lang="en" hidden aria-hidden="true">${member.positionEn}</p>
          </div>
        `).join('');
      }
    }
  } catch (error) {
    console.error('Failed to load council members:', error);
  }
}

// Initialize
function initAboutPage() {
  loadAboutContent();
  loadCouncilMembers();
}

// Load on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAboutPage);
} else {
  initAboutPage();
}
