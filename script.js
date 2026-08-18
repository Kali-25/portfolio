/* =====================================================
   KALI SAIKIRAN — 3D PARTICLE PORTFOLIO
   Morphing particle swarm engine (Three.js) + UI motion
   zero build step · runs anywhere
   ===================================================== */

'use strict';

/* ---------- environment flags & helpers ---------- */
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE = window.matchMedia('(pointer: coarse)').matches;
const FINE = window.matchMedia('(pointer: fine)').matches;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const TAU = Math.PI * 2;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/* =====================================================
   LOADER
   ===================================================== */
function initLoader() {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const pct = document.getElementById('loaderPct');
  if (!loader) return;

  let p = 0;
  let finished = false;

  const render = () => {
    if (fill) fill.style.width = p + '%';
    if (pct) pct.textContent = Math.round(p) + '%';
  };

  const timer = setInterval(() => {
    p = Math.min(p + 4 + Math.random() * 10, 92);
    render();
  }, 70);

  const finish = () => {
    if (finished) return;
    finished = true;
    clearInterval(timer);
    p = 100;
    render();
    setTimeout(() => {
      loader.classList.add('done');
      document.body.classList.remove('loading');
      setTimeout(() => loader.remove(), 900);
    }, 250);
  };

  window.addEventListener('load', () => setTimeout(finish, 350));
  setTimeout(finish, 2600); /* never trap the visitor if a CDN stalls */
}

/* =====================================================
   3D PARTICLE ENGINE
   ===================================================== */
