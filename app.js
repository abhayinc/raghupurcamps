/**
 * RAGHUPUR FORT CAMPS & TREKS
 * Interactive Scripts & Canvas Starfield Simulation
 */

document.addEventListener('DOMContentLoaded', () => {
  initStarCanvases();
  initNavigation();
  initScrollHeader();
  initBookingForm();
  handleInitialHash();
});

/* ==========================================================================
   STARFIELD CANVAS SIMULATION
   Simulates realistic high-altitude night sky with twinkling stars
   ========================================================================== */
function initStarCanvases() {
  const canvasIds = [
    'star-canvas-serolsar',
    'star-canvas-camping',
    'star-canvas-fort',
    'star-canvas-jibhi',
    'star-canvas-plan'
  ];

  canvasIds.forEach(id => {
    const canvas = document.getElementById(id);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    let shootingStars = [];

    function resize() {
      const parent = canvas.parentElement;
      width = canvas.width = parent.offsetWidth;
      height = canvas.height = parent.offsetHeight;
      createStars();
    }

    function createStars() {
      stars = [];
      const count = Math.floor((width * height) / 3200); // Dynamic star density
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.3 + 0.3,
          baseAlpha: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.025 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          isWarm: Math.random() > 0.85 // occasional golden/warm star
        });
      }
    }

    function addShootingStar() {
      if (Math.random() < 0.015 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * (height * 0.4),
          length: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 6,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          opacity: 1
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Draw static / twinkling stars
      const time = Date.now() * 0.001;
      stars.forEach(star => {
        const alpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase) * 0.25;
        const clampedAlpha = Math.max(0.1, Math.min(1, alpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.isWarm
          ? `rgba(247, 185, 128, ${clampedAlpha})`
          : `rgba(235, 245, 255, ${clampedAlpha})`;
        ctx.fill();
      });

      // Draw shooting stars
      addShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, `rgba(255, 255, 255, ${s.opacity})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.02;

        if (s.opacity <= 0 || s.x > width || s.y > height) {
          shootingStars.splice(i, 1);
        }
      }

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
  });
}

/* ==========================================================================
   NAVIGATION & TAB SYSTEM
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const closeDrawer = document.getElementById('close-drawer');
  const drawer = document.getElementById('mobile-drawer');

  if (mobileToggle && drawer) {
    mobileToggle.addEventListener('click', () => {
      drawer.classList.add('open');
    });
  }

  if (closeDrawer && drawer) {
    closeDrawer.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  }

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'serolsar';
    switchTab(hash, false);
  });
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) {
    drawer.classList.remove('open');
  }
}

function switchTab(tabId, updateHash = true) {
  const validTabs = ['serolsar', 'camping', 'fort-trek', 'jibhi-tirthan', 'plan-trip'];
  if (!validTabs.includes(tabId)) {
    tabId = 'serolsar';
  }

  // Update Panes
  const panes = document.querySelectorAll('.tab-pane');
  panes.forEach(pane => {
    pane.classList.remove('active');
  });

  const targetPane = document.getElementById(`pane-${tabId}`);
  if (targetPane) {
    targetPane.classList.add('active');
  }

  // Update Nav Links
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');
  navLinks.forEach(link => {
    if (link.getAttribute('data-tab') === tabId || link.getAttribute('href') === `#${tabId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  if (updateHash) {
    history.pushState(null, null, `#${tabId}`);
  }

  // Scroll smoothly to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleInitialHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    switchTab(hash, false);
  }
}

/* ==========================================================================
   STICKY SCROLLED HEADER
   ========================================================================== */
function initScrollHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function toggleFaq(headerElement) {
  const item = headerElement.parentElement;
  const wasOpen = item.classList.contains('open');

  // Close other open items
  const allItems = document.querySelectorAll('.accordion-item');
  allItems.forEach(i => i.classList.remove('open'));

  // Toggle current item
  if (!wasOpen) {
    item.classList.add('open');
  }
}

/* ==========================================================================
   BOOKING MODAL & WHATSAPP GENERATOR
   ========================================================================== */
function openBookingModal(defaultPackage = 'Serolsar + Raghupur Combo 2D1N') {
  const modal = document.getElementById('booking-modal');
  const packageSelect = document.getElementById('form-package');

  if (packageSelect) {
    // Find closest matching option or set value
    for (let i = 0; i < packageSelect.options.length; i++) {
      if (packageSelect.options[i].text.toLowerCase().includes(defaultPackage.toLowerCase()) ||
          defaultPackage.toLowerCase().includes(packageSelect.options[i].value.toLowerCase())) {
        packageSelect.selectedIndex = i;
        break;
      }
    }
  }

  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close modal on click outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('booking-modal');
  if (e.target === modal) {
    closeBookingModal();
  }
});

function initBookingForm() {
  // Set default minimum date to tomorrow
  const dateInput = document.getElementById('form-date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }
}

function handleBookingSubmit(event) {
  event.preventDefault();

  const pkg = document.getElementById('form-package').value;
  const name = document.getElementById('form-name').value.trim();
  const phone = document.getElementById('form-phone').value.trim();
  const date = document.getElementById('form-date').value;
  const guests = document.getElementById('form-guests').value;
  const notes = document.getElementById('form-notes').value.trim();

  // Create WhatsApp pre-filled message
  const message = 
`Hello Raghupur Fort Camps! 🏔️⛺
I would like to book / inquire about:
*Experience:* ${pkg}
*Traveler Name:* ${name}
*Phone / WhatsApp:* ${phone}
*Estimated Date:* ${date}
*Guests:* ${guests}
${notes ? `*Special Requests:* ${notes}` : ''}

Looking forward to your confirmation and itinerary details!`;

  const encoded = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/917018736861?text=${encoded}`;

  closeBookingModal();
  window.open(whatsappUrl, '_blank');
}
