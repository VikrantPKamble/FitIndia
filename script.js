// script.js — FitHub interactive features

// Utility: safe query
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* Update copyright years on all pages */
(function updateYears(){
  const y = new Date().getFullYear();
  const el1 = document.getElementById('year');
  const el2 = document.getElementById('year-2');
  const el3 = document.getElementById('year-3');
  if(el1) el1.textContent = y;
  if(el2) el2.textContent = y;
  if(el3) el3.textContent = y;
})();

/* NAVIGATION (hamburger) */
(function navigationToggle(){
  // multiple pages include elements with same id; attach to all toggles
  const toggles = document.querySelectorAll('#nav-toggle');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const header = btn.closest('.header-inner');
      // find nav-list in header
      const navList = header.querySelector('.nav-list');
      if(!navList) return;
      navList.classList.toggle('show');
      // toggle aria-expanded for accessibility
      const expanded = navList.classList.contains('show');
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    const openNav = document.querySelector('.nav-list.show');
    if(!openNav) return;
    const isInside = e.target.closest('.header-inner');
    if(!isInside){
      openNav.classList.remove('show');
    }
  });

  // Ensure nav hides when resizing to desktop
  window.addEventListener('resize', () => {
    if(window.innerWidth > 700){
      document.querySelectorAll('.nav-list').forEach(n => n.classList.remove('show'));
    }
  });
})();

/* Smooth scroll for "Get Started" button on index.html */
(function smoothGetStarted(){
  const gs = document.getElementById('get-started');
  if(!gs) return;
  gs.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(gs.getAttribute('href'));
    if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
  });
})();

/* EXERCISE FILTER + SEARCH */
(function exerciseFilter(){
  const grid = document.getElementById('exercise-grid');
  if(!grid) return; // not on this page

  const cards = $$('.exercise-card', grid);
  const buttons = $$('.filter-btn');
  const search = document.getElementById('exercise-search');

  // helper to set active button
  function setActiveButton(targetBtn){
    buttons.forEach(b => b.classList.remove('active'));
    if(targetBtn) targetBtn.classList.add('active');
  }

  // filter function
  function applyFilter(){
    const activeBtn = buttons.find(b => b.classList.contains('active'));
    const muscle = activeBtn ? activeBtn.getAttribute('data-muscle') : 'all';
    const query = (search && search.value) ? search.value.trim().toLowerCase() : '';

    cards.forEach(card => {
      const cardMuscle = (card.getAttribute('data-muscle') || '').toLowerCase();
      const name = (card.querySelector('.ex-name')?.textContent || '').toLowerCase();
      const steps = (card.querySelector('.ex-steps')?.textContent || '').toLowerCase();
      let matchMuscle = (muscle === 'all') || cardMuscle.includes(muscle);
      let matchQuery = !query || name.includes(query) || steps.includes(query) || cardMuscle.includes(query);

      if(matchMuscle && matchQuery){
        card.style.display = ''; // show
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Attach events to filter buttons
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      setActiveButton(btn);
      applyFilter();
    });
  });

  // Attach search input listener (debounced)
  if(search){
    let to;
    search.addEventListener('input', () => {
      clearTimeout(to);
      to = setTimeout(() => applyFilter(), 180);
    });
  }

  // initial
  applyFilter();
})();

/* DIETS: Accordion behavior */
(function dietAccordions(){
  const accordion = document.getElementById('diet-accordion');
  if(!accordion) return;
  const items = $$('.accordion-item', accordion);
  items.forEach(item => {
    const btn = $('.accordion-toggle', item);
    const panel = $('.accordion-panel', item);
    if(!btn || !panel) return;

    // Expand/collapse
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // Collapse all items first (accordion behavior)
      items.forEach(it => {
        const b = $('.accordion-toggle', it);
        const p = $('.accordion-panel', it);
        if(b) b.setAttribute('aria-expanded', 'false');
        if(p) p.style.display = 'none';
      });

      if(!expanded){
        btn.setAttribute('aria-expanded','true');
        panel.style.display = 'block';
        panel.scrollIntoView({behavior:'smooth', block:'nearest'});
      } else {
        btn.setAttribute('aria-expanded','false');
        panel.style.display = 'none';
      }
    });
  });
})();