function initParticles() {
  const canvas = document.getElementById('gl');
  if (!canvas || typeof THREE === 'undefined') {
    document.body.classList.add('no-gl');
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
  } catch (err) {
    document.body.classList.add('no-gl');
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 16;

  const COUNT = REDUCED ? 4000 : COARSE ? 6500 : (navigator.hardwareConcurrency || 4) >= 8 ? 14000 : 9000;

  /* ----- buffers ----- */
  const pos = new Float32Array(COUNT * 3);    /* simulated position */
  const tgt = new Float32Array(COUNT * 3);    /* morph target */
  const draw = new Float32Array(COUNT * 3);   /* rendered (pos + wobble + pulse) */
  const colCur = new Float32Array(COUNT * 3);
  const colTgt = new Float32Array(COUNT * 3);
  const seed = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT * 3; i++) {
    seed[i] = Math.random();
    pos[i] = (Math.random() - 0.5) * 46; /* born scattered → converge into first shape */
  }

  /* ----- soft round sprite ----- */
  const dotTexture = () => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.4, 'rgba(255,255,255,0.7)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  };

  const geometry = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(draw, 3);
  const colAttr = new THREE.BufferAttribute(colCur, 3);
  geometry.setAttribute('position', posAttr);
  geometry.setAttribute('color', colAttr);

  const material = new THREE.PointsMaterial({
    size: COARSE ? 0.17 : 0.12,
    map: dotTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const group = new THREE.Group();
  group.add(new THREE.Points(geometry, material));
  scene.add(group);

  /* ----- palette: cyan → violet → pink ----- */
  const STOP_A = new THREE.Color('#38e8ff');
  const STOP_B = new THREE.Color('#7c6bff');
  const STOP_C = new THREE.Color('#ff5fd0');
  const paletteInto = (c, u) => {
    u = clamp(u, 0, 1) * 2;
    if (u < 1) c.copy(STOP_A).lerp(STOP_B, u);
    else c.copy(STOP_B).lerp(STOP_C, u - 1);
  };

  /* ----- shape generators: write into v, return color param 0..1 ----- */
  const SHAPES = {
    sphere(i, n, v) {
      const y = 1 - 2 * ((i + 0.5) / n);
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = GOLDEN * i;
      v.set(Math.cos(th) * r * 6.4, y * 6.4, Math.sin(th) * r * 6.4);
      return (y + 1) / 2;
    },

    helix(i, n, v, s) {
      const kind = i % 10;
      const t = i / n;
      const turns = 5;
      const R = 3.0;
      const H = 15;
      if (kind < 8) {
        const side = kind % 2 ? Math.PI : 0;
        const ang = t * turns * TAU + side;
        v.set(
          Math.cos(ang) * R + (s[0] - 0.5) * 0.18,
          (t - 0.5) * H + (s[1] - 0.5) * 0.18,
          Math.sin(ang) * R + (s[2] - 0.5) * 0.18
        );
        return kind % 2 ? 0.12 : 0.88;
      }
      /* base-pair rungs between the strands */
      const steps = 42;
      const q = Math.floor(t * steps) / steps;
      const angQ = q * turns * TAU;
      const u = s[0];
      const ax = Math.cos(angQ) * R, az = Math.sin(angQ) * R;
      /* opposite strand sits at angle + PI, i.e. (-ax, -az) */
      v.set(ax + (-ax - ax) * u, (q - 0.5) * H, az + (-az - az) * u);
      return 0.5;
    },

    knot(i, n, v, s) {
      const t = (i / n) * TAU;
      const p = 2, q = 3;
      const rr = Math.cos(q * t) + 2;
      const sc = 2.4;
      v.set(
        rr * Math.cos(p * t) * sc + (s[0] - 0.5) * 0.45,
        rr * Math.sin(p * t) * sc + (s[1] - 0.5) * 0.45,
        Math.sin(q * t) * sc * 1.5 + (s[2] - 0.5) * 0.45
      );
      return i / n;
    },

    galaxy(i, n, v, s) {
      if (i < n * 0.16) {
        /* central bulge */
        const r = Math.sqrt(s[0]) * 1.8;
        const a = s[1] * TAU;
        const b = Math.acos(2 * s[2] - 1);
        v.set(r * Math.sin(b) * Math.cos(a), r * Math.cos(b) * 0.7, r * Math.sin(b) * Math.sin(a));
        return 0.08;
      }
      const arms = 3;
      const t = (i - n * 0.16) / (n * 0.84);
      const r = 1.1 + Math.pow(t, 0.72) * 6.9;
      const a = (i % arms) * (TAU / arms) + r * 0.58 + (s[0] - 0.5) * 0.38;
      v.set(
        Math.cos(a) * r,
        (s[1] - 0.5) * Math.max(0.15, 1.5 - r * 0.16),
        Math.sin(a) * r
      );
      return clamp(r / 8, 0, 1);
    },

    grid(i, n, v, s) {
      const side = Math.max(2, Math.round(Math.cbrt(n)));
      const per = side * side;
      const idx = i % (per * side);
      const gx = idx % side;
      const gy = Math.floor(idx / side) % side;
      const gz = Math.floor(idx / per);
      const sp = 11.5 / (side - 1);
      const off = 5.75;
      v.set(
        gx * sp - off + (s[0] - 0.5) * 0.06,
        gy * sp - off + (s[1] - 0.5) * 0.06,
        gz * sp - off + (s[2] - 0.5) * 0.06
      );
      return gy / (side - 1);
    },

    wave(i, n, v) {
      const side = Math.ceil(Math.sqrt(n));
      const sp = 17 / (side - 1);
      v.set((i % side) * sp - 8.5, 0, Math.floor(i / side) * sp - 8.5);
      return (i % side) / (side - 1);
    },
  };

  /* ----- state ----- */
  let currentShape = '';
  let manualSection = null;   /* section id where user overrode auto-morph */
  let currentSection = 'home';
  let pulse = 0;
  const repel = { x: 0, y: 0, z: 0, on: false };
  const mouseWorld = new THREE.Vector3();
  let rotX = 0, rotY = 0, velX = 0, velY = 0;
  let parX = 0, parY = 0, mouseX = 0, mouseY = 0;
  let scrollTilt = 0, camZOffset = 0;
  let T = 0;
  let fpsFrames = 0;
  let raf = null;
  let last = performance.now();

  const hudStats = document.getElementById('hudStats');
  const hudFps = document.getElementById('hudFps');
  const dock = document.getElementById('shapeDock');

  const updateChips = () => {
    if (!dock) return;
    dock.querySelectorAll('.dock-chip').forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.shape === currentShape);
      if (chip.dataset.shape === 'auto') chip.classList.toggle('active', manualSection === null);
    });
  };

  const setShape = (name) => {
    const fn = SHAPES[name];
    if (!fn || name === currentShape) return;
    currentShape = name;
    const v = new THREE.Vector3();
    const c = new THREE.Color();
    const s3 = [0, 0, 0];
    for (let i = 0; i < COUNT; i++) {
      const j = i * 3;
      s3[0] = seed[j]; s3[1] = seed[j + 1]; s3[2] = seed[j + 2];
      const u = fn(i, COUNT, v, s3);
      tgt[j] = v.x; tgt[j + 1] = v.y; tgt[j + 2] = v.z;
      paletteInto(c, u);
      colTgt[j] = c.r; colTgt[j + 1] = c.g; colTgt[j + 2] = c.b;
    }
    if (hudStats) hudStats.textContent = `${COUNT.toLocaleString('en-US')} PTS · ${name.toUpperCase()}`;
    updateChips();
  };

  setShape('sphere');

  /* ----- shape dock (manual override) ----- */
  dock?.addEventListener('click', (e) => {
    const chip = e.target.closest('.dock-chip');
    if (!chip) return;
    const name = chip.dataset.shape;
    if (name === 'auto') {
      manualSection = null;
      const sec = document.getElementById(currentSection);
      setShape(sec?.dataset.shape || 'sphere');
    } else {
      manualSection = currentSection;
      setShape(name);
    }
    updateChips();
  });

  /* ----- auto-morph per section ----- */
  const sectionSpy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      currentSection = e.target.id;
      if (manualSection && manualSection !== currentSection) manualSection = null;
      if (!manualSection) setShape(e.target.dataset.shape || 'sphere');
    });
  }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
  document.querySelectorAll('.section-track').forEach((s) => sectionSpy.observe(s));

  /* ----- pointer: parallax, drag-rotate, click pulse ----- */
  const INTERACTIVE = 'a,button,input,textarea,select,label,nav,form,.card,.dock-chip';
  let dragging = false, moved = 0, lx = 0, ly = 0;

  window.addEventListener('pointermove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    if (dragging) {
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX; ly = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      rotY += dx * 0.005;
      rotX += dy * 0.003;
      velY = dx * 0.0022;
      velX = dy * 0.0013;
    }
  }, { passive: true });

  window.addEventListener('pointerdown', (e) => {
    if (COARSE) return;                        /* keep native touch scrolling */
    if (e.target.closest(INTERACTIVE)) return;
    dragging = true;
    moved = 0;
    lx = e.clientX; ly = e.clientY;
    document.body.classList.add('grabbing');
  });

  window.addEventListener('pointerup', (e) => {
    if (dragging && moved < 6) pulse = 1.3;    /* click (not drag) → shockwave */
    else if (!dragging && COARSE && !e.target.closest(INTERACTIVE)) pulse = 1.3;
    dragging = false;
    document.body.classList.remove('grabbing');
  });

  /* ----- scroll coupling ----- */
  const onScroll = () => {
    const sy = window.scrollY;
    scrollTilt = sy * 0.00038;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    camZOffset = (sy / max) * 3.5;
    document.body.classList.toggle('gl-dim', sy > window.innerHeight * 0.6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- resize / visibility ----- */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
  });

  /* ----- fps hud ----- */
  if (hudFps) {
    setInterval(() => {
      hudFps.textContent = `${fpsFrames} FPS`;
      fpsFrames = 0;
    }, 1000);
  }

  /* ----- main loop ----- */
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!REDUCED) T += dt;

    /* animated ocean for the wave shape */
    if (currentShape === 'wave' && !REDUCED) {
      for (let i = 0; i < COUNT; i++) {
        const j = i * 3;
        tgt[j + 1] = Math.sin(tgt[j] * 0.5 + T * 1.6) * Math.cos(tgt[j + 2] * 0.5 + T * 1.15) * 1.7;
      }
    }

    const k = REDUCED ? 1 : 1 - Math.exp(-dt * 3.4);
    const wob = REDUCED ? 0 : 0.07;
    pulse *= Math.exp(-dt * 3.1);
    const hasPulse = pulse > 0.002;

    /* cursor force-field: project pointer onto the swarm's plane (group-local) */
    repel.on = false;
    if (FINE && !REDUCED) {
      mouseWorld.set(mouseX, -mouseY, 0.5).unproject(camera);
      mouseWorld.sub(camera.position).normalize();
      const dist = -camera.position.z / mouseWorld.z;
      if (dist > 0) {
        mouseWorld.multiplyScalar(dist).add(camera.position);
        group.updateMatrixWorld();
        group.worldToLocal(mouseWorld);
        repel.x += (mouseWorld.x - repel.x) * 0.2;
        repel.y += (mouseWorld.y - repel.y) * 0.2;
        repel.z += (mouseWorld.z - repel.z) * 0.2;
        repel.on = true;
      }
    }
    const RR = 2.3, RR2 = RR * RR;

    for (let i = 0; i < COUNT; i++) {
      const j = i * 3;
      pos[j] += (tgt[j] - pos[j]) * k;
      pos[j + 1] += (tgt[j + 1] - pos[j + 1]) * k;
      pos[j + 2] += (tgt[j + 2] - pos[j + 2]) * k;

      let px = pos[j], py = pos[j + 1], pz = pos[j + 2];
      if (repel.on) {
        const dx = px - repel.x, dy = py - repel.y, dz = pz - repel.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < RR2) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / RR) * 1.6;
          px += (dx / d) * f;
          py += (dy / d) * f;
          pz += (dz / d) * f;
        }
      }
      if (hasPulse) {
        const len = Math.sqrt(px * px + py * py + pz * pz) || 1;
        const f = pulse * (0.7 + seed[j + 1] * 1.5);
        px += (px / len) * f;
        py += (py / len) * f;
        pz += (pz / len) * f;
      }
      const ph = seed[j] * 12.56;
      draw[j] = px + Math.sin(T * 1.4 + ph) * wob;
      draw[j + 1] = py + Math.sin(T * 1.2 + ph * 1.7) * wob;
      draw[j + 2] = pz + Math.cos(T * 1.5 + ph) * wob;

      colCur[j] += (colTgt[j] - colCur[j]) * k;
      colCur[j + 1] += (colTgt[j + 1] - colCur[j + 1]) * k;
      colCur[j + 2] += (colTgt[j + 2] - colCur[j + 2]) * k;
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    /* rotation: auto + drag inertia + mouse parallax + scroll tilt */
    velY *= 0.95; velX *= 0.95;
    rotY += velY + (REDUCED ? 0 : dt * 0.1);
    rotX += velX;
    rotX = clamp(rotX, -1.2, 1.2);
    parY += (mouseX * 0.26 - parY) * 0.045;
    parX += (mouseY * 0.16 - parX) * 0.045;

    group.rotation.y = rotY + parY;
    group.rotation.x = rotX + parX + scrollTilt;
    const breathe = REDUCED ? 1 : 1 + Math.sin(T * 0.6) * 0.015;
    group.scale.setScalar(breathe);
    camera.position.z = 16 + camZOffset;

    renderer.render(scene, camera);
    fpsFrames++;
  };

  raf = requestAnimationFrame(tick);
}

