/* Peters Lab — redesign scripts.
   Deliberately small: the redesign's responsive behaviour lives in CSS media
   queries, so this file only covers behaviour CSS cannot express.
   Each init bails early if its markup is absent, so one file serves all pages. */

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initFeaturedPublications();
  initMemberCards();
  initAlumniRail();
  initPublicationsPage();
  initNewsFilter();
});

/* --------------------------------------------------------------------------
   Mobile menu — class names match the existing site
   -------------------------------------------------------------------------- */

function initMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('show');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('show');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   Shared publication helpers
   NOTE: references.json is generated from references.bib by convert.py —
   edit the .bib, never the .json.
   -------------------------------------------------------------------------- */

function isPrincipalInvestigator(author) {
  return /Hobson-Peters/.test(author)
    || /^Hall,\s*Roy/.test(author)
    || /^Hall,\s*R[.\s]/.test(author);
}

/* "Hobson-Peters, Jody" -> "Hobson-Peters J"; PIs are marked for emphasis. */
function formatAuthors(authorStr) {
  if (!authorStr) return [{ name: 'Unknown', pi: false }];
  return authorStr.split(' and ').map(raw => {
    const author = raw.trim();
    const parts = author.split(',').map(p => p.trim());
    let name = author;
    if (parts.length >= 2) {
      const initials = parts[1].split(/\s+/).map(n => n.charAt(0).toUpperCase()).join('');
      name = parts[0] + ' ' + initials;
    }
    return { name, pi: isPrincipalInvestigator(author) };
  });
}

function sourceLine(entry) {
  const base = [entry.journal, entry.volume].filter(Boolean).join(', ');
  const pages = entry.pages ? ' pp. ' + entry.pages : '';
  return (base + pages).trim() || entry.publisher || '';
}

/* bioRxiv/medRxiv DOIs are all 10.1101; openRxiv is the posting publisher */
function isPreprint(entry) {
  return /^10\.1101\//.test(entry.doi || '')
    || /openrxiv|biorxiv|medrxiv/i.test(entry.publisher || '');
}

function buildPublicationCard(entry, withPreprintTag) {
  const card = document.createElement('article');
  card.className = 'pub_card';

  if (withPreprintTag) {
    const flags = document.createElement('div');
    flags.className = 'pub_flags';
    const year = document.createElement('p');
    year.className = 'pub_year';
    year.textContent = entry.year || 'N/A';
    flags.appendChild(year);
    if (isPreprint(entry)) {
      const tag = document.createElement('span');
      tag.className = 'preprint_tag';
      tag.textContent = 'Preprint';
      flags.appendChild(tag);
    }
    card.appendChild(flags);
  } else {
    const year = document.createElement('p');
    year.className = 'pub_year';
    year.textContent = entry.year || 'N/A';
    card.appendChild(year);
  }

  const title = document.createElement('h3');
  title.textContent = entry.title || 'Untitled';
  card.appendChild(title);

  const authors = document.createElement('p');
  authors.className = 'pub_authors';
  formatAuthors(entry.author).forEach((author, i, all) => {
    const span = document.createElement('span');
    if (author.pi) span.className = 'pi';
    span.textContent = author.name;
    authors.appendChild(span);
    if (i < all.length - 1) authors.appendChild(document.createTextNode(', '));
  });
  card.appendChild(authors);

  const source = sourceLine(entry);
  if (source) {
    const src = document.createElement('p');
    src.className = 'pub_source';
    src.textContent = source;
    card.appendChild(src);
  }

  if (entry.doi) {
    const doi = document.createElement('a');
    doi.className = 'pub_doi';
    doi.href = 'https://doi.org/' + entry.doi;
    doi.target = '_blank';
    doi.rel = 'noopener noreferrer';
    doi.textContent = 'DOI: ' + entry.doi;
    card.appendChild(doi);
  }

  return card;
}

function loadReferences() {
  return fetch('references.json').then(response => {
    if (!response.ok) throw new Error('references.json ' + response.status);
    return response.json();
  });
}

/* --------------------------------------------------------------------------
   Homepage — three featured papers
   -------------------------------------------------------------------------- */

const FEATURED_TITLES = [
  'Serum-Free Suspension Culture of the Aedes albopictus C6/36 Cell Line for Chimeric Orthoflavivirus Vaccine Production',
  'Unleashing Nature\u2019s Allies: Comparing the Vertical Transmission Dynamics of Insect-Specific and Vertebrate-Infecting Flaviviruses in Mosquitoes',
  'A chimeric vaccine derived from Australian genotype IV Japanese encephalitis virus protects mice from lethal challenge'
];

