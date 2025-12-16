# IST 256 Project 2 - Requirements Checklist

## \ud83c\udfaf Project: Jake's Street Hockey Association (JSHA)

### Team Information
- **Association Name**: Jake's Street Hockey Association
- **Brand**: Professional street hockey league for all ages
- **Repository**: Streethockey/
- **Vercel URL**: (Deploy with `vercel --prod`)

---

## \u2705 High Level Requirements

### Functional Prototype
- [x] Highly functional homepage
- [x] 3+ pages with routing working (home, schedule, photos, stats, register, admin)
- [x] Mock content that appears functional
- [x] All content is logical and cohesive

### Technology Stack
- [x] Built for Vercel deployment
- [x] Using web components (10 custom components)
- [x] Mobile responsive design
- [x] Accessible design patterns
- [x] Professional theming

---

## \ud83e\udde9 10 Reusable Components

All components follow the naming convention: `sh-{usage}`

| # | Component Name | Purpose | Properties |
|---|----------------|---------|------------|
| 1 | `sh-title` | Red title bar | text |
| 2 | `sh-pagebutton` | Navigation buttons | text, href, dropdown, dropdown-items |
| 3 | `sh-mainbutton` | Standard buttons | text, href, onclick |
| 4 | `sh-register` | Registration button | text, href |
| 5 | `sh-sideinformation` | Sidebar info | title, content |
| 6 | `sh-paragraphcard` | Content cards | title, content |
| 7 | `sh-sponser` | Sponsor display | name, logo |
| 8 | `sh-dropdownpagebuttons` | Dropdown menus | items |
| 9 | `sh-onscreenpage` | Sidebar nav | items |
| 10 | `sh-cardgrid` | 3x3 grid system | type, api |

---

## \ud83c\udfa8 Branding & Design

