// Web Components for Jake's Street Hockey Association - Professional Edition

// 1. sh-title - Main title bar component
class ShTitle extends HTMLElement {
  connectedCallback() {
    const text = this.getAttribute('text') || "Jake's Street Hockey Association";
    
    this.innerHTML = `
      <div class="sh-title">
        <h1>${text}</h1>
      </div>
    `;
  }
}

// 2. sh-pagebutton - Top navigation page button component
class ShPageButton extends HTMLElement {
  connectedCallback() {
    const text = this.getAttribute('text') || 'Page';
    const href = this.getAttribute('href') || '#';
    const dropdown = this.getAttribute('dropdown') === 'true';
    const dropdownItems = this.getAttribute('dropdown-items') || '';
    
    this.innerHTML = `
      <div class="sh-pagebutton">
        <a href="${href}" class="pagebutton-link">${text}</a>
        ${dropdown ? `
          <sh-dropdownpagebuttons items="${dropdownItems}"></sh-dropdownpagebuttons>
        ` : ''}
      </div>
    `;
  }
}

// 3. sh-mainbutton - Standard button used throughout pages
class ShMainButton extends HTMLElement {
  connectedCallback() {
    const text = this.getAttribute('text') || 'Click';
    const href = this.getAttribute('href') || '#';
    const onclick = this.getAttribute('onclick') || '';
    
    this.innerHTML = `
      <a href="${href}" class="sh-mainbutton" ${onclick ? `onclick="${onclick}"` : ''}>
        ${text}
      </a>
    `;
  }
}

// 4. sh-register - Darker registration button component
class ShRegister extends HTMLElement {
  connectedCallback() {
    const text = this.getAttribute('text') || 'Register';
    const href = this.getAttribute('href') || '#';
    
    this.innerHTML = `
      <a href="${href}" class="sh-register">
        ${text}
      </a>
    `;
  }
}

// 5. sh-sideinformation - Sidebar information component
class ShSideInformation extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'Information';
    const content = this.getAttribute('content') || '';
    
    this.innerHTML = `
      <aside class="sh-sideinformation">
        <h3>${title}</h3>
        <div class="side-content">${content}</div>
      </aside>
    `;
  }
}

// 6. sh-paragraphcard - Paragraph card component
class ShParagraphCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || '';
    const content = this.getAttribute('content') || '';
    
    this.innerHTML = `
      <div class="sh-paragraphcard">
        ${title ? `<h3>${title}</h3>` : ''}
        <p>${content}</p>
      </div>
    `;
  }
}

// 7. sh-sponser - Sponsor display component
class ShSponser extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || 'Sponsor';
    const logo = this.getAttribute('logo') || '';
    
    this.innerHTML = `
      <div class="sh-sponser">
        ${logo ? `<img src="${logo}" alt="${name}">` : `<span>${name}</span>`}
      </div>
    `;
  }
}

// 8. sh-dropdownpagebuttons - Dropdown menu that appears on hover
class ShDropdownPageButtons extends HTMLElement {
  connectedCallback() {
    const items = this.getAttribute('items') || '';
    const itemsArray = items.split('|').map(item => {
      const [text, href] = item.split(',');
      return { text, href };
    });
    
    this.innerHTML = `
      <div class="sh-dropdownpagebuttons">
        ${itemsArray.map(item => `
          <a href="${item.href}" class="dropdown-item">${item.text}</a>
        `).join('')}
      </div>
    `;
  }
}

// 9. sh-onscreenpage - Sidebar navigation showing current page
class ShOnScreenPage extends HTMLElement {
  connectedCallback() {
    const items = this.getAttribute('items') || '';
    const itemsArray = items.split('|').map(item => {
      const [text, href] = item.split(',');
      return { text, href };
    });
    
    const params = new URLSearchParams(window.location.search);
    const currentPage = params.get('page') || 'home';
    
    this.innerHTML = `
      <nav class="sh-onscreenpage">
        ${itemsArray.map(item => {
          const isActive = item.href.includes(currentPage);
          return `<a href="${item.href}" class="${isActive ? 'active' : ''}">${item.text}</a>`;
        }).join('')}
      </nav>
    `;
  }
}

// 10. sh-cardgrid - 3x3 grid for cards with pictures or text
class ShCardGrid extends HTMLElement {
  async connectedCallback() {
    const type = this.getAttribute('type') || 'text';
    const apiEndpoint = this.getAttribute('api') || '';
    
    if (apiEndpoint) {
      this.innerHTML = '<div class="loading">Loading...</div>';
      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        this.renderGrid(data, type);
      } catch (error) {
        this.innerHTML = '<div class="error">Failed to load content</div>';
      }
    } else {
      this.renderGrid([], type);
    }
  }
  
  renderGrid(data, type) {
    let items = [];
    
    // Handle different data structures
    if (type === 'stats' && data.summary) {
      items = data.summary.slice(0, 9);
    } else if (type === 'game' && data.games) {
      // For schedule.json, get upcoming games
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      items = data.games.filter(game => new Date(game.date) >= today).slice(0, 9);
    } else if (Array.isArray(data)) {
      items = data.slice(0, 9);
    } else {
      items = [];
    }
    
    this.innerHTML = `
      <div class="sh-cardgrid">
        ${items.map(item => {
          if (type === 'photo') {
            return `
              <div class="grid-card photo-card" data-photo-url="${item.url}" data-caption="${item.caption || ''}">
                <img src="${item.url}" alt="${item.caption || ''}">
                <div class="card-overlay">
                  <p>${item.caption || ''}</p>
                </div>
              </div>
            `;
          } else if (type === 'game') {
            const gameDate = new Date(item.date);
            const formattedDate = gameDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            return `
              <div class="grid-card game-card">
                <div class="card-date">${formattedDate}</div>
                <div class="card-teams">${item.home} vs ${item.away}</div>
                <div class="card-time">${item.time}</div>
              </div>
            `;
          } else if (type === 'stats') {
            return `
              <div class="grid-card stats-card">
                <div class="card-value">${item.value}</div>
                <div class="card-label">${item.label}</div>
              </div>
            `;
          } else {
            return `
              <div class="grid-card text-card">
                <h4>${item.title || item.name || ''}</h4>
                <p>${item.content || item.caption || item.description || ''}</p>
              </div>
            `;
          }
        }).join('')}
      </div>
    `;
    
    // Add click handlers for photo cards
    if (type === 'photo') {
      this.querySelectorAll('.photo-card').forEach(card => {
        card.addEventListener('click', () => {
          const url = card.dataset.photoUrl;
          const caption = card.dataset.caption;
          this.openPhotoModal(url, caption);
        });
      });
    }
  }
  
  openPhotoModal(url, caption) {
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.innerHTML = `
      <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
      <div class="modal-content">
        <button class="modal-close" onclick="this.closest('.photo-modal').remove()">&times;</button>
        <img src="${url}" alt="${caption}">
        <p style="color:white;text-align:center;margin-top:1rem;">${caption}</p>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

// Register all custom elements
customElements.define('sh-title', ShTitle);
customElements.define('sh-pagebutton', ShPageButton);
customElements.define('sh-mainbutton', ShMainButton);
customElements.define('sh-register', ShRegister);
customElements.define('sh-sideinformation', ShSideInformation);
customElements.define('sh-paragraphcard', ShParagraphCard);
customElements.define('sh-sponser', ShSponser);
customElements.define('sh-dropdownpagebuttons', ShDropdownPageButtons);
customElements.define('sh-onscreenpage', ShOnScreenPage);
customElements.define('sh-cardgrid', ShCardGrid);
