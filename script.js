const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      entry.target.style.setProperty('--delay', `${delay}ms`);
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach(item => revealObserver.observe(item));

const sections = [...document.querySelectorAll('main section[id]')];
const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

const togglePubs = document.getElementById('toggle-publications');
const pubList = document.getElementById('publication-list');
togglePubs?.addEventListener('click', () => {
  const expanded = pubList.classList.toggle('expanded');
  togglePubs.textContent = expanded ? 'Show fewer publications' : 'Show all publications';
});

const cursorGlow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', e => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

const galleries = {
  printing: {
    kicker: '01 / FABRICATION',
    title: 'Additive Manufacturing',
    items: [
      'assets/images/works/3d-printing/01.JPEG',
      'assets/images/works/3d-printing/02.JPEG',
      'assets/images/works/3d-printing/03.JPEG',
      'assets/images/works/3d-printing/04.JPEG',
      'assets/images/works/3d-printing/05.JPEG',
      'assets/images/works/3d-printing/06.JPEG',
      'assets/images/works/3d-printing/07.JPEG',
      'assets/images/works/3d-printing/08.JPEG',
      'assets/images/works/3d-printing/09.JPEG',
      { video: 'assets/images/works/3d-printing/video-01.MOV', poster: 'assets/images/works/3d-printing/video-01-poster.JPEG' }
    ]
  },
  testing: {
    kicker: '02 / VALIDATION',
    title: 'Mechanical Testing',
    items: [
      'assets/images/works/testing/01.JPEG',
      'assets/images/works/testing/02.JPEG',
      'assets/images/works/testing/03.JPEG',
      'assets/images/works/testing/04.JPEG',
      'assets/images/works/testing/05.JPEG',
      'assets/images/works/testing/06.JPEG'
    ]
  },
  ndt: {
    kicker: '03 / INSPECTION',
    title: 'NDT & Process Monitoring',
    items: [
      'assets/images/works/ndt/01.JPEG',
      'assets/images/works/ndt/02.JPEG',
      'assets/images/works/ndt/03.JPEG',
      'assets/images/works/ndt/04.JPEG',
      'assets/images/works/ndt/05.JPEG',
      'assets/images/works/ndt/06.JPEG',
      { video: 'assets/images/works/ndt/video-01.MOV', poster: 'assets/images/works/ndt/video-01-poster.JPEG' }
    ]
  }
};

const modal = document.getElementById('gallery-modal');
const modalTitle = document.getElementById('modal-title');
const modalKicker = document.getElementById('modal-kicker');
const modalGrid = document.getElementById('modal-grid');

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  modalGrid.querySelectorAll('video').forEach(v => v.pause());
}

function openGallery(key) {
  const gallery = galleries[key];
  if (!gallery) return;
  modalTitle.textContent = gallery.title;
  modalKicker.textContent = gallery.kicker;
  modalGrid.innerHTML = '';

  gallery.items.forEach(item => {
    const cell = document.createElement('div');
    cell.className = 'modal-media';
    if (typeof item === 'string') {
      const img = document.createElement('img');
      img.src = item;
      img.alt = `${gallery.title} work`;
      img.loading = 'lazy';
      cell.appendChild(img);
    } else {
      const video = document.createElement('video');
      video.src = item.video;
      video.poster = item.poster;
      video.controls = true;
      video.preload = 'metadata';
      cell.appendChild(video);
    }
    modalGrid.appendChild(cell);
  });

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

document.querySelectorAll('[data-gallery]').forEach(button => {
  button.addEventListener('click', () => openGallery(button.dataset.gallery));
});

document.querySelector('.modal-close')?.addEventListener('click', closeModal);
document.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});
