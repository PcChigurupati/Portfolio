document.documentElement.classList.add('motion-ready');

/* =========================================================
   NAVIGATION
   ========================================================= */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  const open = navLinks?.classList.toggle('open') ?? false;
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('open');
    navToggle?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

/* =========================================================
   REVEAL + ACTIVE NAV SECTION
   ========================================================= */
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = entry.target.dataset.delay || 0;
      entry.target.style.setProperty('--delay', `${delay}ms`);
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold:0.12 });

  revealItems.forEach(item => revealObserver.observe(item));

  const sections = [...document.querySelectorAll('main section[id]')];
  const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin:'-35% 0px -55% 0px', threshold:0 });

  sections.forEach(section => sectionObserver.observe(section));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

/* =========================================================
   PUBLICATIONS
   ========================================================= */
const togglePubs = document.getElementById('toggle-publications');
const pubList = document.getElementById('publication-list');

togglePubs?.addEventListener('click', () => {
  if (!pubList) return;
  const expanded = pubList.classList.toggle('expanded');
  togglePubs.textContent = expanded ? 'Show fewer publications' : 'Show all publications';
});

/* =========================================================
   CURSOR GLOW
   ========================================================= */
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', event => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    cursorGlow.classList.add('active');
  }, { passive:true });
}

/* =========================================================
   ENGINEERING GALLERY

   Keep your known media paths here. If a listed file does not exist,
   its tile is automatically removed after the browser reports the error.
   ========================================================= */
const galleries = {
  printing: {
    kicker:'01 / FABRICATION',
    title:'Additive Manufacturing',
    items:[
      'assets/images/works/3d-printing/01.JPEG',
      'assets/images/works/3d-printing/02.JPEG',
      'assets/images/works/3d-printing/03.JPEG',
      'assets/images/works/3d-printing/04.JPEG',
      'assets/images/works/3d-printing/05.JPEG',
      'assets/images/works/3d-printing/06.JPEG',
      'assets/images/works/3d-printing/07.JPEG',
      'assets/images/works/3d-printing/08.JPEG',
      'assets/images/works/3d-printing/09.JPEG',
      {
        video:'assets/images/works/3d-printing/video-01.MOV',
        poster:'assets/images/works/3d-printing/video-01-poster.JPEG'
      }
    ]
  },

  testing: {
    kicker:'02 / VALIDATION',
    title:'Mechanical Testing',
    items:[
      'assets/images/works/testing/01.JPEG',
      'assets/images/works/testing/02.JPEG',
      'assets/images/works/testing/03.JPEG',
      'assets/images/works/testing/04.JPEG',
      'assets/images/works/testing/05.JPEG',
      'assets/images/works/testing/06.JPEG'
    ]
  },

  ndt: {
    kicker:'03 / INSPECTION',
    title:'NDT & Process Monitoring',
    items:[
      'assets/images/works/ndt/01.png',
      'assets/images/works/ndt/02.jpg',
      'assets/images/works/ndt/03.jpg',
        {
        video:'assets/images/works/ndt/video-01.MOV',
        poster:'assets/images/works/ndt/video-01-poster.JPEG'
      }
    ]
  }
};

const galleryModal = document.getElementById('gallery-modal');
const galleryTitle = document.getElementById('modal-title');
const galleryKicker = document.getElementById('modal-kicker');
const galleryCount = document.getElementById('modal-count');
const galleryGrid = document.getElementById('modal-grid');

let activeGalleryKey = null;

function refreshGalleryCount() {
  if (!galleryCount || !galleryGrid) return;
  const visible = [...galleryGrid.children].filter(cell => !cell.classList.contains('is-unavailable'));
  const imageCount = visible.filter(cell => !cell.classList.contains('modal-media--video')).length;
  const videoCount = visible.length - imageCount;

  const parts = [];
  if (imageCount) parts.push(`${imageCount} IMAGE${imageCount === 1 ? '' : 'S'}`);
  if (videoCount) parts.push(`${videoCount} VIDEO${videoCount === 1 ? '' : 'S'}`);
  galleryCount.textContent = parts.join(' · ');
}

function markUnavailable(cell) {
  cell.classList.add('is-unavailable');
  window.setTimeout(() => {
    cell.remove();
    refreshGalleryCount();
  }, 0);
}

function closeGallery() {
  if (!galleryModal || !galleryGrid) return;
  galleryModal.classList.remove('open');
  galleryModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  galleryGrid.querySelectorAll('video').forEach(video => video.pause());
  activeGalleryKey = null;
}

