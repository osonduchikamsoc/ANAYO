/* ===================================================
   NINA HOTELS — MAIN JAVASCRIPT
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── AOS Init ── */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60 });
  }

  /* ── Navbar Scroll ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Hamburger Menu ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      document.body.appendChild(overlay);
    }

    const closeMenu = () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };
    const openMenu = () => {
      hamburger.classList.add('open');
      navLinks.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    hamburger.addEventListener('click', () => {
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });
    overlay.addEventListener('click', closeMenu);
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ── Hero Slider ── */
  const slides    = document.querySelectorAll('.hero .slide');
  const dotsWrap  = document.querySelector('.slider-dots');
  const prevBtn   = document.querySelector('.slider-prev');
  const nextBtn   = document.querySelector('.slider-next');

  if (slides.length > 0) {
    let current  = 0;
    let timer    = null;
    const dots   = [];

    if (dotsWrap) {
      slides.forEach((_, i) => {
        const d = document.createElement('span');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => { goTo(i); resetTimer(); });
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }

    function goTo(idx) {
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, 5500);
    }

    prevBtn?.addEventListener('click', () => { prev(); resetTimer(); });
    nextBtn?.addEventListener('click', () => { next(); resetTimer(); });

    resetTimer();
  }

  /* ── Scroll to Top ── */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Quick Booking Bar ── */
  const quickBtn = document.getElementById('quickSearchBtn');
  if (quickBtn) {
    quickBtn.addEventListener('click', (e) => {
      const checkIn  = document.getElementById('qCheckIn')?.value;
      const checkOut = document.getElementById('qCheckOut')?.value;
      const room     = document.getElementById('qRoom')?.value;
      const guests   = document.getElementById('qGuests')?.value;

      let url = 'booking.html?';
      if (checkIn)  url += `checkIn=${encodeURIComponent(checkIn)}&`;
      if (checkOut) url += `checkOut=${encodeURIComponent(checkOut)}&`;
      if (room)     url += `room=${encodeURIComponent(room)}&`;
      if (guests)   url += `guests=${encodeURIComponent(guests)}`;

      e.preventDefault();
      window.location.href = url;
    });
  }

  /* ── Gallery Lightbox ── */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.querySelector('img')?.src;
        if (src) {
          lightboxImg.src = src;
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };
    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ── Active Nav Link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Newsletter Form ── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input?.value) {
        showToast('Thank you for subscribing!');
        input.value = '';
      }
    });
  });

  /* ── Contact Form ── */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Message sent! We\'ll get back to you shortly.');
      contactForm.reset();
    });
  }

});

/* ── Toast Helper ── */
function showToast(msg, duration = 3500) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* Global toast style injection */
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  .toast {
    position: fixed;
    bottom: 30px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: #1e1e1e;
    border: 1px solid rgba(201,168,76,0.4);
    border-radius: 8px;
    padding: 14px 28px;
    font-size: 0.85rem;
    color: #fff;
    font-family: 'Poppins', sans-serif;
    z-index: 99999;
    opacity: 0;
    pointer-events: none;
    transition: all 0.4s ease;
    white-space: nowrap;
  }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto; }
`;
document.head.appendChild(toastStyle);
