/* ═══════════════════════════════════════════════════════════
   ZIYANKHAN PATHAN — Portfolio JavaScript
   Loading animation, particle background, scroll reveals,
   navbar behaviour, typing effect.
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. LOADING SCREEN — Terminal Boot Sequence ── */
  const terminal = document.getElementById('loader-terminal');
  const loader  = document.getElementById('loader');
  
  if (terminal && loader) {
    const bootSequence = [
      "[OK] Initializing core modules...",
      "[OK] Loading user preferences...",
      "[OK] Mounting neural network weights...",
      "[WARN] High packet loss detected. Rerouting...",
      "[OK] Connection established.",
      "[OK] Compiling UI assets...",
      "Access granted. Welcome, Ziyankhan."
    ];

    let lineIndex = 0;

    function printLine() {
      if (lineIndex < bootSequence.length) {
        const line = document.createElement('div');
        line.className = 'loader-line';
        if (bootSequence[lineIndex].includes('[WARN]')) line.classList.add('warning');
        line.textContent = bootSequence[lineIndex];
        terminal.appendChild(line);
        lineIndex++;
        
        // Variable speed for realistic feel
        const delay = Math.random() * 200 + 100;
        setTimeout(printLine, delay);
      } else {
        setTimeout(() => {
          loader.classList.add('hidden');
          document.body.style.overflow = '';
        }, 800);
      }
    }

    document.body.style.overflow = 'hidden';
    setTimeout(printLine, 300);
  }

  /* ── 2. PARTICLE NETWORK BACKGROUND ── */
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  const PARTICLE_COUNT = 70;
  const CONNECT_DIST = 150;
  const MOUSE_DIST = 180;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.5 + 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Gentle mouse attraction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          this.x += dx * 0.003;
          this.y += dy * 0.003;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = 1 - dist / CONNECT_DIST;
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Connect to mouse
      if (mouse.x !== null) {
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          const alpha = 1 - dist / MOUSE_DIST;
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha * 0.2})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();

  /* ── 3. NAVBAR — Scroll Effect ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ── 4. MOBILE NAV TOGGLE ── */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ── 5. ACTIVE NAV LINK on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  /* ── 6. SCROLL REVEAL (Intersection Observer) ── */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger delay for grouped items
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    // Auto-stagger siblings inside the same parent grid
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.querySelectorAll('.reveal'));
      const sibIdx = siblings.indexOf(el);
      if (sibIdx > 0) el.dataset.delay = sibIdx * 80;
    }
    observer.observe(el);
  });

  /* ── 7. SMOOTH ANCHOR SCROLLING ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 8. ROLE CYCLING ANIMATION ── */
  const roleText = document.getElementById('role-text');
  if (roleText) {
    const roles = ["ML Researcher", "IEEE ITSS Board Member", "Builder"];
    let roleIndex = 0;
    let rCharIdx = 0;
    let isDeleting = false;
    let rTypingSpeed = 100;

    function typeRole() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        roleText.textContent = currentRole.substring(0, rCharIdx - 1);
        rCharIdx--;
        rTypingSpeed = 50;
      } else {
        roleText.textContent = currentRole.substring(0, rCharIdx + 1);
        rCharIdx++;
        rTypingSpeed = 100;
      }

      if (!isDeleting && rCharIdx === currentRole.length) {
        rTypingSpeed = 2000; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && rCharIdx === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        rTypingSpeed = 500; // Pause before next word
      }

      setTimeout(typeRole, rTypingSpeed);
    }
    
    // Start after initial loader finishes
    setTimeout(typeRole, 2500);
  }

});
