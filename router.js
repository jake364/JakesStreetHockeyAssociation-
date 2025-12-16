// Client-side routing for Jake's Street Hockey Association - Professional Edition

class Router {
  constructor() {
    this.routes = {
      'home': this.renderHomePage,
      'schedule': this.renderSchedulePage,
      'photos': this.renderPhotosPage,
      'history': this.renderHistory2025Page,
      'history-2025': this.renderHistory2025Page,
      'history-2024': this.renderHistory2024Page,
      'history-2023': this.renderHistory2023Page,
      'history-2022': this.renderHistory2022Page,
      'stats': this.renderStatsPage,
      'stats-teams': this.renderTeamStatsPage,
      'stats-players': this.renderPlayerStatsPage,
      'stats-goalies': this.renderGoalieStatsPage,
      'register': this.renderRegisterPage,
      'login': this.renderLoginPage,
      'admin': this.renderAdminPage,
      'admin-upload': this.renderAdminPage,
      'story': this.renderStoryPage,
      'staff': this.renderStaffPage,
      'contact': this.renderContactPage,
      // Teams landing and pages
      'teams': this.renderTeamsPage,
      'team-thunder': this.renderTeamThunderPage,
      'team-ice': this.renderTeamIcePage,
      'team-kings': this.renderTeamKingsPage,
      'team-masters': this.renderTeamMastersPage,
      'team-rangers': this.renderTeamRangersPage,
      'team-devils': this.renderTeamDevilsPage,
      'team-hawks': this.renderTeamHawksPage,
      'team-blades': this.renderTeamBladesPage,
      // Team sub-pages
      'team-thunder-stats': this.renderTeamPageStats,
      'team-thunder-players': this.renderTeamPagePlayers,
      'team-thunder-schedule': this.renderTeamPageSchedule,
      'team-ice-stats': this.renderTeamPageStats,
      'team-ice-players': this.renderTeamPagePlayers,
      'team-ice-schedule': this.renderTeamPageSchedule,
      'team-kings-stats': this.renderTeamPageStats,
      'team-kings-players': this.renderTeamPagePlayers,
      'team-kings-schedule': this.renderTeamPageSchedule,
      'team-masters-stats': this.renderTeamPageStats,
      'team-masters-players': this.renderTeamPagePlayers,
      'team-masters-schedule': this.renderTeamPageSchedule,
      'team-rangers-stats': this.renderTeamPageStats,
      'team-rangers-players': this.renderTeamPagePlayers,
      'team-rangers-schedule': this.renderTeamPageSchedule,
      'team-devils-stats': this.renderTeamPageStats,
      'team-devils-players': this.renderTeamPagePlayers,
      'team-devils-schedule': this.renderTeamPageSchedule,
      'team-hawks-stats': this.renderTeamPageStats,
      'team-hawks-players': this.renderTeamPagePlayers,
      'team-hawks-schedule': this.renderTeamPageSchedule,
      'team-blades-stats': this.renderTeamPageStats,
      'team-blades-players': this.renderTeamPagePlayers,
      'team-blades-schedule': this.renderTeamPageSchedule,
      // Fallback pages
      'about': this.renderStoryPage,
      'team': this.renderStaffPage,
      'results': this.renderStatsPage,
      'standings': this.renderStatsPage,
      'calendar': this.renderSchedulePage,
      'videos': this.renderHistory2025Page,
      'highlights': this.renderHistory2025Page,
      'leaders': this.renderPlayerStatsPage,
      'records': this.renderPlayerStatsPage
    };
    
    this.currentMonth = 11; // December (0-indexed)
    this.currentYear = 2025;
    this.playersData = null;
    this.scheduleData = null;
    this.init();
  }
  
  async loadPlayersData() {
    if (!this.playersData) {
      try {
        const response = await fetch('/api/players.json');
        this.playersData = await response.json();
      } catch (error) {
        console.error('Failed to load players data:', error);
        this.playersData = { teams: [] };
      }
    }
    return this.playersData;
  }
  
  async loadScheduleData() {
    if (!this.scheduleData) {
      try {
        const response = await fetch('/api/schedule');
        this.scheduleData = await response.json();
      } catch (error) {
        console.error('Failed to load schedule data:', error);
        this.scheduleData = { games: [], practiceSlots: {} };
      }
    }
    return this.scheduleData;
  }