function initFeaturedPublications() {
  const grid = document.getElementById('featuredPublications');
  if (!grid) return;

  loadReferences()
    .then(entries => {
      const featured = FEATURED_TITLES
        .map(title => entries.find(e => e.title === title))
        .filter(Boolean);
      if (!featured.length) throw new Error('no featured entries matched');
      grid.textContent = '';
      featured.forEach(entry => grid.appendChild(buildPublicationCard(entry, false)));
    })
    .catch(() => {
      grid.textContent = '';
      const note = document.createElement('p');
      note.className = 'pub_fallback';
      note.textContent = 'Publications could not be loaded.';
      grid.appendChild(note);
    });
}

/* --------------------------------------------------------------------------
   People — flip cards. A click inside a link opens the link instead.
   -------------------------------------------------------------------------- */

function initMemberCards() {
  const cards = document.querySelectorAll('.member_card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', event => {
      if (event.target.closest('a')) return;
      card.classList.toggle('flipped');
    });
    card.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target.closest('a')) return;
      event.preventDefault();
      card.classList.toggle('flipped');
    });
  });
}

/* --------------------------------------------------------------------------
   People — alumni rail. Cloned card sets give continuous scroll in both
   directions; ported from the existing site's script.js.
   -------------------------------------------------------------------------- */

function initAlumniRail() {
  const rail = document.getElementById('alumniRail');
  const prev = document.getElementById('alumniPrev');
  const next = document.getElementById('alumniNext');
  if (!rail || !prev || !next) return;

  const originals = [...rail.querySelectorAll('.alumni_card')];
  if (!originals.length) return;

  const styles = getComputedStyle(rail);
  const gap = parseFloat(styles.gap) || 22;
  const step = (originals[0].offsetWidth || 244) + gap;
  const setWidth = originals.length * step;
  let animating = false;
  let timer = null;

  for (let i = 0; i < 3; i++) {
    originals.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      rail.appendChild(clone);
    });
    [...originals].reverse().forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      rail.insertBefore(clone, rail.firstChild);
    });
  }

  rail.style.scrollBehavior = 'auto';
  rail.scrollLeft = setWidth * 3;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function scrollBy(amount) {
    if (animating) return;
    animating = true;
    const start = rail.scrollLeft;
    const startTime = performance.now();

    function frame(now) {
      const progress = Math.min((now - startTime) / 500, 1);
      rail.scrollLeft = start + amount * easeInOutCubic(progress);
      if (progress < 1) {
        requestAnimationFrame(frame);
        return;
      }
      // silently reposition near the edges so scrolling never runs out
      const pos = rail.scrollLeft;
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      if (pos < setWidth * 1.5) rail.scrollLeft = pos + setWidth * 2;
      else if (pos > maxScroll - setWidth * 1.5) rail.scrollLeft = pos - setWidth * 2;
      animating = false;
    }

    requestAnimationFrame(frame);
  }

  function play() { timer = setInterval(() => scrollBy(step), 3500); }
  function pause() { clearInterval(timer); }

  prev.addEventListener('click', () => scrollBy(-step));
  next.addEventListener('click', () => scrollBy(step));

  rail.addEventListener('mouseenter', pause);
  rail.addEventListener('mouseleave', play);
  rail.addEventListener('touchstart', pause, { passive: true });
  rail.addEventListener('touchend', play);

  play();
}

/* --------------------------------------------------------------------------
   Publications page — year groups, text filter, year chips
   -------------------------------------------------------------------------- */

