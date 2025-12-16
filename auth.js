// Authentication system for Jake's Street Hockey Association

class AuthManager {
  constructor() {
    this.currentUser = this.loadSession();
    this.adminCredentials = {
      username: 'admin',
      password: 'JSHA2025'
    };
    this.init();
  }
  
  init() {
    this.updateUI();
  }
  
  loadSession() {
    const session = localStorage.getItem('jsha_session');
    return session ? JSON.parse(session) : null;
  }
  
  saveSession(user) {
    localStorage.setItem('jsha_session', JSON.stringify(user));
    this.currentUser = user;
    this.updateUI();
  }
  
  clearSession() {
    localStorage.removeItem('jsha_session');
    this.currentUser = null;
    this.updateUI();
  }
  
  login(username, password) {
    // Check admin credentials
    if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
      this.saveSession({ username, role: 'admin' });
      return { success: true, role: 'admin' };
    }
    
    // Regular user login (any username/password combo works for demo)
    if (username && password) {
      this.saveSession({ username, role: 'user' });
      return { success: true, role: 'user' };
    }
    
    return { success: false, error: 'Invalid credentials' };
  }
  
  logout() {
    this.clearSession();
    window.location.href = '/?page=home';
  }
  
  isLoggedIn() {
    return this.currentUser !== null;
  }
  
  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }
  
  updateUI() {
    // Update user display in top right
    let userDisplay = document.getElementById('user-display');
    if (!userDisplay) {
      // Create user display element if it doesn't exist
      userDisplay = document.createElement('div');
      userDisplay.id = 'user-display';
      userDisplay.style.cssText = 'position: fixed; top: 10px; right: 20px; z-index: 2000; background: white; padding: 0.5rem 1rem; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); display: flex; gap: 1rem; align-items: center;';
      document.body.appendChild(userDisplay);
    }
    
    if (this.isLoggedIn()) {
      const adminCheck = this.isAdmin();
      console.log('User logged in:', this.currentUser.username, 'Is Admin:', adminCheck);
      
      userDisplay.innerHTML = `
        <span style="font-weight: 600; color: #CC0000;">Hi, ${this.currentUser.username}</span>
        ${adminCheck ? '<span style="font-size: 0.75rem; background: #800000; color: white; padding: 0.25rem 0.5rem; border-radius: 3px;">ADMIN</span>' : ''}
        ${adminCheck ? '<a href="/?page=admin" style="padding: 0.25rem 0.75rem; background: #800000; color: white; border: none; border-radius: 4px; text-decoration: none; font-size: 0.85rem; display: inline-block;">Admin Panel</a>' : ''}
        <button onclick="authManager.logout()" style="padding: 0.25rem 0.75rem; background: #CC0000; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">Logout</button>
      `;
    } else {
      userDisplay.innerHTML = `
        <a href="/?page=login" style="padding: 0.25rem 0.75rem; background: #CC0000; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem; text-decoration: none;">Login</a>
      `;
    }
  }
}

// Initialize auth manager globally
const authManager = new AuthManager();

// Update UI when page loads
if (typeof window !== 'undefined') {
  window.authManager = authManager;
  window.addEventListener('load', () => {
    authManager.updateUI();
  });
}
