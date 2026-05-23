/* =============================================
   AHMED ANANI — Portfolio JavaScript
   ============================================= */

// =============================================
// LOADER
// =============================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      document.body.style.overflow = 'visible';
      // Trigger hero animations after loader
      document.querySelectorAll('#hero .reveal-up, #hero .reveal-left, #hero .reveal-right')
        .forEach(el => el.classList.add('visible'));
    }
  }, 2400);
});

// =============================================
// CUSTOM CURSOR
// =============================================
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');

document.addEventListener('mousemove', e => {
  if (cursor) { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }
  if (cursorTrail) {
    cursorTrail.style.left = e.clientX + 'px';
    cursorTrail.style.top = e.clientY + 'px';
  }
});

// =============================================
// PARTICLE CANVAS
// =============================================
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - .5) * .3;
      this.vy = (Math.random() - .5) * .3;
      this.r = Math.random() * 1.5 + .5;
      this.alpha = Math.random() * .4 + .1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${.08 * (1 - dist / 120)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
})();

// =============================================
// TYPED TEXT EFFECT
// =============================================
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const lines = [
    'Front-End Developer',
    'BIS Graduate · Egypt',
    'UI/UX Enthusiast',
    'Team Leader',
  ];
  let li = 0, ci = 0, deleting = false;
  const DELAY_TYPE = 80, DELAY_DELETE = 45, DELAY_PAUSE = 1800;

  function type() {
    const current = lines[li];
    if (!deleting) {
      el.textContent = current.slice(0, ci++);
      if (ci > current.length) { deleting = true; setTimeout(type, DELAY_PAUSE); return; }
    } else {
      el.textContent = current.slice(0, ci--);
      if (ci < 0) { deleting = false; li = (li + 1) % lines.length; ci = 0; }
    }
    setTimeout(type, deleting ? DELAY_DELETE : DELAY_TYPE);
  }
  setTimeout(type, 800);
})();

// =============================================
// NAVBAR SCROLL BEHAVIOR
// =============================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  updateActiveNav();
  updateScrollTop();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

// =============================================
// MOBILE MENU
// =============================================
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
menuBtn?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  menuBtn.innerHTML = mobileMenu.classList.contains('hidden')
    ? '<i class="fas fa-bars"></i>'
    : '<i class="fas fa-times"></i>';
});
document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  });
});

// =============================================
// SCROLL REVEAL
// =============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger stat bars
      if (entry.target.classList.contains('stat-card')) {
        entry.target.querySelector('.stat-bar')?.style.setProperty('width', '100%');
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .stat-card')
  .forEach(el => revealObserver.observe(el));

// =============================================
// SKILL BARS ANIMATION
// =============================================
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const pct = bar.getAttribute('data-pct');
        bar.style.width = pct + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

// =============================================
// ANIMATED COUNTERS
// =============================================
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-number');
      nums.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const interval = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + '+';
          if (current >= target) clearInterval(interval);
        }, 40);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const aboutSection = document.getElementById('about');
if (aboutSection) counterObserver.observe(aboutSection);

// =============================================
// PROJECT FILTERING
// =============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      if (filter === 'all' || cat === filter) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity .4s ease, transform .4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// =============================================
// SCROLL TO TOP BUTTON
// =============================================
const scrollTopBtn = document.getElementById('scroll-top');
function updateScrollTop() {
  if (!scrollTopBtn) return;
  if (window.scrollY > 600) scrollTopBtn.classList.add('visible');
  else scrollTopBtn.classList.remove('visible');
}

// =============================================
// CONTACT FORM — SEND MESSAGE
// =============================================
async function sendMessage(e) {
  e.preventDefault();
  const btn = document.getElementById('send-btn');
  const form = document.getElementById('contactForm');
  const inputs = form.querySelectorAll('.form-input');

  // Basic validation
  let valid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      valid = false;
      input.style.borderColor = '#f87171';
      input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
    }
  });
  if (!valid) return;

  // Prepare data for Web3Forms
  const formData = new FormData(form);
  // 🔴 تنبيه: استبدل YOUR_ACCESS_KEY_HERE بالـ Access Key الخاص بك من موقع web3forms.com
  formData.append("access_key", "291a7ee1-92ca-4d16-8cfd-ac5c882bf85e");

  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2 text-xs"></i><span>SENDING...</span>';
  btn.disabled = true;

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      // Success state
      btn.innerHTML = '<i class="fas fa-check mr-2 text-xs"></i><span>MESSAGE SENT!</span>';
      btn.classList.add('btn-success');
      form.reset(); // Clear inputs
    } else {
      // API error
      btn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2 text-xs"></i><span>ERROR! TRY AGAIN</span>';
      console.error(data.message);
    }
  } catch (error) {
    // Network error
    btn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2 text-xs"></i><span>NETWORK ERROR</span>';
    console.error(error);
  } finally {
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane mr-2 text-xs"></i><span>SEND MESSAGE</span>';
      btn.classList.remove('btn-success');
      btn.disabled = false;
    }, 3000);
  }
}

// =============================================
// COPY EMAIL TO CLIPBOARD
// =============================================
function copyEmail(e, email) {
  e.preventDefault();
  
  const successCallback = () => {
    const el = e.currentTarget.querySelector('#email-text');
    if (!el) return;
    const originalText = el.textContent;
    el.textContent = 'Copied!';
    el.style.color = '#22c55e'; // success green
    
    setTimeout(() => {
      el.textContent = originalText;
      el.style.color = '';
    }, 2000);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(email).then(successCallback).catch(err => {
      console.error('Failed to copy: ', err);
    });
  } else {
    // Fallback for older browsers or non-secure contexts (like 127.0.0.1)
    let textArea = document.createElement("textarea");
    textArea.value = email;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      successCallback();
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    textArea.remove();
  }
}