### Color Palette (Professional Theme)
- **Primary Background**: Grey (#E8E8E8)
- **Primary Text**: Black (#000000)
- **Title Bar**: Red (#CC0000)
- **Cards**: White (#FFFFFF)
- **Accents**: Dark Red (#8B0000)

### Typography
- Font Family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Professional hierarchy with clear heading sizes
- Consistent spacing and line-height

### Spacing & Layout
- Consistent padding and margins
- Box shadows for depth
- Border accents on cards
- Responsive grid system

---

## \ud83d\udd00 Routing Implementation

### Working Routes
1. `/?page=home` - Homepage with welcome, games, sponsors
2. `/?page=schedule` - Full schedule with sidebar
3. `/?page=photos` - Photo gallery with modal
4. `/?page=stats` - Statistics dashboard
5. `/?page=register` - Registration form
6. `/?page=admin` - Admin dashboard

### Router Features
- Client-side routing via URL parameters
- History API integration
- Smooth page transitions
- Active page indicators
- Fallback routing

---

## \ud83d\udce1 API Endpoints

### 1. /api/menu
- **Format**: JSON Outline Schema compliant
- **Purpose**: Drives navigation menu structure
- **Features**: Hierarchical menu with children, metadata, ordering

### 2. /api/schedule
- **Format**: JSON array of game objects
- **Purpose**: Displays upcoming games
- **Data**: date, time, teams, location

### 3. /api/stats  
- **Format**: JSON with summary array and players array
- **Purpose**: Team and player statistics
- **Features**: 9 stat cards + player leaderboard

### 4. /api/photos
- **Format**: JSON array of photo objects
- **Purpose**: Photo gallery display
- **Features**: URLs, captions, click to enlarge

### 5. /api/upload
- **Format**: POST endpoint
- **Purpose**: Admin data submission
- **Accepts**: Game results, player stats, photos

---

## \ud83d\udcca Content Bands/Sections

### Header
- Red title bar with white text
- Navigation buttons with dropdowns
- Sticky positioning

### Hero/Welcome Section
- Large paragraph card with welcome message
- Call-to-action buttons
- Professional spacing

### Games Section
- 3x3 card grid displaying upcoming games
- Loads from /api/schedule
- Responsive layout

### Featured Section (Secondary Theme)
- Red background section
- Black cards with white text
- Content + sidebar layout

### Sponsors Section
- Horizontal sponsor display
- White cards on grey background
- Flexible wrapping

### Stats Section
- 3x3 grid of statistics cards
- Red background with white text
- Player leaderboard table

---

## \ud83d\udcf1 Responsive Design

### Breakpoints
- **Desktop**: > 1024px (3 column grid)
- **Tablet**: 768px - 1024px (2 column grid)
- **Mobile**: < 768px (1 column grid)

### Mobile Features
- Single column layouts
- Full-width buttons
- Collapsing navigation
- Touch-optimized spacing
- Readable font sizes

---

## \u267f Accessibility

### Features Implemented
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast ratios meet WCAG standards
- Alt text on images
- Form labels

---

## \ud83d\udd10 Admin Functionality

### Password Protection
- Login screen with password input
- Password: `jsha2025`
- Session-based access

### Admin Capabilities
1. **Upload Game Results**
   - Home team, away team
   - Score, date, location

2. **Upload Player Stats**
   - Player name
   - Goals, assists

3. **Upload Photos**
   - Photo URL
   - Caption

### Data Submission
- POST to /api/upload
- Form validation
- Success/error messaging
- Form reset after submission

---

## \ud83d\udee0 Menu System

### JSON Outline Schema Structure
```json
{
  "id": "jsha-main-menu",
  "title": "Jake's Street Hockey Association",
  "items": [
    {
      "id": "home",
      "title": "Home",
      "location": "/?page=home",
      "order": 0,
      "children": []
    }
  ]
}
```

### Menu Features
- Hierarchical structure
- Dropdown submenus on hover
- Active page highlighting
- Metadata support (icons, protected pages)
- Order-based sorting

---

## \ud83d\udcdd Component Details

### sh-cardgrid (Most Complex)
**Types Supported:**
- `photo` - Image grid with overlay captions
- `game` - Game schedule cards
- `stats` - Statistics display
- `text` - General content cards

**Features:**
- Async data loading
- 3x3 grid layout
- Click handlers for photos
- Responsive columns
- Loading states

### sh-pagebutton (Navigation)
**Features:**
- Hover dropdown menus
- Active state styling
- Flexible link structure
- Responsive design

### sh-onscreenpage (Sidebar Nav)
**Features:**
- Vertical navigation
- Bold active page
- Scroll indication
- Mobile optimization

---

## \ud83d\ude80 Deployment Instructions

### Local Development
```bash
# Serve with Python
python -m http.server 8000

# Access at http://localhost:8000
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Build Configuration
- `vercel.json` configured for API rewrites
- Static file serving
- SPA routing support

---

## \ud83d\udccb Project Structure

```
Streethockey/
\u251c\u2500\u2500 index.html              # Main app entry
\u251c\u2500\u2500 components.js          # All 10 components
\u251c\u2500\u2500 router.js              # Client-side routing
\u251c\u2500\u2500 styles.css             # Professional styling
\u251c\u2500\u2500 package.json           # Dependencies
\u251c\u2500\u2500 vercel.json            # Deployment config
\u251c\u2500\u2500 .gitignore             # Git exclusions
\u251c\u2500\u2500 README.md              # Documentation
\u2514\u2500\u2500 api/                   # API endpoints
    \u251c\u2500\u2500 menu.js             # JSON Outline Schema menu
    \u251c\u2500\u2500 schedule.js         # Game schedule data
    \u251c\u2500\u2500 photos.js           # Photo gallery data
    \u251c\u2500\u2500 stats.js            # Statistics data
    \u2514\u2500\u2500 upload.js           # Admin upload handler
```

---

## \u2705 Requirements Checklist

### Must-Have Features
- [x] Top-level menu that expands/collapses
- [x] Colors and branding for sports association
- [x] 10 reusable components identified and built
- [x] Schedule loaded from /api/schedule endpoint
- [x] Header and footer
- [x] Multiple content bands
- [x] Custom brand with consistent colors and logos
- [x] Multiple links to other content areas
- [x] 3+ clickable routing links
- [x] Menu loaded from /api/menu
- [x] JSON Outline Schema format
- [x] Mobile responsive
- [x] Accessible design
- [x] Professional appearance

### Bonus Features
- [x] Photo modal/lightbox
- [x] Admin data input system
- [x] Sidebar navigation
- [x] Dropdown menus
- [x] 6 full pages (exceeds requirement)
- [x] Dark mode considerations
- [x] Form validation
- [x] Error handling

---

## \ud83d\udcda References & Resources

### Technologies Used
- Web Components (Custom Elements API)
- Vanilla JavaScript (ES6+)
- CSS3 with custom properties
- Vercel Serverless Functions
- JSON Outline Schema

### Design Patterns
- Component-based architecture
- Mobile-first responsive design
- Progressive enhancement
- Separation of concerns
- DRY principles

---

## \ud83c\udfaf Final Submission Notes

### What Makes This Professional
1. **Consistent Design Language**: Red, grey, black, white theme throughout
2. **Reusable Components**: All 10 components can be used multiple times
3. **Clean Code**: Well-commented, organized, maintainable
4. **User Experience**: Intuitive navigation, clear hierarchy
5. **Accessibility**: Semantic HTML, keyboard navigation
6. **Performance**: Optimized loading, efficient rendering
7. **Responsive**: Works on all device sizes
8. **Functional**: All features work as expected

### Ready for Production
- \u2705 Works locally
- \u2705 Deploys to Vercel
- \u2705 API endpoints functional
- \u2705 All pages accessible
- \u2705 Admin system works
- \u2705 Mobile tested
- \u2705 Professional appearance

---

**Project Status**: \u2705 **COMPLETE & READY FOR SUBMISSION**
