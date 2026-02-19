# Peters Molecular Arbovirology Laboratory — Website

Official website for the Peters Molecular Arbovirology Laboratory at The University of Queensland, Australia.

🌐 **Live Site:** [https://peterslab-uq.github.io/Lab-Website/](https://peterslab-uq.github.io/Lab-Website/)

---

## Pages

| File | Description |
|---|---|
| `index.html` | Homepage — hero, about, research areas, ISVac, Mozzy mAbs, featured publications, contact |
| `team.html` | Team members (flip cards) and alumni carousel |
| `publications.html` | Searchable full publications database |
| `announcements.html` | News & Announcements page with category filters |

---

## Features

- **Responsive navigation** — hamburger menu on mobile, active-link highlighting
- **Hero section** — full-screen banner with lab branding
- **About & Research Areas** — overview cards with section-specific accent colours
- **ISVac & Mozzy mAbs** — dedicated product/project sections
- **Team flip cards** — front photo/name/role, back bio (scrollable)
- **Alumni carousel** — auto-scrolls every 3.5 s; pauses on hover/touch; prev/next buttons
- **Publications** — BibTeX → JSON pipeline, search + filter, featured section on homepage
- **News & Announcements** — filterable cards by category (All / News / New Paper / Grant / Award / Event)
- **Contact form** — powered by FormSubmit, sends to peterslabwebsite@gmail.com
- **SEO** — Open Graph, Twitter Card, JSON-LD structured data, sitemap.xml, robots.txt

---

## Colour Palette

| Variable | Hex | Usage |
|---|---|---|
| `--primary` | `#1F3A5F` | Navy — navbar, headings, footer |
| `--secondary` | `#4A6FA5` | Steel blue — secondary text, borders |
| `--accent` | `#4FB3A2` | Teal — highlights, buttons, card borders |
| `--background` | `#F7F9FC` | Off-white — page background |
| `--text` | `#1E1E1E` | Near-black — body text |

Section accent colours (Research Areas, announcement tags, etc.) are declared inline and include Oxford Navy, Pacific Cyan, Jungle Green, Dusty Mauve, and Vivid Orchid.

---

## Technologies

- **HTML5 / CSS3** — semantic markup, CSS custom properties, Flexbox, Grid, media queries, 3-D flip transforms
- **JavaScript (vanilla)** — scroll-reveal, card flips, hamburger menu, gallery slider, alumni auto-scroll, announcement filters
- **Font Awesome** — icons
- **Academicons** — academic/research icons
- **FormSubmit** — contact form backend (no server required)
- **Python** (`convert.py`) — BibTeX → JSON publication pipeline

---

## How to Update the News Section

The News & Announcements page lives in `announcements.html`.
Each announcement is a single `<div class="announcement_card">` block inside the `<div class="announcements_grid">` container.

### Step-by-step: Adding a New Announcement

1. Open `announcements.html` in a text editor.

2. Find the `<div class="announcements_grid">` section (search for `announcements_grid`).

3. Copy an existing card block. A card looks like this:

```html
<div class="announcement_card" data-category="news">
    <div class="announcement_tag tag_news">News</div>
    <div class="announcement_date">January 2026</div>
    <h3 class="announcement_title">Your Headline Here</h3>
    <p class="announcement_desc">
        A short description of the announcement goes here. Keep it to 1–3 sentences.
    </p>
</div>
```

4. Paste the copied block **above** any existing cards (newest first).

5. Update the following fields:

| Field | What to change |
|---|---|
| `data-category="..."` | Category keyword — see table below |
| `class="announcement_tag tag_..."` | Matching tag class — see table below |
| Tag text (e.g. `News`) | Display label shown on the card |
| `announcement_date` | Month and year, e.g. `June 2025` |
| `announcement_title` | Headline text |
| `announcement_desc` | 1–3 sentence description |

### Category Reference

| Category | `data-category` value | Tag class | Tag colour |
|---|---|---|---|
| General news | `news` | `tag_news` | Blue |
| New publication | `paper` | `tag_paper` | Green |
| Grant awarded | `grant` | `tag_grant` | Purple |
| Award / prize | `award` | `tag_award` | Gold |
| Event / conference | `event` | `tag_event` | Orange |

### Example: Adding a New Paper Announcement

```html
<div class="announcement_card" data-category="paper">
    <div class="announcement_tag tag_paper">New Paper</div>
    <div class="announcement_date">May 2026</div>
    <h3 class="announcement_title">New study published in PLOS Pathogens</h3>
    <p class="announcement_desc">
        Our latest research on flavivirus NS1 protein was published in PLOS Pathogens.
        Read the full article on the Publications page.
    </p>
</div>
```

6. Save the file.

7. Push to GitHub (see Deployment below) — the live site updates automatically.

### Editing or Removing an Announcement

- **Edit** — find the card by its title and update the relevant fields.
- **Remove** — delete the entire `<div class="announcement_card"> … </div>` block.

---

## How to Update Team Members

### Adding a Current Team Member

Edit `team.html` and add a new flip card inside the appropriate `team_grid` section:

```html
<div class="team_card_wrapper">
    <div class="team_card">
        <div class="team_card_front">
            <img src="Images/photo.jpg" alt="Full Name" class="team_photo">
            <h3 class="team_name">Full Name</h3>
            <p class="team_role">Role Title</p>
        </div>
        <div class="team_card_back">
            <p class="team_bio">Short bio text here.</p>
        </div>
    </div>
</div>
```

Place the member photo (square crop recommended, JPG/PNG) in the `Images/` folder.
If no photo is available, use `Images/Placeholder.png`.

### Adding an Alumni Member

Edit the alumni grid in `team.html` and add a card inside `<div id="alumniGrid">`:

```html
<div class="alumni_card">
    <img src="Images/photo.jpg" alt="Alumni Name" class="alumni_photo">
    <h3 class="alumni_name">Alumni Name</h3>
    <p class="alumni_years">2022–2024 (PhD Student)</p>
    <ul class="alumni_role"><li>Current Position, Institution</li></ul>
</div>
```

If no photo is available, use `src="Images/Placeholder.png"`.

---

## Publication Management

### Adding Publications

1. Edit `references.bib` with the new BibTeX entry:

```bibtex
@article{AuthorYear,
  title   = {Article Title},
  author  = {Author Name},
  journal = {Journal Name},
  year    = {2025},
  volume  = {10},
  pages   = {1--15},
  doi     = {10.xxxx/xxxxx}
}
```

2. Run the converter:

```bash
python convert.py
```

3. This updates `references.json` — publications appear automatically on the Publications page and in the Featured Publications section on the homepage.

---

## Deployment

The site is hosted on **GitHub Pages** from the `main` branch of the `peterslab-uq/Lab-Website` repository.

### Pushing changes

```bash
cd "/path/to/Lab Website"
git add .
git commit -m "Brief description of changes"
git push origin main
```

GitHub Pages rebuilds the site within ~1 minute of each push.

---

```
Lab Website/
├── index.html           # Homepage
├── team.html            # Team & alumni page
├── publications.html    # Full publications database
├── announcements.html   # News & announcements page
├── style.css            # All styles
├── script.js            # All JavaScript
├── sitemap.xml          # Search engine sitemap
├── robots.txt           # Search engine crawl rules
├── references.bib       # BibTeX publication database
├── references.json      # Converted publication database (auto-generated)
├── convert.py           # BibTeX → JSON converter
├── test_bib.py          # BibTeX testing utility
└── Images/              # Photos and image assets
    └── Placeholder.png  # Default photo for members without a photo
```

---

## Browser Support

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)
- iOS Safari, Chrome Mobile

---

## Contact & Support

For content questions, use the contact form on the website.
For technical issues, contact the repository maintainer.

---

© 2026 Peters Molecular Arbovirology Laboratory. All Rights Reserved.

*Last Updated: June 2026*