/* =====================================================
   TEXT SCRAMBLE (decrypt effect)
   ===================================================== */
const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#@$%&';

function scrambleText(el, duration = 700) {
  const finalText = el.dataset.text || el.textContent;
  el.dataset.text = finalText;
  if (REDUCED) { el.textContent = finalText; return; }
  const start = performance.now();
  const frame = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const cut = Math.floor(p * finalText.length);
    let out = finalText.slice(0, cut);
    for (let i = cut; i < finalText.length; i++) {
      const ch = finalText[i];
      out += ch === ' ' ? ' ' : SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

/* ---------- rotating role ---------- */
const ROLES = [
  'DevOps Engineer',
  'Platform / SRE Engineer',
  'Kubernetes Operator',
  'GitOps Practitioner',
  'Cloud Cost Optimizer',
  'On-call Firefighter',
];

function initRole() {
  const el = document.getElementById('roleText');
  if (!el) return;
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % ROLES.length;
    el.dataset.text = ROLES[idx];
    scrambleText(el, 620);
  }, 3400);
}

/* =====================================================
   SCROLL REVEAL + COUNTERS + TITLE DECRYPT
   ===================================================== */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      e.target.style.transitionDelay = `${(i % 6) * 70}ms`;
      e.target.classList.add('in');
      e.target.querySelectorAll?.('[data-scramble]')?.forEach((t) => scrambleText(t, 800));
      if (e.target.matches('[data-scramble]')) scrambleText(e.target, 800);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