function openGallery(key) {
  const gallery = galleries[key];
  if (!gallery || !galleryModal || !galleryGrid) return;

  activeGalleryKey = key;
  if (galleryTitle) galleryTitle.textContent = gallery.title;
  if (galleryKicker) galleryKicker.textContent = gallery.kicker;
  if (galleryCount) galleryCount.textContent = 'LOADING MEDIA…';
  galleryGrid.innerHTML = '';

  gallery.items.forEach((item, index) => {
    const cell = document.createElement('div');
    cell.className = 'modal-media';

    if (typeof item === 'string') {
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'gallery-preview-trigger';
      trigger.dataset.previewSrc = item;
      trigger.dataset.previewAlt = `${gallery.title} image ${index + 1}`;
      trigger.dataset.previewLabel = `${gallery.title.toUpperCase()} · IMAGE ${String(index + 1).padStart(2, '0')}`;
      trigger.setAttribute('aria-label', `Preview ${gallery.title} image ${index + 1}`);

      const img = document.createElement('img');
      img.src = item;
      img.alt = `${gallery.title} work ${index + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('error', () => markUnavailable(cell), { once:true });

      trigger.appendChild(img);
      cell.appendChild(trigger);
    } else if (item?.video) {
      cell.classList.add('modal-media--video');
      const video = document.createElement('video');
      video.src = item.video;
      if (item.poster) video.poster = item.poster;
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('aria-label', `${gallery.title} video`);
      video.addEventListener('error', () => markUnavailable(cell), { once:true });
      cell.appendChild(video);
    }

    galleryGrid.appendChild(cell);
  });

  refreshGalleryCount();
  galleryModal.classList.add('open');
  galleryModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

document.querySelectorAll('[data-gallery]').forEach(button => {
  button.addEventListener('click', () => openGallery(button.dataset.gallery));
});

document.querySelector('.modal-close')?.addEventListener('click', closeGallery);
document.querySelector('.modal-backdrop')?.addEventListener('click', closeGallery);

/* =========================================================
   SHARED FULL-SCREEN IMAGE PREVIEW
   Used by both project images and Engineering Gallery images.
   ========================================================= */
const imagePreviewModal = document.getElementById('image-preview-modal');
const imagePreviewFull = document.getElementById('image-preview-full');
const imagePreviewLabel = document.getElementById('image-preview-label');

function openImagePreview(src, alt = 'Image preview', label = 'IMAGE PREVIEW') {
  if (!imagePreviewModal || !imagePreviewFull || !src) return;

  imagePreviewFull.src = src;
  imagePreviewFull.alt = alt;
  if (imagePreviewLabel) imagePreviewLabel.textContent = label;

  imagePreviewModal.classList.add('open');
  imagePreviewModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('image-preview-open');
}

function closeImagePreview() {
  if (!imagePreviewModal || !imagePreviewFull) return;

  imagePreviewModal.classList.remove('open');
  imagePreviewModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('image-preview-open');

  window.setTimeout(() => {
    if (!imagePreviewModal.classList.contains('open')) {
      imagePreviewFull.removeAttribute('src');
      imagePreviewFull.alt = '';
      if (imagePreviewLabel) imagePreviewLabel.textContent = 'IMAGE PREVIEW';
    }
  }, 220);
}

document.addEventListener('click', event => {
  const projectButton = event.target.closest('.project-preview-btn');
  if (projectButton) {
    event.preventDefault();
    event.stopPropagation();
    openImagePreview(
      projectButton.dataset.previewSrc,
      projectButton.dataset.previewAlt || 'Project image preview',
      'PROJECT IMAGE PREVIEW'
    );
    return;
  }

  const galleryButton = event.target.closest('.gallery-preview-trigger');
  if (galleryButton) {
    event.preventDefault();
    event.stopPropagation();
    openImagePreview(
      galleryButton.dataset.previewSrc,
      galleryButton.dataset.previewAlt || 'Gallery image preview',
      galleryButton.dataset.previewLabel || 'GALLERY IMAGE PREVIEW'
    );
    return;
  }

  if (
    event.target.closest('.image-preview-close') ||
    event.target.closest('.image-preview-backdrop')
  ) {
    closeImagePreview();
  }
});

/* Escape closes only the top-most open layer. */
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;

  if (imagePreviewModal?.classList.contains('open')) {
    closeImagePreview();
    return;
  }

  if (galleryModal?.classList.contains('open')) {
    closeGallery();
  }
});

/* =========================================================
   PC / BRAND — BACK TO TOP
   ========================================================= */
document.querySelectorAll('[data-scroll-top="true"]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top:0, left:0, behavior:'smooth' });
    navLinks?.classList.remove('open');
    navToggle?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

/* =========================================================
   REPELLING HERO CHIPS
   ========================================================= */
if (window.matchMedia('(pointer:fine)').matches) {
  const repelItems = [...document.querySelectorAll('[data-repel="true"]')];

  const resetRepel = item => {
    item.style.setProperty('--repel-x', '0px');
    item.style.setProperty('--repel-y', '0px');
    item.classList.remove('is-repelled');
  };

  window.addEventListener('pointermove', event => {
    repelItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - event.clientX;
      const dy = cy - event.clientY;
      const distance = Math.hypot(dx, dy);
      const radius = 180;
      const maxShift = 34;

      if (distance > 0 && distance < radius) {
        const force = 1 - distance / radius;
        item.style.setProperty('--repel-x', `${((dx / distance) * force * maxShift).toFixed(1)}px`);
        item.style.setProperty('--repel-y', `${((dy / distance) * force * maxShift).toFixed(1)}px`);
        item.classList.add('is-repelled');
      } else {
        resetRepel(item);
      }
    });
  }, { passive:true });

  document.documentElement.addEventListener('mouseleave', () => {
    repelItems.forEach(resetRepel);
  });
}
