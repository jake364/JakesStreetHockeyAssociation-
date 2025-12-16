// JSON Outline Schema compliant menu structure
export default function handler(req, res) {
  const menu = {
    "id": "jsha-main-menu",
    "title": "Jake's Street Hockey Association",
    "author": "JSHA Team",
    "description": "Main navigation menu",
    "license": "MIT",
    "metadata": {},
    "items": [
      {
        "id": "home",
        "title": "Home",
        "location": "/?page=home",
        "metadata": { "icon": "home" },
        "order": 0
      },
      {
        "id": "about",
        "title": "About",
        "location": "/?page=about",
        "metadata": { "icon": "info" },
        "order": 1,
        "children": [
          {
            "id": "our-story",
            "title": "Our Story",
            "location": "/?page=story",
            "order": 0
          },
          {
            "id": "team",
            "title": "Our Team",
            "location": "/?page=team",
            "order": 1
          },
          {
            "id": "contact",
            "title": "Contact Us",
            "location": "/?page=contact",
            "order": 2
          }
        ]
      },
      {
        "id": "schedule",
        "title": "Schedule",
        "location": "/?page=schedule",
        "metadata": { "icon": "calendar" },
        "order": 2
      },
      {
        "id": "photos",
        "title": "Photos",
        "location": "/?page=photos",
        "metadata": { "icon": "photo" },
        "order": 3
      },
      {
        "id": "stats",
        "title": "Statistics",
        "location": "/?page=stats",
        "metadata": { "icon": "chart" },
        "order": 4
      },
      {
        "id": "register",
        "title": "Register",
        "location": "/?page=register",
        "metadata": { "icon": "person-add", "highlight": true },
        "order": 5
      },
      {
        "id": "admin",
        "title": "Admin",
        "location": "/?page=admin",
        "metadata": { "icon": "settings", "protected": true },
        "order": 6
      }
    ]
  };

  res.status(200).json(menu);
}