function initPublicationsPage() {
  const list = document.getElementById('publicationList');
  if (!list) return;

  const search = document.getElementById('pubSearch');
  const chipRow = document.getElementById('yearChips');
  const countLabel = document.getElementById('pubCount');
  const lede = document.getElementById('pubLede');

  let entries = [];
  let query = '';
  let year = null;

  function matchesQuery(entry) {
    if (!query) return true;
    return [entry.title, entry.author, entry.journal, entry.year]
      .filter(Boolean).join(' ').toLowerCase().includes(query);
  }

  function render() {
    const searched = entries.filter(matchesQuery);
    const shown = year ? searched.filter(e => String(e.year) === year) : searched;

    // chip counts follow the text query, so a year that would return nothing
    // is disabled rather than silently empty
    const perYear = {};
    searched.forEach(e => {
      const key = String(e.year || 'Undated');
      perYear[key] = (perYear[key] || 0) + 1;
    });

    chipRow.querySelectorAll('.chip').forEach(chip => {
      const value = chip.dataset.year || null;
      const active = value === year;
      chip.classList.toggle('active', value ? active : !year);
      if (!value) return;
      const n = perYear[value] || 0;
      chip.disabled = n === 0 && !active;
      chip.title = n + (n === 1 ? ' paper' : ' papers');
    });

    countLabel.textContent = (query || year)
      ? shown.length + ' of ' + entries.length
      : entries.length + ' publications';

    const byYear = {};
    shown.forEach(e => {
      const key = String(e.year || 'Undated');
      (byYear[key] = byYear[key] || []).push(e);
    });

    const years = Object.keys(byYear).sort((a, b) => {
      if (a === 'Undated') return 1;
      if (b === 'Undated') return -1;
      return Number(b) - Number(a);
    });

    list.textContent = '';

    if (!years.length) {
      const note = document.createElement('p');
      note.className = 'empty_note';
      note.textContent = 'No publications match that search.';
      list.appendChild(note);
      return;
    }

    years.forEach(key => {
      const group = document.createElement('div');
      group.className = 'year_group';

      const head = document.createElement('div');
      head.className = 'year_head';
      const heading = document.createElement('h2');
      heading.textContent = key;
      const spacer = document.createElement('span');
      spacer.className = 'spacer';
      const count = document.createElement('span');
      count.className = 'count';
      count.textContent = byYear[key].length + (byYear[key].length === 1 ? ' paper' : ' papers');
      head.append(heading, spacer, count);

      const grid = document.createElement('div');
      grid.className = 'pub_grid pub_list';
      byYear[key].forEach(entry => grid.appendChild(buildPublicationCard(entry, true)));

      group.append(head, grid);
      list.appendChild(group);
    });
  }

  function buildChips() {
    const all = [...new Set(entries.map(e => String(e.year || 'Undated')))].sort((a, b) => {
      if (a === 'Undated') return 1;
      if (b === 'Undated') return -1;
      return Number(b) - Number(a);
    });

    chipRow.textContent = '';

    const allChip = document.createElement('button');
    allChip.type = 'button';
    allChip.className = 'chip active';
    allChip.textContent = 'All years';
    allChip.addEventListener('click', () => { year = null; render(); });
    chipRow.appendChild(allChip);

    all.forEach(value => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.dataset.year = value;
      chip.textContent = value;
      chip.addEventListener('click', () => {
        year = year === value ? null : value;
        render();
      });
      chipRow.appendChild(chip);
    });
  }

  if (search) {
    search.addEventListener('input', event => {
      query = event.target.value.trim().toLowerCase();
      render();
    });
  }

  loadReferences()
    .then(data => {
      entries = data;
      buildChips();
      render();
    })
    .catch(() => {
      list.textContent = '';
      const note = document.createElement('p');
      note.className = 'empty_note';
      note.textContent = 'Publications could not be loaded.';
      list.appendChild(note);
      if (lede) lede.textContent = 'A complete list of papers from the laboratory from 2007-now.';
    });
}

/* --------------------------------------------------------------------------
   News page — category filter over static cards
   -------------------------------------------------------------------------- */

function initNewsFilter() {
  const chipRow = document.getElementById('newsChips');
  const list = document.getElementById('newsList');
  if (!chipRow || !list) return;

  const cards = [...list.querySelectorAll('.news_card')];
  const empty = document.getElementById('newsEmpty');

  const counts = {};
  cards.forEach(card => {
    const key = card.dataset.cat;
    counts[key] = (counts[key] || 0) + 1;
  });

  chipRow.querySelectorAll('.chip').forEach(chip => {
    const value = chip.dataset.cat || null;
    if (value) {
      const n = counts[value] || 0;
      chip.disabled = n === 0;
      chip.title = n + (n === 1 ? ' announcement' : ' announcements');
    } else {
      chip.title = cards.length + ' announcements';
    }
  });

  function apply(value) {
    chipRow.querySelectorAll('.chip').forEach(chip => {
      chip.classList.toggle('active', (chip.dataset.cat || null) === value);
    });
    let shown = 0;
    cards.forEach(card => {
      const visible = !value || card.dataset.cat === value;
      card.hidden = !visible;
      if (visible) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  }

  chipRow.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (chip.disabled) return;
      apply(chip.dataset.cat || null);
    });
  });

  apply(null);
}
