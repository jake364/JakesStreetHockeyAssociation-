# Jake's Street Hockey Association (JSHA)

A modern, responsive web application for managing Jake's Street Hockey Association with photo galleries, game schedules, player statistics, and admin capabilities.

![JSHA Logo](https://img.shields.io/badge/JSHA-Street%20Hockey-FF6B35?style=for-the-badge)

## 🏒 Features

- **Home Page**: Hero banner, upcoming games, news updates, and sponsor showcase
- **Photo Gallery**: Instagram-style photo grid with modal view
- **Statistics Dashboard**: Team and player performance tracking
- **Admin Upload**: Secure admin panel for content management
- **Responsive Design**: Mobile-first approach with hamburger navigation
- **Dark Mode Support**: Automatic dark mode based on system preferences
- **Web Components**: 10 custom, reusable components

## 🎨 Brand Colors

- **Primary**: `#FF6B35` (Vibrant Orange)
- **Secondary**: `#004E89` (Deep Blue)
- **Accent**: `#F7B801` (Golden Yellow)
- **Light**: `#F4F4F9` (Off White)
- **Dark**: `#1A1A2E` (Dark Navy)

## 🧩 The 10 Web Components (Academic Project Requirements)

**Component Naming Convention: `sh-{usage}`**

1. **`<sh-title>`** - Main title bar component (red background, white text)
2. **`<sh-pagebutton>`** - Top navigation page buttons with hover dropdowns
3. **`<sh-mainbutton>`** - Standard button used throughout pages (red)
4. **`<sh-register>`** - Darker registration button component
5. **`<sh-sideinformation>`** - Sidebar information component
6. **`<sh-paragraphcard>`** - Paragraph card component (white cards)
7. **`<sh-sponser>`** - Sponsor display component
8. **`<sh-dropdownpagebuttons>`** - Dropdown menu on hover
9. **`<sh-onscreenpage>`** - Sidebar navigation showing current page (bold)
10. **`<sh-cardgrid>`** - 3x3 grid for cards (photos, games, stats, text)

### Course Compliance
- ✅ 10 reusable components
- ✅ Routing implemented (/?page=)
- ✅ API endpoints: /api/menu (JSON Outline Schema), /api/schedule, /api/stats, /api/photos
- ✅ Mobile responsive
- ✅ Professional design
- ✅ Admin functionality for data input
- ✅ Vercel deployment ready

## 📁 Project Structure

```
Streethockey/
├── index.html              # Main HTML file with page templates
├── styles.css              # Global styles and component styling
├── components.js           # All 10 web components
├── router.js               # Client-side routing logic
├── package.json            # Project dependencies
├── vercel.json             # Vercel deployment configuration
├── .gitignore              # Git ignore rules
└── api/                    # Serverless API endpoints
    ├── menu.js             # Navigation menu data
    ├── schedule.js         # Game schedule data
    ├── photos.js           # Photo gallery data
    ├── stats.js            # Team/player statistics
    └── upload.js           # Admin upload handler
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Local Development

1. **Clone or navigate to the project directory:**
   ```bash
   cd c:\Users\jake7\IdeaProjects\Streethockey
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run locally with Vercel CLI:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### Available Pages

- **Home**: `/?page=home` or `/`
- **Photos**: `/?page=photos`
- **Stats**: `/?page=stats`
- **Admin**: `/?page=admin-upload` (password: `jsha2025`)

## 📤 Deploying to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy to production:**
   ```bash
   npm run deploy
   ```
   Or simply:
   ```bash
   vercel --prod
   ```

4. **Follow the prompts:**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N` (first time)
   - Project name: `jakes-street-hockey` (or your choice)
   - Directory: `./`
   - Override settings: `N`

### Method 2: GitHub + Vercel Dashboard

1. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Jake's Street Hockey Association"
   ```

2. **Create GitHub repository and push:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/jsha.git
   git branch -M main
   git push -u origin main
   ```

3. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"

### Method 3: Drag & Drop

1. Build your project (if needed)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Drag and drop your project folder
4. Click "Deploy"

## 🔧 Configuration

### API Endpoints

All API routes are defined in `vercel.json` and use Vercel's serverless functions:

- `/api/menu` - Navigation items
- `/api/schedule` - Upcoming games
- `/api/photos` - Photo gallery data
- `/api/stats` - Team and player statistics
- `/api/upload` - POST endpoint for admin uploads

### Environment Variables (Optional)

For production, you may want to add:

```bash
# In Vercel Dashboard > Settings > Environment Variables
ADMIN_PASSWORD=your_secure_password
API_SECRET=your_api_secret
```

## 🎯 Admin Access

The admin panel is protected by a simple password check:

- **URL**: `/?page=admin-upload`
- **Password**: `jsha2025`

**Note**: For production, implement proper authentication (JWT, OAuth, etc.)

## 📱 Responsive Breakpoints

- **Mobile**: < 480px (1-column layout)
- **Tablet**: 481px - 768px
- **Desktop**: > 768px (full layout)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Components**: Web Components (Custom Elements API)
- **Backend**: Node.js (Vercel Serverless Functions)
- **Deployment**: Vercel
- **Version Control**: Git

## 📝 Customization

### Adding New Photos

1. Go to `/api/photos.js`
2. Add new photo objects to the array:
   ```javascript
   {
     id: 10,
     url: 'https://your-image-url.com/photo.jpg',
     caption: 'Your caption here',
     date: '2025-11-17'
   }
   ```

### Adding New Games

1. Edit `/api/schedule.js`
2. Add game objects:
   ```javascript
   {
     id: 5,
     date: 'Dec 5, 2025',
     time: '7:00 PM',
     homeTeam: 'Team A',
     awayTeam: 'Team B',
     location: 'Arena Name'
   }
   ```

### Updating Player Stats

1. Modify `/api/stats.js`
2. Update player data or add new players

## 🐛 Troubleshooting

### Local Development Issues

**Problem**: API endpoints return 404
- **Solution**: Make sure you're using `vercel dev`, not a regular HTTP server

**Problem**: Components not rendering
- **Solution**: Check browser console for errors, ensure `components.js` is loaded

**Problem**: Routing not working
- **Solution**: Verify `router.js` is loaded after `components.js`

### Deployment Issues

**Problem**: Build fails on Vercel
- **Solution**: Check `vercel.json` configuration and ensure all files are committed

**Problem**: API routes not working
- **Solution**: Verify API files are in `/api` directory and named correctly (`.js` extension)

## 📊 Performance

- Lazy loading for images
- CSS minification recommended for production
- Consider implementing caching strategies for API responses
- Optimize images before uploading

## 🔐 Security Considerations

For production deployment:

1. **Implement proper authentication** for admin panel
2. **Use environment variables** for sensitive data
3. **Add rate limiting** to API endpoints
4. **Validate all user inputs** server-side
5. **Use HTTPS** (Vercel provides this automatically)
6. **Implement CORS policies** as needed

## 📄 License

MIT License - Feel free to use this project for your own street hockey association!

## 👥 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 🏆 Credits

Created for Jake's Street Hockey Association
- Developer: GitHub Copilot
- Year: 2025

## 📞 Support

For issues or questions:
- Email: info@jsha.com
- GitHub Issues: [Create an issue](#)

---

**Built with ❤️ and 🏒 by the JSHA team**

## 🚦 Quick Start Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Test locally (`npm run dev`)
- [ ] Commit to Git
- [ ] Push to GitHub (optional)
- [ ] Deploy to Vercel (`npm run deploy`)
- [ ] Test live site
- [ ] Share your URL!

**Your site will be live at**: `https://your-project-name.vercel.app`