function initCounters() {
  const stats = document.querySelectorAll('.stat dt');
  if (!stats.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const target = +e.target.dataset.count;
      const suffix = e.target.dataset.suffix || '';
      let cur = 0;
      const inc = Math.max(1, Math.ceil(target / 30));
      const timer = setInterval(() => {
        cur = Math.min(target, cur + inc);
        e.target.textContent = cur + suffix;
        if (cur >= target) clearInterval(timer);
      }, 70);
    });
  }, { threshold: 0.6 });
  stats.forEach((s) => io.observe(s));
}

/* =====================================================
   3D TILT CARDS + GLOW TRACKING
   ===================================================== */
function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    if (el.tagName === 'FORM') {
      /* glow only — tilting a form while typing is cruel */
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(2) + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(2) + '%');
      });
      return;
    }
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (x * 100).toFixed(2) + '%');
      el.style.setProperty('--my', (y * 100).toFixed(2) + '%');
      if (COARSE || REDUCED) return;
      el.classList.add('tilting');
      const rx = (0.5 - y) * 7;
      const ry = (x - 0.5) * 9;
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    });
    el.addEventListener('pointerleave', () => {
      el.classList.remove('tilting');
      el.style.transform = '';
    });
  });
}

/* ---------- hero depth parallax (text floats over the swarm) ---------- */
function initHeroParallax() {
  if (COARSE || REDUCED) return;
  const inner = document.querySelector('.hero-inner');
  const hero = document.getElementById('home');
  if (!inner || !hero) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;

  window.addEventListener('pointermove', (e) => {
    tx = (e.clientX / window.innerWidth - 0.5) * -14;
    ty = (e.clientY / window.innerHeight - 0.5) * -10;
  }, { passive: true });

  const loop = () => {
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    /* only spend the transform while the hero is on screen */
    if (window.scrollY < window.innerHeight) {
      inner.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
    }
    requestAnimationFrame(loop);
  };
  loop();
}