  init() {
    window.addEventListener('load', () => this.route());
    window.addEventListener('popstate', () => this.route());
    
    // Handle link clicks for SPA navigation
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="/?page="]') || e.target.closest('a[href^="/?page="]')) {
        const link = e.target.matches('a') ? e.target : e.target.closest('a');
        e.preventDefault();
        const url = new URL(link.href);
        window.history.pushState({}, '', url);
        this.route();
      }
    });
  }

  route() {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || 'home';
    
    const handler = this.routes[page] || this.routes['home'];
    handler.call(this);
  }

  renderHomePage() {
    const template = document.getElementById('home-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }

  renderSchedulePage() {
    const template = document.getElementById('schedule-page');
    const content = template.content.cloneNode(true);
    this.render(content);
    
    // Setup calendar after rendering
    setTimeout(() => this.setupCalendar(), 100);
  }
  
  setupCalendar() {
    this.loadScheduleData().then(() => {
      const prevBtn = document.getElementById('prevMonth');
      const nextBtn = document.getElementById('nextMonth');
      const calendarView = document.getElementById('calendarView');
      
      if (!calendarView) return;
      
      const renderMonth = () => {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                            'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('currentMonth').textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        
        // Build schedule from games and practices
        const schedule = {};
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        
        // Add games from schedule data
        if (this.scheduleData && this.scheduleData.games) {
          this.scheduleData.games.forEach(game => {
            const gameDate = new Date(game.date);
            if (gameDate.getMonth() === this.currentMonth && gameDate.getFullYear() === this.currentYear) {
              const dateStr = game.date;
              if (!schedule[dateStr]) schedule[dateStr] = [];
              schedule[dateStr].push({
                type: 'game',
                opponent: `${game.home} vs ${game.away}`,
                time: game.time
              });
            }
          });
        }
        
        // Add practices from practice slots (only on weekdays without games)
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(this.currentYear, this.currentMonth, day);
          const dayOfWeek = date.getDay();
          const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
          
          // Only add practice if it's a weekday (Mon-Fri) and no game scheduled
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const hasGame = schedule[dateStr] && schedule[dateStr].some(e => e.type === 'game');
            if (!hasGame && this.scheduleData.practiceSlots && this.scheduleData.practiceSlots[dayName]) {
              this.scheduleData.practiceSlots[dayName].forEach(slot => {
                if (!schedule[dateStr]) schedule[dateStr] = [];
                schedule[dateStr].push({ 
                  type: 'practice',
                  team: slot.team,
                  time: slot.time
                });
              });
            }
          }
        }
        
        // Calendar starts on Saturday
        // JavaScript day: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
        // Calendar columns: Sat=0, Sun=1, Mon=2, Tue=3, Wed=4, Thu=5, Fri=6
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        const adjustedFirstDay = (firstDay + 1) % 7;
        
        let html = '<table style="width:100%;border-collapse:collapse;">';
        html += '<thead><tr style="background:#CC0000;color:white;">';
        html += '<th style="padding:0.75rem;">Sat</th><th style="padding:0.75rem;">Sun</th><th style="padding:0.75rem;">Mon</th><th style="padding:0.75rem;">Tue</th><th style="padding:0.75rem;">Wed</th><th style="padding:0.75rem;">Thu</th><th style="padding:0.75rem;">Fri</th>';
        html += '</tr></thead><tbody><tr>';
        
        // Empty cells before first day
        for (let i = 0; i < adjustedFirstDay; i++) {
          html += '<td style="padding:0.75rem;border:1px solid #ddd;background:#f9f9f9;height:100px;"></td>';
        }
        
        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
          if ((adjustedFirstDay + day - 1) % 7 === 0 && day > 1) {
            html += '</tr><tr>';
          }
          
          const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const events = schedule[dateStr] || [];
          
          html += `<td data-date="${dateStr}" style="padding:0.75rem;border:1px solid #ddd;vertical-align:top;height:100px;${events.length > 0 ? 'background:#ffe6e6;cursor:pointer;' : 'cursor:pointer;'}transition:background 0.2s;" onmouseover="this.style.background='${events.length > 0 ? '#ffd4d4' : '#f5f5f5'}'" onmouseout="this.style.background='${events.length > 0 ? '#ffe6e6' : 'white'}'" onclick="window.appRouter.showDatePopup('${dateStr}', ${JSON.stringify(events).replace(/"/g, '&quot;')})">`;
          html += `<strong>${day}</strong>`;
          if (events.length > 0) {
            events.forEach(event => {
              if (event.type === 'game') {
                html += `<div style="font-size:0.75rem;margin-top:0.25rem;color:#CC0000;font-weight:600;">GAME</div>`;
                html += `<div style="font-size:0.7rem;color:#000;">${event.opponent}</div>`;
                html += `<div style="font-size:0.7rem;color:#666;">${event.time}</div>`;
              } else {
                html += `<div style="font-size:0.7rem;margin-top:0.25rem;color:#666;">${event.team}</div>`;
                html += `<div style="font-size:0.65rem;color:#999;">Practice ${event.time}</div>`;
              }
            });
          }
          html += '</td>';
        }
        
        // Fill remaining cells
        const totalCells = adjustedFirstDay + daysInMonth;
        const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 0; i < remainingCells; i++) {
          html += '<td style="padding:0.75rem;border:1px solid #ddd;background:#f9f9f9;height:100px;"></td>';
        }
        
        html += '</tr></tbody></table>';
        calendarView.innerHTML = html;
      };
    
      if (prevBtn) {
        prevBtn.onclick = () => {
          this.currentMonth--;
          if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
          }
          renderMonth();
        };
      }
      
      if (nextBtn) {
        nextBtn.onclick = () => {
          this.currentMonth++;
          if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
          }
          renderMonth();
        };
      }
      
      renderMonth();
    }).catch(error => {
      console.error('Failed to load schedule for calendar:', error);
      const calendarView = document.getElementById('calendarView');
      if (calendarView) {
        calendarView.innerHTML = '<p style="text-align:center;color:#CC0000;padding:2rem;">Error loading schedule data</p>';
      }
    });
  }

  renderPhotosPage() {
    const template = document.getElementById('photos-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }

  async renderStatsPage() {
    const template = document.getElementById('stats-page');
    const content = template.content.cloneNode(true);
    this.render(content);
    
    // Load player data and calculate standings
    await this.loadPlayersData();
    
    const statsContent = document.getElementById('stats-content');
    if (statsContent && this.playersData) {
      // Sort teams by wins (descending), then by win percentage
      const sortedTeams = [...this.playersData.teams].sort((a, b) => {
        if (b.record.wins !== a.record.wins) {
          return b.record.wins - a.record.wins;
        }
        const aWinPct = a.record.wins / (a.record.wins + a.record.losses);
        const bWinPct = b.record.wins / (b.record.wins + b.record.losses);
        return bWinPct - aWinPct;
      });
      
      const standingsRows = sortedTeams.map((team, index) => {
        const goalsFor = team.players.reduce((sum, p) => sum + p.goals, 0);
        const goalsAgainst = team.goalie.goalsAgainst;
        const gamesPlayed = team.record.wins + team.record.losses;
        const points = (team.record.wins * 2) + 0; // 2 points per win
        const winPct = ((team.record.wins / gamesPlayed) * 100).toFixed(1);
        
        return `
          <tr style='${index % 2 === 0 ? 'background:#f9f9f9;' : 'background:white;'}border-bottom:1px solid #ddd;'>
            <td style='padding:1rem;font-weight:700;color:#CC0000;'>${index + 1}</td>
            <td style='padding:1rem;font-weight:600;'>${team.name}</td>
            <td style='padding:1rem;text-align:center;font-weight:600;'>${gamesPlayed}</td>
            <td style='padding:1rem;text-align:center;color:#006400;font-weight:600;'>${team.record.wins}</td>
            <td style='padding:1rem;text-align:center;color:#8B0000;'>${team.record.losses}</td>
            <td style='padding:1rem;text-align:center;'>${goalsFor}</td>
            <td style='padding:1rem;text-align:center;'>${goalsAgainst}</td>
            <td style='padding:1rem;text-align:center;font-weight:600;'>${goalsFor - goalsAgainst > 0 ? '+' : ''}${goalsFor - goalsAgainst}</td>
            <td style='padding:1rem;text-align:center;font-weight:700;color:#CC0000;'>${points}</td>
            <td style='padding:1rem;text-align:center;'>${winPct}%</td>
          </tr>
        `;
      }).join('');
      
      statsContent.innerHTML = `
        <div style='overflow-x:auto;'>
          <table style='width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.15);'>
            <thead>
              <tr style='background:#CC0000;color:white;'>
                <th style='padding:1rem;text-align:center;width:50px;'>#</th>
                <th style='padding:1rem;text-align:left;'>Team</th>
                <th style='padding:1rem;text-align:center;'>GP</th>
                <th style='padding:1rem;text-align:center;'>W</th>
                <th style='padding:1rem;text-align:center;'>L</th>
                <th style='padding:1rem;text-align:center;'>GF</th>
                <th style='padding:1rem;text-align:center;'>GA</th>
                <th style='padding:1rem;text-align:center;'>DIFF</th>
                <th style='padding:1rem;text-align:center;'>PTS</th>
                <th style='padding:1rem;text-align:center;'>WIN%</th>
              </tr>
            </thead>
            <tbody>
              ${standingsRows}
            </tbody>
          </table>
        </div>
      `;
    }
  }

  renderRegisterPage() {
    const template = document.getElementById('register-page');
    const content = template.content.cloneNode(true);
    this.render(content);
    
    // Setup registration form handler with validation
    setTimeout(() => {
      const form = document.getElementById('registrationForm');
      const submitBtn = document.getElementById('submitRegBtn');
      
      if (form && submitBtn) {
        const handleSubmit = (e) => {
          e.preventDefault();
          
          const name = document.getElementById('regName').value.trim();
          const email = document.getElementById('regEmail').value.trim();
          const phone = document.getElementById('regPhone').value.trim();
          const skill = document.getElementById('regSkill').value;
          
          // Validation
          if (!name) {
            alert('Please enter your full name');
            return;
          }
          if (!email || !email.includes('@')) {
            alert('Please enter a valid email address');
            return;
          }
          if (!phone) {
            alert('Please enter your phone number');
            return;
          }
          if (!skill) {
            alert('Please select a skill level');
            return;
          }
          
          // Show popup and redirect to home
          this.showRegistrationPopup();
        };
        
        submitBtn.addEventListener('click', handleSubmit);
        form.addEventListener('submit', handleSubmit);
      }
    }, 100);
  }
  
  showRegistrationPopup() {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:10000;';
    
    const popup = document.createElement('div');
    popup.style.cssText = 'background:white;padding:3rem;border-radius:8px;text-align:center;max-width:400px;box-shadow:0 8px 16px rgba(0,0,0,0.3);';
    popup.innerHTML = `
      <div style="font-size:4rem;color:#CC0000;margin-bottom:1rem;">✓</div>
      <h2 style="color:#000;margin-bottom:1rem;">Registration Complete!</h2>
      <p style="color:#666;margin-bottom:2rem;">Thank you for registering. We'll contact you soon with more information.</p>
      <button id="popupCloseBtn" style="background:#CC0000;color:white;border:none;padding:0.75rem 2rem;border-radius:4px;font-size:1rem;cursor:pointer;font-weight:600;">Continue</button>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    document.getElementById('popupCloseBtn').addEventListener('click', () => {
      document.body.removeChild(overlay);
      window.location.href = '/?page=home';
    });
  }

  renderAdminPage() {
    // Check if user is logged in as admin
    if (typeof window.authManager !== 'undefined' && !window.authManager.isAdmin()) {
      window.location.href = '/?page=login';
      return;
    }
    
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="mt-3 mb-3">
            <h1 class="text-center">Admin Dashboard</h1>
            
            <div style="max-width: 1200px; margin: 2rem auto;">
              <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); margin-bottom: 2rem;">
                <h2 style="color: #CC0000; margin-bottom: 1.5rem;">Upload Game Results</h2>
                <p style="margin-bottom: 1.5rem;">Enter complete game details including goals, assists, and penalties after each game.</p>
                
                <!-- Team Selection -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 2px solid #eee;">
                  <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Home Team</label>
                    <select id="game-home-team" style="width: 100%; padding: 0.75rem; border: 2px solid #ccc; border-radius: 4px; font-size: 1rem;">
                      <option value="">Select Team...</option>
                      <option value="Thunder Strikers">Thunder Strikers</option>
                      <option value="Ice Warriors">Ice Warriors</option>
                      <option value="Street Kings">Street Kings</option>
                      <option value="Puck Masters">Puck Masters</option>
                      <option value="Rangers">Rangers</option>
                      <option value="Devils">Devils</option>
                      <option value="Hawks">Hawks</option>
                      <option value="Blades">Blades</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Away Team</label>
                    <select id="game-away-team" style="width: 100%; padding: 0.75rem; border: 2px solid #ccc; border-radius: 4px; font-size: 1rem;">
                      <option value="">Select Team...</option>
                      <option value="Thunder Strikers">Thunder Strikers</option>
                      <option value="Ice Warriors">Ice Warriors</option>
                      <option value="Street Kings">Street Kings</option>
                      <option value="Puck Masters">Puck Masters</option>
                      <option value="Rangers">Rangers</option>
                      <option value="Devils">Devils</option>
                      <option value="Hawks">Hawks</option>
                      <option value="Blades">Blades</option>
                    </select>
                  </div>
                </div>
                
                <!-- Goals Section -->
                <div style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 2px solid #eee;">
                  <h3 style="color: #CC0000; margin-bottom: 1rem;">🏒 Goals Scored</h3>
                  <div id="goals-container" style="margin-bottom: 1rem;">
                    <!-- Goals will be added dynamically -->
                  </div>
                  <button id="add-goal-btn" style="padding: 0.75rem 1.5rem; background: #28a745; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">
                    + Add Goal
                  </button>
                </div>
                
                <!-- Penalties Section -->
                <div style="margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 2px solid #eee;">
                  <h3 style="color: #800000; margin-bottom: 1rem;">⚠️ Penalties</h3>
                  <div id="penalties-container" style="margin-bottom: 1rem;">
                    <!-- Penalties will be added dynamically -->
                  </div>
                  <button id="add-penalty-btn" style="padding: 0.75rem 1.5rem; background: #ffc107; color: #000; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">
                    + Add Penalty
                  </button>
                </div>
                
                <!-- Submit Button -->
                <button id="submit-game-btn" style="width: 100%; padding: 1.25rem; background: #CC0000; color: white; border: none; border-radius: 4px; font-size: 1.2rem; font-weight: 600; cursor: pointer;">
                  📊 Upload Game Results
                </button>
              </div>
              
              <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                <h2 style="color: #CC0000; margin-bottom: 1.5rem;">Quick Actions</h2>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                  <button onclick="window.location.href='/?page=stats'" style="padding: 1rem; background: #666; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">
                    View Standings
                  </button>
                  <button onclick="window.location.href='/?page=schedule'" style="padding: 1rem; background: #666; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">
                    View Schedule
                  </button>
                  <button onclick="alert('Feature coming soon!')" style="padding: 1rem; background: #666; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    this.render(content);
    
    // Setup admin functionality after rendering
    setTimeout(() => this.setupAdminFunctions(), 100);
  }
  
  setupAdminFunctions() {
    const homeTeamSelect = document.getElementById('game-home-team');
    const awayTeamSelect = document.getElementById('game-away-team');
    const addGoalBtn = document.getElementById('add-goal-btn');
    const addPenaltyBtn = document.getElementById('add-penalty-btn');
    const submitGameBtn = document.getElementById('submit-game-btn');
    const goalsContainer = document.getElementById('goals-container');
    const penaltiesContainer = document.getElementById('penalties-container');
    
    let goalCounter = 0;
    let penaltyCounter = 0;
    const goals = [];
    const penalties = [];
    
    // Load player data
    this.loadPlayersData();
    
    // Prevent selecting same team for home and away
    if (homeTeamSelect && awayTeamSelect) {
      homeTeamSelect.addEventListener('change', () => {
        const homeTeam = homeTeamSelect.value;
        Array.from(awayTeamSelect.options).forEach(option => {
          if (option.value === homeTeam) {
            option.disabled = true;
          } else {
            option.disabled = false;
          }
        });
      });
      
      awayTeamSelect.addEventListener('change', () => {
        const awayTeam = awayTeamSelect.value;
        Array.from(homeTeamSelect.options).forEach(option => {
          if (option.value === awayTeam) {
            option.disabled = true;
          } else {
            option.disabled = false;
          }
        });
      });
    }
    
    // Add Goal button
    if (addGoalBtn) {
      addGoalBtn.addEventListener('click', async () => {
        const homeTeam = homeTeamSelect.value;
        const awayTeam = awayTeamSelect.value;
        
        if (!homeTeam || !awayTeam) {
          alert('Please select both teams first');
          return;
        }
        
        if (homeTeam === awayTeam) {
          alert('Home and away teams must be different');
          return;
        }
        
        await this.loadPlayersData();
        const goalId = goalCounter++;
        const goalDiv = document.createElement('div');
        goalDiv.id = `goal-${goalId}`;
        goalDiv.style.cssText = 'background:#f8f9fa;padding:1rem;border-radius:4px;margin-bottom:0.75rem;border-left:4px solid #28a745;';
        
        goalDiv.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
            <strong style="color:#28a745;">Goal #${goalId + 1}</strong>
            <button onclick="document.getElementById('goal-${goalId}').remove()" style="background:#dc3545;color:white;border:none;border-radius:4px;padding:0.5rem 1rem;cursor:pointer;">Remove</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;margin-bottom:0.75rem;">
            <div>
              <label style="display:block;margin-bottom:0.25rem;font-size:0.9rem;font-weight:600;">Scoring Team</label>
              <select id="goal-${goalId}-team" style="width:100%;padding:0.5rem;border:2px solid #ccc;border-radius:4px;">
                <option value="">Select...</option>
                <option value="${homeTeam}">${homeTeam}</option>
                <option value="${awayTeam}">${awayTeam}</option>
              </select>
            </div>
            <div>
              <label style="display:block;margin-bottom:0.25rem;font-size:0.9rem;font-weight:600;">Scorer</label>
              <select id="goal-${goalId}-scorer" style="width:100%;padding:0.5rem;border:2px solid #ccc;border-radius:4px;">
                <option value="">Select team first...</option>
              </select>
            </div>
            <div>
              <label style="display:block;margin-bottom:0.25rem;font-size:0.9rem;font-weight:600;">Assist 1 (Optional)</label>
              <select id="goal-${goalId}-assist1" style="width:100%;padding:0.5rem;border:2px solid #ccc;border-radius:4px;">
                <option value="">None</option>
              </select>
            </div>
            <div>
              <label style="display:block;margin-bottom:0.25rem;font-size:0.9rem;font-weight:600;">Assist 2 (Optional)</label>
              <select id="goal-${goalId}-assist2" style="width:100%;padding:0.5rem;border:2px solid #ccc;border-radius:4px;">
                <option value="">None</option>
              </select>
            </div>
          </div>
          <div style="display:flex;gap:1.5rem;">
            <label style="display:inline-flex;align-items:center;cursor:pointer;">
              <input type="checkbox" id="goal-${goalId}-pp" style="margin-right:0.5rem;width:18px;height:18px;cursor:pointer;">
              <span style="font-size:0.9rem;">Power Play Goal</span>
            </label>
            <label style="display:inline-flex;align-items:center;cursor:pointer;">
              <input type="checkbox" id="goal-${goalId}-en" style="margin-right:0.5rem;width:18px;height:18px;cursor:pointer;">
              <span style="font-size:0.9rem;">Empty Net (Doesn't count for goalie)</span>
            </label>
          </div>
        `;
        
        goalsContainer.appendChild(goalDiv);
        goals.push(goalId);
        
        // Setup team change handler
        const teamSelect = document.getElementById(`goal-${goalId}-team`);
        const scorerSelect = document.getElementById(`goal-${goalId}-scorer`);
        const assist1Select = document.getElementById(`goal-${goalId}-assist1`);
        const assist2Select = document.getElementById(`goal-${goalId}-assist2`);
        
        teamSelect.addEventListener('change', async () => {
          const selectedTeam = teamSelect.value;
          if (!selectedTeam) return;
          
          await this.loadPlayersData();
          const team = this.playersData.teams.find(t => t.name === selectedTeam);
          
          if (team) {
            scorerSelect.innerHTML = '<option value="">Select...</option>';
            assist1Select.innerHTML = '<option value="">None</option>';
            assist2Select.innerHTML = '<option value="">None</option>';
            
            team.players.forEach((player, idx) => {
              scorerSelect.innerHTML += `<option value="${idx}">${player.name}</option>`;
              assist1Select.innerHTML += `<option value="${idx}">${player.name}</option>`;
              assist2Select.innerHTML += `<option value="${idx}">${player.name}</option>`;
            });
          }
        });
        
        // Prevent selecting same player for scorer and assists
        const updateAssistOptions = () => {
          const scorerIdx = scorerSelect.value;
          const assist1Idx = assist1Select.value;
          const assist2Idx = assist2Select.value;
          
          Array.from(assist1Select.options).forEach(option => {
            option.disabled = (option.value === scorerIdx && scorerIdx !== '') || (option.value === assist2Idx && assist2Idx !== '');
          });
          
          Array.from(assist2Select.options).forEach(option => {
            option.disabled = (option.value === scorerIdx && scorerIdx !== '') || (option.value === assist1Idx && assist1Idx !== '');
          });
          
          Array.from(scorerSelect.options).forEach(option => {
            option.disabled = (option.value === assist1Idx && assist1Idx !== '') || (option.value === assist2Idx && assist2Idx !== '');
          });
        };
        
        scorerSelect.addEventListener('change', updateAssistOptions);
        assist1Select.addEventListener('change', updateAssistOptions);
        assist2Select.addEventListener('change', updateAssistOptions);
      });
    }
    
    // Add Penalty button
    if (addPenaltyBtn) {
      addPenaltyBtn.addEventListener('click', async () => {
        const homeTeam = homeTeamSelect.value;
        const awayTeam = awayTeamSelect.value;
        
        if (!homeTeam || !awayTeam) {
          alert('Please select both teams first');
          return;
        }
        
        await this.loadPlayersData();
        const penaltyId = penaltyCounter++;
        const penaltyDiv = document.createElement('div');
        penaltyDiv.id = `penalty-${penaltyId}`;
        penaltyDiv.style.cssText = 'background:#fff3cd;padding:1rem;border-radius:4px;margin-bottom:0.75rem;border-left:4px solid #ffc107;';
        
        penaltyDiv.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
            <strong style="color:#856404;">Penalty #${penaltyId + 1}</strong>
            <button onclick="document.getElementById('penalty-${penaltyId}').remove()" style="background:#dc3545;color:white;border:none;border-radius:4px;padding:0.5rem 1rem;cursor:pointer;">Remove</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;">
            <div>
              <label style="display:block;margin-bottom:0.25rem;font-size:0.9rem;font-weight:600;">Team</label>
              <select id="penalty-${penaltyId}-team" style="width:100%;padding:0.5rem;border:2px solid #ccc;border-radius:4px;">
                <option value="">Select...</option>
                <option value="${homeTeam}">${homeTeam}</option>
                <option value="${awayTeam}">${awayTeam}</option>
              </select>
            </div>
            <div>
              <label style="display:block;margin-bottom:0.25rem;font-size:0.9rem;font-weight:600;">Player</label>
              <select id="penalty-${penaltyId}-player" style="width:100%;padding:0.5rem;border:2px solid #ccc;border-radius:4px;">
                <option value="">Select team first...</option>
              </select>
            </div>
            <div>
              <label style="display:block;margin-bottom:0.25rem;font-size:0.9rem;font-weight:600;">Minutes</label>
              <select id="penalty-${penaltyId}-minutes" style="width:100%;padding:0.5rem;border:2px solid #ccc;border-radius:4px;">
                <option value="2">2 minutes</option>
                <option value="4">4 minutes</option>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
              </select>
            </div>
          </div>
        `;
        
        penaltiesContainer.appendChild(penaltyDiv);
        penalties.push(penaltyId);
        
        // Setup team change handler
        const teamSelect = document.getElementById(`penalty-${penaltyId}-team`);
        const playerSelect = document.getElementById(`penalty-${penaltyId}-player`);
        
        teamSelect.addEventListener('change', async () => {
          const selectedTeam = teamSelect.value;
          if (!selectedTeam) return;
          
          await this.loadPlayersData();
          const team = this.playersData.teams.find(t => t.name === selectedTeam);
          
          if (team) {
            playerSelect.innerHTML = '<option value="">Select...</option>';
            team.players.forEach((player, idx) => {
              playerSelect.innerHTML += `<option value="${idx}">${player.name}</option>`;
            });
          }
        });
      });
    }
    
    // Submit Game button
    if (submitGameBtn) {
      submitGameBtn.addEventListener('click', async () => {
        const homeTeam = homeTeamSelect.value;
        const awayTeam = awayTeamSelect.value;
        
        if (!homeTeam || !awayTeam) {
          alert('Please select both teams');
          return;
        }
        
        // Collect all goals
        let summary = `GAME RESULTS\\n`;
        summary += `${homeTeam} vs ${awayTeam}\\n\\n`;
        summary += `GOALS:\\n`;
        
        let homeScore = 0;
        let awayScore = 0;
        
        goals.forEach(goalId => {
          const goalDiv = document.getElementById(`goal-${goalId}`);
          if (!goalDiv) return;
          
          const team = document.getElementById(`goal-${goalId}-team`)?.value;
          const scorerIdx = document.getElementById(`goal-${goalId}-scorer`)?.value;
          const assistIdx = document.getElementById(`goal-${goalId}-assist`)?.value;
          const isPP = document.getElementById(`goal-${goalId}-pp`)?.checked;
          
          if (team && scorerIdx !== '') {
            const teamData = this.playersData.teams.find(t => t.name === team);
            const scorer = teamData.players[scorerIdx];
            summary += `- ${scorer.name} (${team})`;
            
            if (assistIdx !== '') {
              const assist = teamData.players[assistIdx];
              summary += ` assisted by ${assist.name}`;
            }
            
            if (isPP) {
              summary += ` [PP]`;
            }
            summary += `\\n`;
            
            if (team === homeTeam) homeScore++;
            else awayScore++;
          }
        });
        
        summary += `\\nFinal Score: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}\\n\\n`;
        summary += `PENALTIES:\\n`;
        
        penalties.forEach(penaltyId => {
          const penaltyDiv = document.getElementById(`penalty-${penaltyId}`);
          if (!penaltyDiv) return;
          
          const team = document.getElementById(`penalty-${penaltyId}-team`)?.value;
          const playerIdx = document.getElementById(`penalty-${penaltyId}-player`)?.value;
          const minutes = document.getElementById(`penalty-${penaltyId}-minutes`)?.value;
          
          if (team && playerIdx !== '') {
            const teamData = this.playersData.teams.find(t => t.name === team);
            const player = teamData.players[playerIdx];
            summary += `- ${player.name} (${team}): ${minutes} min\\n`;
          }
        });
        
        summary += `\\nNote: This is a demo. In production, this would update the database with all stats including power play effectiveness tracking.`;
        alert(summary);
        
        // Reset form
        goalsContainer.innerHTML = '';
        penaltiesContainer.innerHTML = '';
        goals.length = 0;
        penalties.length = 0;
        goalCounter = 0;
        penaltyCounter = 0;
        homeTeamSelect.selectedIndex = 0;
        awayTeamSelect.selectedIndex = 0;
      });
    }
  }
  
  renderAboutPage() {
    const template = document.getElementById('home-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderStoryPage() {
    const template = document.getElementById('story-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderStaffPage() {
    const template = document.getElementById('staff-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderContactPage() {
    const template = document.getElementById('contact-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderLoginPage() {
    const template = document.getElementById('login-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderHistory2025Page() {
    const template = document.getElementById('history-2025-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderHistory2024Page() {
    const template = document.getElementById('history-2024-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderHistory2023Page() {
    const template = document.getElementById('history-2023-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderHistory2022Page() {
    const template = document.getElementById('history-2022-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderTeamThunderPage() {
    const template = document.getElementById('team-thunder-page');
    const content = template.content.cloneNode(true);
    this.render(content);
    setTimeout(() => this.populateTeamThisWeek('Thunder Strikers', 'thunder-this-week'), 100);
  }
  
  renderTeamIcePage() {
    const template = document.getElementById('team-ice-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderTeamKingsPage() {
    const template = document.getElementById('team-kings-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderTeamMastersPage() {
    const template = document.getElementById('team-masters-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderTeamsPage() {
    const template = document.getElementById('teams-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderTeamRangersPage() {
    const template = document.getElementById('team-rangers-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderTeamDevilsPage() {
    const template = document.getElementById('team-devils-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderTeamHawksPage() {
    const template = document.getElementById('team-hawks-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  renderTeamBladesPage() {
    const template = document.getElementById('team-blades-page');
    const content = template.content.cloneNode(true);
    this.render(content);
  }
  
  async renderTeamPageStats() {
    // Load team stats from database
    await this.loadPlayersData();
    await this.loadScheduleData();
    
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || '';
    const teamId = page.split('-')[1];
    
    const team = this.playersData.teams.find(t => t.id === teamId);
    if (!team) {
      this.renderTeamPageStatsGeneric();
      return;
    }
    
    // Calculate team stats from player data
    const totalGoals = team.players.reduce((sum, p) => sum + p.goals, 0);
    const totalAssists = team.players.reduce((sum, p) => sum + p.assists, 0);
    const goalsAgainst = team.goalie.goalsAgainst;
    
    // Get this week's games and practices
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    
    const thisWeekGames = this.scheduleData.games.filter(game => {
      const gameDate = new Date(game.date);
      return (game.home === team.name || game.away === team.name) &&
             gameDate >= startOfWeek && gameDate <= endOfWeek;
    });
    
    // Get practice schedule for this team
    const practiceSlots = [];
    if (this.scheduleData.practiceSlots) {
      Object.entries(this.scheduleData.practiceSlots).forEach(([day, slots]) => {
        slots.forEach(slot => {
          if (slot.team === team.name) {
            // Capitalize the day name
            const dayName = day.charAt(0).toUpperCase() + day.slice(1);
            practiceSlots.push({ day: dayName, time: slot.time });
          }
        });
      });
    }
    
    const thisWeekSection = `
      <div style="background:#f0f0f0;padding:2rem;border-radius:8px;margin-bottom:2rem;border-left:4px solid #CC0000;">
        <h2 style="color:#CC0000;margin-bottom:1.5rem;">This Week</h2>
        
        ${thisWeekGames.length > 0 ? `
          <div style="margin-bottom:1.5rem;">
            <h3 style="color:#333;margin-bottom:1rem;">Games</h3>
            ${thisWeekGames.map(game => {
              const gameDate = new Date(game.date);
              const dayName = gameDate.toLocaleDateString('en-US', { weekday: 'long' });
              const dateStr = gameDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const isHome = game.home === team.name;
              const opponent = isHome ? game.away : game.home;
              return `
                <div style="background:white;padding:1rem;border-radius:4px;margin-bottom:0.5rem;box-shadow:0 1px 4px rgba(0,0,0,0.1);">
                  <strong>${dayName}, ${dateStr}</strong> at ${game.time} - 
                  ${isHome ? 'vs' : '@'} ${opponent}
                  ${isHome ? ' <span style="color:#CC0000;">(HOME)</span>' : ' <span style="color:#666;">(AWAY)</span>'}
                </div>
              `;
            }).join('')}
          </div>
        ` : '<p style="color:#666;margin-bottom:1.5rem;">No games scheduled this week</p>'}
        
        ${practiceSlots.length > 0 ? `
          <div>
            <h3 style="color:#333;margin-bottom:1rem;">Practice Schedule</h3>
            ${practiceSlots.map(slot => `
              <div style="background:white;padding:1rem;border-radius:4px;margin-bottom:0.5rem;box-shadow:0 1px 4px rgba(0,0,0,0.1);">
                <strong>${slot.day}</strong> at ${slot.time}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
    
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="mt-3 mb-3">
            <a href="/?page=team-${teamName}" style="display:inline-block;margin-bottom:1rem;padding:0.5rem 1rem;background:#CC0000;color:white;text-decoration:none;border-radius:4px;">← Back to ${team.name} Home</a>
            <h1 class="text-center">${team.name} - Team Statistics</h1>
            
            ${thisWeekSection}
            
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem;margin-top:2rem;">
              <div style="background:white;padding:1.5rem;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);border-left:4px solid #CC0000;">
                <h3 style="color:#CC0000;margin-bottom:1rem;">Offense</h3>
                <p><strong>Goals For:</strong> ${totalGoals}</p>
                <p><strong>Total Assists:</strong> ${totalAssists}</p>
                <p><strong>Avg Goals/Game:</strong> ${(totalGoals / 15).toFixed(1)}</p>
              </div>
              
              <div style="background:white;padding:1.5rem;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);border-left:4px solid #800000;">
                <h3 style="color:#800000;margin-bottom:1rem;">Defense</h3>
                <p><strong>Goals Against:</strong> ${goalsAgainst}</p>
                <p><strong>Avg GA/Game:</strong> ${(goalsAgainst / 15).toFixed(1)}</p>
                <p><strong>Goal Differential:</strong> ${totalGoals - goalsAgainst > 0 ? '+' : ''}${totalGoals - goalsAgainst}</p>
              </div>
              
              <div style="background:white;padding:1.5rem;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);border-left:4px solid #CC0000;">
                <h3 style="color:#CC0000;margin-bottom:1rem;">Record</h3>
                <p><strong>Wins:</strong> ${team.record.wins}</p>
                <p><strong>Losses:</strong> ${team.record.losses}</p>
                <p><strong>Win %:</strong> ${(team.record.wins / (team.record.wins + team.record.losses) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    this.render(content);
  }
  
  renderTeamPageStatsGeneric() {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="mt-3 mb-3">
            <h1 class="text-center">Team Statistics</h1>
            <p style="text-align:center;">Loading team data...</p>
          </div>
        </div>
      </div>
    `;
    this.render(content);
  }
  
  async renderTeamPagePlayers() {
    // Load team player stats from database
    await this.loadPlayersData();
    
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || '';
    const teamId = page.split('-')[1]; // Extract team id from page name
    
    const team = this.playersData.teams.find(t => t.id === teamId);
    if (!team) {
      this.renderTeamPagePlayersGeneric();
      return;
    }
    
    const playerRows = team.players.map((player, index) => `
      <tr style='${index % 2 === 0 ? 'background:#f9f9f9;' : ''}border-bottom:1px solid #ddd;'>
        <td style='padding:0.75rem;font-weight:600;'>#${player.number} ${player.name}</td>
        <td style='padding:0.75rem;text-align:center;'>${player.position}</td>
        <td style='padding:0.75rem;text-align:center;'>${player.games}</td>
        <td style='padding:0.75rem;text-align:center;'>${player.goals}</td>
        <td style='padding:0.75rem;text-align:center;'>${player.assists}</td>
        <td style='padding:0.75rem;text-align:center;font-weight:700;color:#CC0000;'>${player.points}</td>
      </tr>
    `).join('');
    
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="mt-3 mb-3">
            <h1 class="text-center">${team.name} - Player Statistics</h1>
            <div style='overflow-x:auto;margin-top:2rem;'>
              <table style='width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.15);'>
                <thead>
                  <tr style='background:#CC0000;color:white;'>
                    <th style='padding:1rem;text-align:left;'>Player</th>
                    <th style='padding:1rem;text-align:center;'>Position</th>
                    <th style='padding:1rem;text-align:center;'>GP</th>
                    <th style='padding:1rem;text-align:center;'>G</th>
                    <th style='padding:1rem;text-align:center;'>A</th>
                    <th style='padding:1rem;text-align:center;'>PTS</th>
                  </tr>
                </thead>
                <tbody>
                  ${playerRows}
                </tbody>
              </table>
            </div>
            
            <div style='margin-top:2rem;background:white;padding:1.5rem;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);border-left:4px solid #800000;'>
              <h3 style='color:#800000;margin-bottom:1rem;'>Goalie</h3>
              <p><strong>${team.goalie.name}</strong></p>
              <p style='margin-top:0.5rem;'>Games: ${team.goalie.games} | Goals Against: ${team.goalie.goalsAgainst} | GAA: ${(team.goalie.goalsAgainst / team.goalie.games).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    `;
    this.render(content);
  }
  
  renderTeamPagePlayersGeneric() {
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="mt-3 mb-3">
            <h1 class="text-center">Player Statistics</h1>
            <p style="text-align:center;">Loading player data...</p>
          </div>
        </div>
      </div>
    `;
    this.render(content);
  }
  
  renderTeamPageSchedule() {
    // Team schedule with calendar view, games on Sat/Sun, practices during week
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || '';
    const teamName = page.split('-')[1];
    
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="mt-3 mb-3">
            <h1 class="text-center">Team Schedule</h1>
            
            <div id="team-calendar-container" style="max-width:900px;margin:2rem auto;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
                <button id="prevTeamMonth" style="padding:0.5rem 1rem;background:#CC0000;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;">← Previous</button>
                <h2 id="currentTeamMonth" style="margin:0;color:#CC0000;">December 2025</h2>
                <button id="nextTeamMonth" style="padding:0.5rem 1rem;background:#CC0000;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:600;">Next →</button>
              </div>
              
              <div id="teamCalendarView" style="background:white;padding:1.5rem;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
                <!-- Calendar will be populated by JavaScript -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    this.render(content);
    
    setTimeout(() => this.setupTeamCalendar(teamName), 100);
  }
  
  async populateTeamThisWeek(teamName, elementId) {
    await this.loadScheduleData();
    const container = document.getElementById(elementId);
    if (!container) return;
    
    // Get this week's games and practices
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    
    const thisWeekGames = this.scheduleData.games.filter(game => {
      const gameDate = new Date(game.date);
      return (game.home === teamName || game.away === teamName) &&
             gameDate >= startOfWeek && gameDate <= endOfWeek;
    });
    
    // Get practice schedule for this team
    const practiceSlots = [];
    if (this.scheduleData.practiceSlots) {
      Object.entries(this.scheduleData.practiceSlots).forEach(([day, slots]) => {
        slots.forEach(slot => {
          if (slot.team === teamName) {
            const dayName = day.charAt(0).toUpperCase() + day.slice(1);
            practiceSlots.push({ day: dayName, time: slot.time });
          }
        });
      });
    }
    
    let content = '<div style="background:#f5f5f5;padding:1.5rem;border-radius:8px;border-left:4px solid #CC0000;"><h3 style="color:#CC0000;margin-bottom:1rem;">This Week</h3>';
    
    if (thisWeekGames.length > 0) {
      thisWeekGames.forEach(game => {
        const gameDate = new Date(game.date);
        const dayName = gameDate.toLocaleDateString('en-US', { weekday: 'long' });
        const isHome = game.home === teamName;
        const opponent = isHome ? game.away : game.home;
        content += `<p style="margin-bottom:0.5rem;"><strong>${dayName}:</strong> Game ${isHome ? 'vs' : '@'} ${opponent} ${game.time}</p>`;
      });
    }
    
    practiceSlots.forEach(slot => {
      content += `<p style="margin-bottom:0.5rem;"><strong>${slot.day}:</strong> Practice ${slot.time}</p>`;
    });
    
    content += '</div>';
    container.innerHTML = content;
  }
  
  setupTeamCalendar(teamName) {
    this.loadScheduleData().then(() => {
      const prevBtn = document.getElementById('prevTeamMonth');
      const nextBtn = document.getElementById('nextTeamMonth');
      const calendarView = document.getElementById('teamCalendarView');
      
      if (!calendarView) return;
      
      let currentMonth = 11; // December
      let currentYear = 2025;
      
      // Find team's full name from schedule
      const teamFullName = this.scheduleData.teams.find(t => t.toLowerCase().includes(teamName));
      
      const renderMonth = () => {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                            'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('currentTeamMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Build schedule from centralized data
        const schedule = {};
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Add games from schedule.json
        this.scheduleData.games.forEach(game => {
          const gameDate = new Date(game.date);
          if (gameDate.getMonth() === currentMonth && gameDate.getFullYear() === currentYear) {
            if (game.home === teamFullName || game.away === teamFullName) {
              const opponent = game.home === teamFullName ? game.away : game.home;
              const location = game.home === teamFullName ? 'vs' : '@';
              if (!schedule[game.date]) schedule[game.date] = [];
              schedule[game.date].push({ 
                type: 'game', 
                opponent: `${location} ${opponent}`, 
                time: game.time 
              });
            }
          }
        });
        
        // Add practices from practice slots (only on weekdays without games)
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(currentYear, currentMonth, day);
          const dayOfWeek = date.getDay();
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
          
          // Only add practice if it's a weekday (Mon-Fri) and no game scheduled
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const hasGame = schedule[dateStr] && schedule[dateStr].some(e => e.type === 'game');
            if (!hasGame && this.scheduleData.practiceSlots[dayName]) {
              this.scheduleData.practiceSlots[dayName].forEach(slot => {
                if (slot.team === teamFullName) {
                  if (!schedule[dateStr]) schedule[dateStr] = [];
                  schedule[dateStr].push({ type: 'practice', time: slot.time });
                }
              });
            }
          }
        }
        
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const adjustedFirstDay = (firstDay + 1) % 7;
        
        let html = '<table style="width:100%;border-collapse:collapse;">';
        html += '<thead><tr style="background:#CC0000;color:white;">';
        html += '<th style="padding:0.75rem;">Sat</th><th style="padding:0.75rem;">Sun</th><th style="padding:0.75rem;">Mon</th><th style="padding:0.75rem;">Tue</th><th style="padding:0.75rem;">Wed</th><th style="padding:0.75rem;">Thu</th><th style="padding:0.75rem;">Fri</th>';
        html += '</tr></thead><tbody><tr>';
        
        // Empty cells before first day
        for (let i = 0; i < adjustedFirstDay; i++) {
        html += '<td style="padding:0.75rem;border:1px solid #ddd;background:#f9f9f9;height:100px;"></td>';
      }
      
      // Days of month
      for (let day = 1; day <= daysInMonth; day++) {
        if ((adjustedFirstDay + day - 1) % 7 === 0 && day > 1) {
          html += '</tr><tr>';
        }
        
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const events = schedule[dateStr];
        
        html += `<td data-date="${dateStr}" style="padding:0.75rem;border:1px solid #ddd;vertical-align:top;height:100px;${events ? 'background:#ffe6e6;cursor:pointer;' : 'cursor:pointer;'}transition:background 0.2s;" onmouseover="this.style.background='${events ? '#ffd4d4' : '#f5f5f5'}'" onmouseout="this.style.background='${events ? '#ffe6e6' : 'white'}'" onclick="window.appRouter.showDatePopup('${dateStr}', ${JSON.stringify(events || []).replace(/"/g, '&quot;')})">`;
        html += `<strong>${day}</strong>`;
        if (events) {
          events.forEach(event => {
            if (event.type === 'game') {
              html += `<div style="font-size:0.75rem;margin-top:0.25rem;color:#CC0000;font-weight:600;">GAME</div>`;
              html += `<div style="font-size:0.7rem;color:#000;">${event.opponent}</div>`;
              html += `<div style="font-size:0.7rem;color:#666;">${event.time}</div>`;
            } else {
              html += `<div style="font-size:0.75rem;margin-top:0.25rem;color:#666;font-weight:600;">Practice</div>`;
              html += `<div style="font-size:0.7rem;color:#666;">${event.time}</div>`;
            }
          });
        }
        html += '</td>';
      }
      
      // Fill remaining cells
      const totalCells = adjustedFirstDay + daysInMonth;
      const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
      for (let i = 0; i < remainingCells; i++) {
        html += '<td style="padding:0.75rem;border:1px solid #ddd;background:#f9f9f9;height:100px;"></td>';
      }
      
      html += '</tr></tbody></table>';
      calendarView.innerHTML = html;
      };
      
      if (prevBtn) {
        prevBtn.onclick = () => {
          currentMonth--;
          if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
          }
          renderMonth();
        };
      }
      
      if (nextBtn) {
        nextBtn.onclick = () => {
          currentMonth++;
          if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
          }
          renderMonth();
        };
      }
      
      renderMonth();
    }).catch(error => {
      console.error('Failed to load schedule for team calendar:', error);
      const calendarView = document.getElementById('teamCalendarView');
      if (calendarView) {
        calendarView.innerHTML = '<p style="text-align:center;color:#CC0000;padding:2rem;">Error loading schedule data</p>';
      }
    });
  }
  
  getRandomOpponent(currentTeam) {
    const teams = ['Thunder', 'Ice Warriors', 'Street Kings', 'Puck Masters', 'Rangers', 'Devils', 'Hawks', 'Blades'];
    const filtered = teams.filter(t => !currentTeam.includes(t.toLowerCase()));
    return filtered[Math.floor(Math.random() * filtered.length)];
  }
  
  getRandomTime(hours, period) {
    const hour = hours[Math.floor(Math.random() * hours.length)];
    const minutes = Math.random() > 0.5 ? '00' : '30';
    return `${hour}:${minutes} ${period}`;
  }
  
  async renderTeamStatsPage() {
    // Team stats sub-page from stats menu - load from database
    await this.loadPlayersData();
    
    const teamRows = this.playersData.teams.map((team, index) => {
      const goalsFor = team.players.reduce((sum, p) => sum + p.goals, 0);
      const goalsAgainst = team.goalie.goalsAgainst;
      const diff = goalsFor - goalsAgainst;
      
      return `
        <tr style='${index % 2 === 0 ? 'background:#f9f9f9;' : ''}border-bottom:1px solid #ddd;'>
          <td style='padding:1rem;font-weight:600;'>${team.name}</td>
          <td style='padding:1rem;text-align:center;'>${goalsFor}</td>
          <td style='padding:1rem;text-align:center;'>${goalsAgainst}</td>
          <td style='padding:1rem;text-align:center;font-weight:700;color:${diff > 0 ? '#CC0000' : '#666'};'>${diff > 0 ? '+' : ''}${diff}</td>
        </tr>
      `;
    }).join('');
    
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="content-with-sidebar mt-3">
            <sh-onscreenpage items="Standings,/?page=stats|Team Stats,/?page=stats-teams|Player Stats,/?page=stats-players|Goalie Stats,/?page=stats-goalies"></sh-onscreenpage>
            <div class="main-content">
              <h1>Team Statistics</h1>
              <div style='overflow-x:auto;'>
                <table style='width:100%;border-collapse:collapse;'>
                  <thead>
                    <tr style='background:#CC0000;color:white;'>
                      <th style='padding:1rem;text-align:left;'>Team</th>
                      <th style='padding:1rem;text-align:center;'>GF</th>
                      <th style='padding:1rem;text-align:center;'>GA</th>
                      <th style='padding:1rem;text-align:center;'>Diff</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${teamRows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    this.render(content);
  }
  
  async renderPlayerStatsPage() {
    // Player stats sub-page from stats menu - load from database
    await this.loadPlayersData();
    
    // Collect all players from all teams and sort by points
    let allPlayers = [];
    this.playersData.teams.forEach(team => {
      team.players.forEach(player => {
        allPlayers.push({
          ...player,
          team: team.name
        });
      });
    });
    
    allPlayers.sort((a, b) => b.points - a.points);
    const topPlayers = allPlayers.slice(0, 50); // Show top 50
    
    const playerRows = topPlayers.map((player, index) => `
      <tr style='${index % 2 === 0 ? 'background:#f9f9f9;' : ''}border-bottom:1px solid #ddd;'>
        <td style='padding:0.75rem;font-weight:600;'>${player.name}</td>
        <td style='padding:0.75rem;'>${player.team}</td>
        <td style='padding:0.75rem;text-align:center;'>${player.position}</td>
        <td style='padding:0.75rem;text-align:center;'>${player.games}</td>
        <td style='padding:0.75rem;text-align:center;'>${player.goals}</td>
        <td style='padding:0.75rem;text-align:center;'>${player.assists}</td>
        <td style='padding:0.75rem;text-align:center;font-weight:700;color:#CC0000;'>${player.points}</td>
      </tr>
    `).join('');
    
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="content-with-sidebar mt-3">
            <sh-onscreenpage items="Standings,/?page=stats|Team Stats,/?page=stats-teams|Player Stats,/?page=stats-players|Goalie Stats,/?page=stats-goalies"></sh-onscreenpage>
            <div class="main-content">
              <h1>Player Statistics</h1>
              <div style='overflow-x:auto;'>
                <table style='width:100%;border-collapse:collapse;'>
                  <thead>
                    <tr style='background:#CC0000;color:white;'>
                      <th style='padding:0.75rem;text-align:left;'>Player</th>
                      <th style='padding:0.75rem;text-align:left;'>Team</th>
                      <th style='padding:0.75rem;text-align:center;'>Pos</th>
                      <th style='padding:0.75rem;text-align:center;'>GP</th>
                      <th style='padding:0.75rem;text-align:center;'>G</th>
                      <th style='padding:0.75rem;text-align:center;'>A</th>
                      <th style='padding:0.75rem;text-align:center;'>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${playerRows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    this.render(content);
  }
  
  async renderGoalieStatsPage() {
    // Goalie stats sub-page from stats menu - load from database
    await this.loadPlayersData();
    
    const goalieRows = this.playersData.teams.map((team, index) => {
      const gaaPerGame = (team.goalie.goalsAgainst / team.goalie.games).toFixed(2);
      return `
        <tr style='${index % 2 === 0 ? 'background:#f9f9f9;' : ''}border-bottom:1px solid #ddd;'>
          <td style='padding:1rem;font-weight:600;'>${team.goalie.name}</td>
          <td style='padding:1rem;'>${team.name}</td>
          <td style='padding:1rem;text-align:center;'>${team.goalie.games}</td>
          <td style='padding:1rem;text-align:center;'>${team.goalie.goalsAgainst}</td>
          <td style='padding:1rem;text-align:center;font-weight:700;color:#800000;'>${gaaPerGame}</td>
        </tr>
      `;
    }).join('');
    
    const content = document.createElement('div');
    content.innerHTML = `
      <div class="page-content">
        <div class="container">
          <div class="content-with-sidebar mt-3">
            <sh-onscreenpage items="Standings,/?page=stats|Team Stats,/?page=stats-teams|Player Stats,/?page=stats-players|Goalie Stats,/?page=stats-goalies"></sh-onscreenpage>
            <div class="main-content">
              <h1>Goalie Statistics</h1>
              <div style='overflow-x:auto;'>
                <table style='width:100%;border-collapse:collapse;'>
                  <thead>
                    <tr style='background:#800000;color:white;'>
                      <th style='padding:1rem;text-align:left;'>Goalie</th>
                      <th style='padding:1rem;text-align:left;'>Team</th>
                      <th style='padding:1rem;text-align:center;'>GP</th>
                      <th style='padding:1rem;text-align:center;'>GA</th>
                      <th style='padding:1rem;text-align:center;'>GA/GP</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${goalieRows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    this.render(content);
  }

  showDatePopup(dateStr, events) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
    
    const date = new Date(dateStr + 'T12:00:00');
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    const modal = document.createElement('div');
    modal.style.cssText = 'background:white;border-radius:8px;padding:2rem;max-width:600px;width:90%;box-shadow:0 4px 16px rgba(0,0,0,0.3);max-height:80vh;overflow-y:auto;';
    
    let eventsHtml = '';
    if (events && events.length > 0) {
      events.forEach(event => {
        if (event.type === 'game') {
          eventsHtml += `
            <div style="background:#ffe6e6;padding:1.5rem;border-radius:4px;margin-bottom:1rem;border-left:4px solid #CC0000;">
              <h3 style="color:#CC0000;margin:0 0 0.5rem 0;font-size:1.3rem;">🏒 GAME</h3>
              <p style="margin:0.5rem 0;font-size:1.1rem;"><strong>${event.opponent}</strong></p>
              <p style="margin:0.5rem 0;color:#666;font-size:1rem;">🕐 ${event.time}</p>
            </div>
          `;
        } else {
          eventsHtml += `
            <div style="background:#f5f5f5;padding:1.5rem;border-radius:4px;margin-bottom:1rem;border-left:4px solid #666;">
              <h3 style="color:#666;margin:0 0 0.5rem 0;font-size:1.3rem;">⚡ PRACTICE</h3>
              <p style="margin:0.5rem 0;font-size:1.1rem;"><strong>${event.team || 'Team'}</strong></p>
              <p style="margin:0.5rem 0;color:#666;font-size:1rem;">🕐 ${event.time}</p>
            </div>
          `;
        }
      });
    } else {
      eventsHtml = '<p style="text-align:center;color:#666;padding:2rem;font-size:1.1rem;">No games or practices scheduled</p>';
    }
    
    modal.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;border-bottom:2px solid #eee;padding-bottom:1rem;">
        <div>
          <h2 style="color:#CC0000;margin:0;font-size:1.8rem;">${dayName}</h2>
          <p style="color:#666;margin:0.5rem 0 0 0;font-size:1.1rem;">${monthDay}</p>
        </div>
        <button id="close-popup" style="background:#CC0000;color:white;border:none;border-radius:4px;padding:0.75rem 1.5rem;font-size:1rem;font-weight:600;cursor:pointer;">Close</button>
      </div>
      ${eventsHtml}
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Close on button click
    document.getElementById('close-popup').addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
    
    // Close on ESC key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  render(content) {
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(content);
    
    // Scroll to top on page change
    window.scrollTo(0, 0);
  }
}

// Initialize router
window.appRouter = new Router();
