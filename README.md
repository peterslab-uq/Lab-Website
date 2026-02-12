# Peters Lab Website

A professional research laboratory website for The Peters Molecular Arbovirology Laboratory at The University of Queensland.

## Project Overview

This website showcases the research, team, and publications of the Peters Molecular Arbovirology Lab. It features an interactive design with team member cards, multimedia content, and a comprehensive publication system.

## Website Structure

### Main Pages

- **index.html** - Homepage with hero section, about, research areas, ISVac platform, and Mozzie mAbs sections
- **team.html** - Dedicated team page with all lab members organized by role and an alumni section
- **publications.html** - Complete searchable publication database with year-based filtering
- **style.css** - Comprehensive styling with responsive design
- **script.js** - JavaScript for interactivity (flip animations, navigation, etc.)

## Features

### 1. **Responsive Navigation**
- Sticky navbar with lab name and menu
- Hamburger menu for mobile devices
- Links to all major sections and pages

### 2. **Hero Section**
- Background image with overlay gradient
- Welcome message and call-to-action button

### 3. **About Section**
- Lab description and mission
- Embedded YouTube video

### 4. **Research Areas**
- 3-column responsive grid layout
- Arbovirus Discovery, Diagnostics, and Vaccines cards
- LFA.png image above Arbovirus Discovery and Diagnostics cards
- Flavi.jpg image (50% width) above Vaccines card
- Centered headings and descriptions
- No background cards for minimal design

### 5. **ISVac Platform**
- Text description with embedded YouTube video
- Featured image below content
- Centered layout for multimedia

### 6. **Mozzie mAbs Section**
- Image on the left with product information on the right
- Purchase button centered at the bottom
- Links to external shop

### 7. **Team Section** (`team.html`)
- **Organized by role:**
  - Principal Investigators
  - Postdoctoral Researchers
  - PhD Students
  - Research Assistants
  - Undergraduate Students

- **Interactive flip cards:**
  - Front: Member photo, name, and role
  - Back: Bio with scrollable text for longer content
  - 3D flip animation on click

### 8. **Alumni Section** (`team.html`)
- Grid layout for past lab members
- Displays: Name, previous role, years in lab, current position
- Hover effects with elevation animation

### 9. **Publications System**
- **Featured Publications** (index.html): Top 3 most recent
- **All Publications** (publications.html): Complete database with:
  - Year-based grouping with collapsible sections
  - Search functionality (title, author, year)
  - Publication cards with metadata
  - DOI links

### 10. **Contact Section**
- Contact form with spam protection (CAPTCHA)
- FormSubmit integration for email delivery
- Lab contact information

### 11. **Footer**
- Quick navigation links
- Contact email
- Copyright information

## Color Palette

- **Primary**: `#1F3A5F` (Dark Blue) - Main text and headings
- **Secondary**: `#4A6FA5` (Medium Blue) - Accents and hover states
- **Accent**: `#4FB3A2` (Teal) - Highlights and CTAs
- **Background**: `#F7F9FC` (Light Blue) - Section backgrounds
- **Text**: `#1E1E1E` (Dark) - Body text

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Styling with custom properties and animations
  - 3D transforms for flip cards
  - Flexbox and CSS Grid layouts
  - Responsive design with media queries
- **JavaScript** - Interactivity
  - Scroll reveal animations
  - Card flip functionality
  - Hamburger menu toggle
  - Gallery slider
- **FormSubmit API** - Contact form backend

## Publication Management

### Adding Publications

1. Edit `references.bib` with BibTeX entries
2. Run `python convert.py` to generate `references.json`
3. Publications automatically appear on:
   - Featured Publications section (3 most recent)
   - All Publications page with search functionality

### Example BibTeX Entry

```bibtex
@article{AuthorYear,
  title={Article Title},
  author={Author Name},
  journal={Journal Name},
  year={2024},
  volume={10},
  pages={1--15},
  doi={10.xxxx/xxxxx}
}
```

## Team Management

### Adding Team Members

Edit `team.html` and add new cards in the appropriate section:

```html
<div class="team_card_wrapper">
    <div class="team_card">
        <div class="team_card_front">
            <img src="Images/photo.jpg" alt="Name" class="team_photo">
            <h3 class="team_name">Full Name</h3>
            <p class="team_role">Role Title</p>
        </div>
        <div class="team_card_back">
            <p class="team_bio">Bio text here...</p>
        </div>
    </div>
</div>
```

### Adding Alumni

Edit the alumni grid in `team.html`:

```html
<div class="alumni_card">
    <h3 class="alumni_name">Alumni Name</h3>
    <p class="alumni_role">Previous Role</p>
    <p class="alumni_years">2020-2023</p>
    <p class="alumni_current">Current Position at Institution</p>
</div>
```

## Responsive Design

The website is fully responsive with breakpoints for:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

Key responsive features:
- Hamburger menu on mobile
- Flexible grid layouts
- Adjusted font sizes and spacing
- Touch-friendly interactive elements

## Team Card Features

### Front (Display)
- Member photo (120px circular)
- Name and role
- Hover effect with elevation

### Back (Bio)
- Scrollable bio text for longer content
- Custom webkit scrollbar styling
- Semi-transparent white background

## File Structure

```
Lab Website/
├── index.html           # Main homepage
├── team.html            # Team and alumni page
├── publications.html    # Full publications database
├── style.css            # All styling
├── script.js            # JavaScript functionality
├── references.bib       # BibTeX publication database
├── references.json      # Converted publication database
├── convert.py           # BibTeX to JSON converter
├── test_bib.py          # BibTeX testing utility
└── Images/              # All images and photos
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential features to add:
- Blog/news section
- Research gallery/photo albums
- Event calendar
- Lab resources/protocols
- Equipment inventory
- Collaboration opportunities
- Newsletter signup
- Dark mode toggle

## Contact & Support

For questions about the website content, contact the lab directly through the contact form.

For technical issues or contributions, refer to the repository maintainer.

## License

© 2026 Hobson-Peters Research Lab. All Rights Reserved.

---

*Last Updated: February 12, 2026*