/* ---------- magnetic buttons ---------- */
function initMagnetic() {
  if (COARSE || REDUCED) return;
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.translate = `${clamp(dx * 0.18, -8, 8)}px ${clamp(dy * 0.18, -8, 8)}px`;
    });
    el.addEventListener('pointerleave', () => { el.style.translate = ''; });
  });
}

/* =====================================================
   CUSTOM CURSOR
   ===================================================== */
function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || !FINE || REDUCED) {
    dot?.remove(); ring?.remove();
    return;
  }
  document.body.classList.add('has-cursor');
  let x = -100, y = -100, rx = -100, ry = -100;

  window.addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });

  document.addEventListener('mouseover', (e) => {
    ring.classList.toggle('hover', !!e.target.closest('a,button,input,textarea,.dock-chip,[data-tilt]'));
  });

  window.addEventListener('pointerdown', () => ring.classList.add('down'));
  window.addEventListener('pointerup', () => ring.classList.remove('down'));

  document.documentElement.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'; ring.style.opacity = '0';
  });
  document.documentElement.addEventListener('mouseenter', () => {
    dot.style.opacity = '1'; ring.style.opacity = '1';
  });

  const loop = () => {
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  };
  loop();
}

/* =====================================================
   NAV + SCROLL CHROME
   ===================================================== */
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const links = document.querySelectorAll('.nav-link');

  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu?.classList.toggle('open');
  });
  links.forEach((l) => l.addEventListener('click', () => {
    toggle?.classList.remove('open');
    menu?.classList.remove('open');
  }));

  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-38% 0px -55% 0px' });
  document.querySelectorAll('.section-track').forEach((s) => spy.observe(s));
}

function initScrollChrome() {
  const fill = document.getElementById('progressFill');
  const topBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (fill) fill.style.width = `${(window.scrollY / max) * 100}%`;
    topBtn?.classList.toggle('show', window.scrollY > 700);
  }, { passive: true });

  topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* =====================================================
   CONTACT FORM (mailto — no backend)
   ===================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    const subject = encodeURIComponent(`[saikiran.cloud] message from ${name}`);
    location.href = `mailto:saikiran2k25@gmail.com?subject=${subject}&body=${body}`;
    if (note) note.textContent = '✓ opening your mail client…';
    form.reset();
  });
}

/* =====================================================
   BOOT
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initParticles();
  initRole();
  initReveal();
  initCounters();
  initTilt();
  initHeroParallax();
  initMagnetic();
  initCursor();
  initNav();
  initScrollChrome();
  initContactForm();
});
