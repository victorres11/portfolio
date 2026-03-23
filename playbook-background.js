import { PLAYBOOK } from './playbook.js';

function generatePlaybook(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  let w;
  let h;
  const accent = [26, 101, 158];
  const glow = [84, 166, 214];
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
    const scale = Math.min(w, h) * 0.24;
    const minDist = scale * 0.85;

    // Find a position that doesn't collide with existing plays
    let cx;
    let cy;
    let attempts = 0;
    do {
      cx = w * 0.08 + Math.random() * w * 0.84;
      cy = h * 0.2 + Math.random() * h * 0.62;
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
      lifespan: 7600 + Math.random() * 2800,
      drawSpeed: 0.45 + Math.random() * 0.35,
      maxAlpha: 0.42 + Math.random() * 0.14,
    };
  }

  function setStroke(alpha, width) {
    ctx.strokeStyle = `rgba(${accent[0]},${accent[1]},${accent[2]},${alpha})`;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = `rgba(${glow[0]},${glow[1]},${glow[2]},${Math.min(alpha * 0.7, 0.26)})`;
    ctx.shadowBlur = 6;
  }

  function drawLayeredPath(drawFn, alpha, width) {
    ctx.save();
    ctx.strokeStyle = `rgba(${glow[0]},${glow[1]},${glow[2]},${Math.min(alpha * 0.42, 0.22)})`;
    ctx.lineWidth = width * 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 0;
    drawFn();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    setStroke(alpha, width);
    drawFn();
    ctx.stroke();
    ctx.restore();
  }

  function drawX(x, y, size, alpha) {
    drawLayeredPath(() => {
      ctx.beginPath();
      ctx.moveTo(x - size, y - size);
      ctx.lineTo(x + size, y + size);
      ctx.moveTo(x + size, y - size);
      ctx.lineTo(x - size, y + size);
    }, alpha, 2.1);
  }

  function drawO(x, y, size, alpha) {
    drawLayeredPath(() => {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
    }, alpha, 2.1);
  }

  function drawRoute(route, progress, alpha) {
    if (!route || route.length < 2) {
      return;
    }
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
    if (drawLen <= 0) {
      return;
    }

    const drawnPath = [{ x: route[0].x, y: route[0].y }];
    let drawn = 0;
    let tipAngle = 0;

    for (let i = 1; i < route.length; i++) {
      const segLen = segLens[i - 1];
      if (segLen <= 0) {
        continue;
      }
      const angle = Math.atan2(
        route[i].y - route[i - 1].y,
        route[i].x - route[i - 1].x,
      );

      if (drawn + segLen <= drawLen) {
        drawnPath.push({ x: route[i].x, y: route[i].y });
        drawn += segLen;
        tipAngle = angle;
        continue;
      }

      const remaining = drawLen - drawn;
      if (remaining > 0) {
        const t = remaining / segLen;
        drawnPath.push({
          x: route[i - 1].x + (route[i].x - route[i - 1].x) * t,
          y: route[i - 1].y + (route[i].y - route[i - 1].y) * t,
        });
        tipAngle = angle;
      }
      break;
    }

    if (drawnPath.length < 2) {
      return;
    }

    drawLayeredPath(() => {
      ctx.beginPath();
      ctx.moveTo(drawnPath[0].x, drawnPath[0].y);
      for (let i = 1; i < drawnPath.length; i++) {
        ctx.lineTo(drawnPath[i].x, drawnPath[i].y);
      }
    }, alpha, 1.75);

    const tip = drawnPath[drawnPath.length - 1];
    drawLayeredPath(() => {
      ctx.beginPath();
      ctx.moveTo(tip.x, tip.y);
      ctx.lineTo(
        tip.x - 6 * Math.cos(tipAngle - 0.4),
        tip.y - 6 * Math.sin(tipAngle - 0.4),
      );
      ctx.moveTo(tip.x, tip.y);
      ctx.lineTo(
        tip.x - 6 * Math.cos(tipAngle + 0.4),
        tip.y - 6 * Math.sin(tipAngle + 0.4),
      );
    }, alpha, 1.7);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const now = performance.now();

    // Keep at most two plays on screen
    while (plays.length < 2) {
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
        alpha = (age / 800) * play.maxAlpha;
      } else if (age > life - 1500) {
        alpha = Math.max(0, ((life - age) / 1500) * play.maxAlpha);
      } else {
        alpha = play.maxAlpha;
      }

      if (age > life) {
        plays.splice(i, 1);
        continue;
      }

      // Route draw progress (0-1 over first 2.5s after fade-in)
      const routeProgress = Math.max(0, Math.min(1, ((age - 600) / 2500) * play.drawSpeed * 3));

      const markerSize = 4.2;
      for (const p of play.players) {
        if (p.type === 'x') {
          drawX(p.x, p.y, markerSize, alpha);
        } else {
          drawO(p.x, p.y, markerSize, alpha);
        }

        if (p.route) {
          drawRoute(p.route, routeProgress, alpha * 0.96);
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
