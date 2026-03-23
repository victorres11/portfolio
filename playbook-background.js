import { PLAYBOOK } from './playbook.js';

function generatePlaybook(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  let w;
  let h;
  const accent = [30, 58, 95];
  const plays = [];
  let lastPlayIdx = -1;

  if (!ctx) {
    return;
  }

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createPlay() {
    const scale = Math.min(w, h) * 0.28;
    const minDist = scale * 0.85;

    // Find a position that doesn't collide with existing plays
    let cx;
    let cy;
    let attempts = 0;
    do {
      cx = w * 0.15 + Math.random() * w * 0.7;
      cy = h * 0.35 + Math.random() * h * 0.35;
      attempts++;
    } while (
      attempts < 30
      && plays.some((p) => {
        const dx = p.cx - cx;
        const dy = p.cy - cy;
        return Math.sqrt(dx * dx + dy * dy) < minDist;
      })
    );

    const mirror = Math.random() > 0.5 ? -1 : 1;

    // Pick a play from the library, avoiding back-to-back repeats
    let idx;
    do {
      idx = Math.floor(Math.random() * PLAYBOOK.length);
    } while (idx === lastPlayIdx && PLAYBOOK.length > 1);
    lastPlayIdx = idx;
    const template = PLAYBOOK[idx];

    const players = template.players.map((p) => {
      const px = cx + p.x * scale * mirror;
      const py = cy + p.y * scale;

      let route = null;
      if (p.route) {
        route = [
          { x: px, y: py },
          ...p.route.map(([rx, ry]) => ({
            x: cx + rx * scale * mirror,
            y: cy + ry * scale,
          })),
        ];
      }

      return { x: px, y: py, type: p.type, route };
    });

    return {
      cx,
      cy,
      players,
      birth: performance.now(),
      lifespan: 6000 + Math.random() * 3000,
      drawSpeed: 0.4 + Math.random() * 0.3,
    };
  }

  function drawX(x, y, size, alpha) {
    ctx.save();
    ctx.strokeStyle = `rgba(${accent[0]},${accent[1]},${accent[2]},${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x - size, y - size);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y - size);
    ctx.lineTo(x - size, y + size);
    ctx.stroke();
    ctx.restore();
  }

  function drawO(x, y, size, alpha) {
    ctx.save();
    ctx.strokeStyle = `rgba(${accent[0]},${accent[1]},${accent[2]},${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawRoute(route, progress, alpha) {
    if (!route || route.length < 2) {
      return;
    }

    ctx.save();
    ctx.strokeStyle = `rgba(${accent[0]},${accent[1]},${accent[2]},${alpha})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(route[0].x, route[0].y);

    // Calculate total route length
    let totalLen = 0;
    const segLens = [];
    for (let i = 1; i < route.length; i++) {
      const dx = route[i].x - route[i - 1].x;
      const dy = route[i].y - route[i - 1].y;
      const len = Math.sqrt(dx * dx + dy * dy);
      segLens.push(len);
      totalLen += len;
    }

    const drawLen = totalLen * Math.min(progress, 1);
    let drawn = 0;

    for (let i = 1; i < route.length; i++) {
      const remaining = drawLen - drawn;
      if (remaining <= 0) {
        break;
      }

      const segLen = segLens[i - 1];
      if (remaining >= segLen) {
        ctx.lineTo(route[i].x, route[i].y);
        drawn += segLen;
      } else {
        // Partial segment
        const t = remaining / segLen;
        const ex = route[i - 1].x + (route[i].x - route[i - 1].x) * t;
        const ey = route[i - 1].y + (route[i].y - route[i - 1].y) * t;
        ctx.lineTo(ex, ey);

        // Arrow head at the tip
        const angle = Math.atan2(
          route[i].y - route[i - 1].y,
          route[i].x - route[i - 1].x,
        );
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(
          ex - 6 * Math.cos(angle - 0.4),
          ey - 6 * Math.sin(angle - 0.4),
        );
        ctx.moveTo(ex, ey);
        ctx.lineTo(
          ex - 6 * Math.cos(angle + 0.4),
          ey - 6 * Math.sin(angle + 0.4),
        );
        drawn += remaining;
      }
    }
    ctx.stroke();

    // Arrow at end if fully drawn
    if (progress >= 1 && route.length >= 2) {
      const last = route[route.length - 1];
      const prev = route[route.length - 2];
      const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(
        last.x - 6 * Math.cos(angle - 0.4),
        last.y - 6 * Math.sin(angle - 0.4),
      );
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(
        last.x - 6 * Math.cos(angle + 0.4),
        last.y - 6 * Math.sin(angle + 0.4),
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const now = performance.now();

    // Spawn new plays to maintain 3-4 on screen
    while (plays.length < 4) {
      plays.push(createPlay());
    }

    // Draw and age each play
    for (let i = plays.length - 1; i >= 0; i--) {
      const play = plays[i];
      const age = now - play.birth;
      const life = play.lifespan;

      // Fade in for first 800ms, fade out for last 1500ms
      let alpha;
      if (age < 800) {
        alpha = (age / 800) * 0.14;
      } else if (age > life - 1500) {
        alpha = Math.max(0, ((life - age) / 1500) * 0.14);
      } else {
        alpha = 0.14;
      }

      if (age > life) {
        plays.splice(i, 1);
        continue;
      }

      // Route draw progress (0-1 over first 2.5s after fade-in)
      const routeProgress = Math.max(0, Math.min(1, ((age - 600) / 2500) * play.drawSpeed * 3));

      const markerSize = 3.5;
      for (const p of play.players) {
        if (p.type === 'x') {
          drawX(p.x, p.y, markerSize, alpha);
        } else {
          drawO(p.x, p.y, markerSize, alpha);
        }

        if (p.route) {
          drawRoute(p.route, routeProgress, alpha * 0.85);
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

function initPlaybookBackground() {
  if (window.__portfolioPlaybookBackgroundInitialized) {
    return;
  }

  const canvas = document.getElementById('playbook-bg');
  if (!canvas) {
    return;
  }

  window.__portfolioPlaybookBackgroundInitialized = true;
  generatePlaybook(canvas);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPlaybookBackground, { once: true });
} else {
  initPlaybookBackground();
}
