// Play animation background — draws football plays on a canvas
// Ported from coach-database project

(function () {
  var OL = [
    { x: -0.08, y: 0, type: 'x' },
    { x: -0.04, y: 0, type: 'x' },
    { x: 0, y: 0, type: 'x' },
    { x: 0.04, y: 0, type: 'x' },
    { x: 0.08, y: 0, type: 'x' },
  ];

  var PLAYBOOK = [
    {
      name: 'Spray Basic',
      players: [
        ...OL,
        { x: 0.02, y: 0.12, type: 'o' },
        { x: -0.45, y: 0.02, type: 'o', route: [[-0.48, -0.06]] },
        { x: -0.22, y: 0.01, type: 'o', route: [[-0.1, -0.14], [0.32, -0.22]] },
        { x: -0.15, y: 0, type: 'o', route: [[-0.14, -0.38], [0.12, -0.38]] },
        { x: 0.05, y: 0.14, type: 'o', route: [[0.03, 0.02], [0.14, -0.16]] },
        { x: 0.5, y: 0, type: 'o', route: [[0.48, -0.32], [0.26, -0.72]] },
      ],
    },
    {
      name: 'Expansion Hitch',
      players: [
        ...OL,
        { x: 0.08, y: 0.13, type: 'o' },
        { x: -0.42, y: 0.02, type: 'o', route: [[-0.48, -0.2], [-0.36, -0.38]] },
        { x: -0.18, y: 0.03, type: 'o', route: [[-0.2, -0.55], [-0.12, -0.48]] },
        { x: -0.02, y: 0.05, type: 'o', route: [[0.0, -0.32]] },
        { x: 0.22, y: 0, type: 'o', route: [[0.24, -0.26], [0.4, -0.4]] },
        { x: 0.12, y: 0.14, type: 'o', route: [[0.28, 0.04], [0.48, 0.0]] },
      ],
    },
    {
      name: 'High Cross',
      players: [
        ...OL,
        { x: 0, y: 0.05, type: 'o' },
        { x: -0.2, y: 0, type: 'o', route: [[-0.08, -0.38], [-0.38, -0.52]] },
        { x: 0.22, y: 0, type: 'o', route: [[0.1, -0.22], [-0.05, -0.48]] },
        { x: 0.5, y: 0.02, type: 'o', route: [[0.5, -0.82]] },
        { x: -0.08, y: 0.15, type: 'o', route: [[-0.22, 0.04], [-0.4, -0.02]] },
        { x: 0.08, y: 0.15, type: 'o', route: [[0.22, 0.06], [0.45, -0.02]] },
      ],
    },
    {
      name: 'Burst to Mesh',
      players: [
        ...OL,
        { x: 0, y: 0.12, type: 'o' },
        { x: -0.35, y: 0, type: 'o', route: [[-0.4, -0.68]] },
        { x: -0.15, y: 0, type: 'o', route: [[-0.06, -0.22], [-0.34, -0.28]] },
        { x: 0.4, y: 0, type: 'o', route: [[0.35, -0.42], [0.18, -0.72]] },
        { x: 0.08, y: 0.12, type: 'o', route: [[0.16, -0.04], [0.35, -0.12]] },
        { x: -0.05, y: 0.12, type: 'o', route: [[0.0, -0.06], [0.0, -0.32]] },
      ],
    },
    {
      name: 'Mesh Dagger',
      players: [
        ...OL,
        { x: 0, y: 0.1, type: 'o' },
        { x: -0.4, y: 0, type: 'o', route: [[-0.35, -0.42], [0.1, -0.38]] },
        { x: -0.15, y: 0.01, type: 'o', route: [[-0.2, -0.52]] },
        { x: -0.12, y: 0, type: 'o', route: [[0.12, -0.08], [0.35, -0.1]] },
        { x: 0.45, y: 0, type: 'o', route: [[0.18, -0.08], [-0.1, -0.12]] },
        { x: 0.08, y: 0.12, type: 'o', route: [[0.25, 0.04], [0.42, -0.04]] },
      ],
    },
    {
      name: 'Cross Post',
      players: [
        ...OL,
        { x: 0, y: 0.08, type: 'o' },
        { x: -0.4, y: 0, type: 'o', route: [[-0.32, -0.32], [0.12, -0.52]] },
        { x: 0.45, y: 0, type: 'o', route: [[0.4, -0.28], [0.2, -0.68]] },
        { x: 0.18, y: 0, type: 'o', route: [[0.1, -0.22], [0.38, -0.58]] },
        { x: -0.12, y: 0.08, type: 'o', route: [[-0.02, 0.04]] },
        { x: 0, y: 0.18, type: 'o', route: [[0.0, 0.06], [-0.06, -0.1]] },
      ],
    },
    {
      name: 'Snag Corner',
      players: [
        ...OL,
        { x: 0.03, y: 0.12, type: 'o' },
        { x: -0.32, y: 0.01, type: 'o', route: [[-0.48, -0.02]] },
        { x: -0.15, y: 0, type: 'o', route: [[-0.1, -0.36], [-0.35, -0.68]] },
        { x: -0.13, y: 0.02, type: 'o', route: [[-0.12, -0.2]] },
        { x: 0.45, y: 0, type: 'o', route: [[0.42, -0.42], [0.45, -0.32]] },
        { x: 0.1, y: 0.12, type: 'o', route: [[0.06, 0.02]] },
      ],
    },
    {
      name: 'Screen and Go',
      players: [
        ...OL,
        { x: 0, y: 0.12, type: 'o' },
        { x: -0.4, y: 0.01, type: 'o', route: [[-0.35, 0.04], [-0.45, -0.7]] },
        { x: 0.13, y: 0, type: 'o', route: [[0.05, -0.18], [-0.25, -0.35]] },
        { x: 0.22, y: 0, type: 'o', route: [[0.18, -0.42], [0.1, -0.72]] },
        { x: 0.48, y: 0, type: 'o' },
        { x: 0.1, y: 0.13, type: 'o', route: [[0.28, 0.08], [0.48, 0.05]] },
      ],
    },
    {
      name: 'Y-Stick',
      players: [
        ...OL,
        { x: 0, y: 0.12, type: 'o' },
        { x: -0.42, y: 0.02, type: 'o', route: [[-0.48, -0.18], [-0.38, -0.32]] },
        { x: -0.22, y: 0.01, type: 'o', route: [[-0.25, -0.72]] },
        { x: -0.12, y: 0.01, type: 'o', route: [[-0.05, -0.2], [-0.2, -0.22]] },
        { x: 0.48, y: 0.02, type: 'o', route: [[0.35, -0.22]] },
        { x: 0.1, y: 0.13, type: 'o', route: [[0.3, 0.05], [0.48, 0.02]] },
      ],
    },
    {
      name: 'Post Wheel',
      players: [
        ...OL,
        { x: 0.1, y: 0.12, type: 'o' },
        { x: -0.18, y: 0, type: 'o' },
        { x: -0.05, y: 0.14, type: 'o' },
        { x: 0.22, y: 0.01, type: 'o', route: [[0.18, -0.22], [0.05, -0.52]] },
        { x: 0.35, y: 0, type: 'o', route: [[0.32, -0.32], [0.15, -0.82]] },
        { x: 0.5, y: 0, type: 'o', route: [[0.48, -0.18], [0.48, -0.82]] },
      ],
    },
    {
      name: 'Post Dover',
      players: [
        ...OL,
        { x: 0, y: 0.12, type: 'o' },
        { x: -0.35, y: 0.01, type: 'o', route: [[-0.28, -0.32], [-0.12, -0.68]] },
        { x: 0.13, y: 0.02, type: 'o', route: [[0.05, -0.22]] },
        { x: 0.2, y: 0.01, type: 'o', route: [[0.22, -0.05], [0.48, -0.1]] },
        { x: 0.42, y: 0.01, type: 'o', route: [[0.38, -0.32], [0.2, -0.72]] },
        { x: 0.05, y: 0.14, type: 'o' },
      ],
    },
    {
      name: 'Bender Seam',
      players: [
        ...OL,
        { x: 0.35, y: 0.08, type: 'o' },
        { x: -0.35, y: 0.01, type: 'o', route: [[-0.42, -0.35], [-0.5, -0.65]] },
        { x: -0.12, y: 0.01, type: 'o', route: [[-0.08, -0.35], [-0.05, -0.7]] },
        { x: -0.12, y: 0, type: 'o', route: [[-0.2, 0.01], [-0.42, 0.02]] },
        { x: 0.05, y: 0.08, type: 'o', route: [[0.15, -0.22], [0.35, -0.55]] },
        { x: 0.45, y: 0.08, type: 'o', route: [[0.15, 0.04], [-0.15, 0.02]] },
      ],
    },
  ];

  window.initPlayAnimation = function (canvas) {
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var w, h;
    var accent = [30, 58, 95];
    var plays = [];
    var lastPlayIdx = -1;
    var rafId;

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
      var scale = Math.min(w, h) * 0.28;
      var minDist = scale * 0.85;
      var cx, cy, attempts = 0;

      do {
        cx = w * 0.15 + Math.random() * w * 0.7;
        cy = h * 0.35 + Math.random() * h * 0.35;
        attempts++;
      } while (
        attempts < 30 &&
        plays.some(function (p) {
          var dx = p.cx - cx;
          var dy = p.cy - cy;
          return Math.sqrt(dx * dx + dy * dy) < minDist;
        })
      );

      var mirror = Math.random() > 0.5 ? -1 : 1;
      var idx;
      do { idx = Math.floor(Math.random() * PLAYBOOK.length); }
      while (idx === lastPlayIdx && PLAYBOOK.length > 1);
      lastPlayIdx = idx;
      var template = PLAYBOOK[idx];

      var players = template.players.map(function (p) {
        var px = cx + p.x * scale * mirror;
        var py = cy + p.y * scale;
        var route = null;
        if (p.route) {
          route = [{ x: px, y: py }].concat(
            p.route.map(function (r) {
              return { x: cx + r[0] * scale * mirror, y: cy + r[1] * scale };
            })
          );
        }
        return { x: px, y: py, type: p.type, route: route };
      });

      return {
        cx: cx, cy: cy,
        players: players,
        birth: performance.now(),
        lifespan: 6000 + Math.random() * 3000,
        drawSpeed: 0.4 + Math.random() * 0.3,
      };
    }

    function drawX(x, y, size, alpha) {
      ctx.save();
      ctx.strokeStyle = 'rgba(' + accent[0] + ',' + accent[1] + ',' + accent[2] + ',' + alpha + ')';
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
      ctx.strokeStyle = 'rgba(' + accent[0] + ',' + accent[1] + ',' + accent[2] + ',' + alpha + ')';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    function drawRoute(route, progress, alpha) {
      if (!route || route.length < 2) return;
      ctx.save();
      ctx.strokeStyle = 'rgba(' + accent[0] + ',' + accent[1] + ',' + accent[2] + ',' + alpha + ')';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(route[0].x, route[0].y);

      var totalLen = 0;
      var segLens = [];
      for (var i = 1; i < route.length; i++) {
        var dx = route[i].x - route[i - 1].x;
        var dy = route[i].y - route[i - 1].y;
        var len = Math.sqrt(dx * dx + dy * dy);
        segLens.push(len);
        totalLen += len;
      }

      var drawLen = totalLen * Math.min(progress, 1);
      var drawn = 0;

      for (var i = 1; i < route.length; i++) {
        var remaining = drawLen - drawn;
        if (remaining <= 0) break;

        var segLen = segLens[i - 1];
        if (remaining >= segLen) {
          ctx.lineTo(route[i].x, route[i].y);
          drawn += segLen;
        } else {
          var t = remaining / segLen;
          var ex = route[i - 1].x + (route[i].x - route[i - 1].x) * t;
          var ey = route[i - 1].y + (route[i].y - route[i - 1].y) * t;
          ctx.lineTo(ex, ey);

          var angle = Math.atan2(
            route[i].y - route[i - 1].y,
            route[i].x - route[i - 1].x
          );
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex - 6 * Math.cos(angle - 0.4), ey - 6 * Math.sin(angle - 0.4));
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex - 6 * Math.cos(angle + 0.4), ey - 6 * Math.sin(angle + 0.4));
          drawn += remaining;
        }
      }
      ctx.stroke();

      if (progress >= 1 && route.length >= 2) {
        var last = route[route.length - 1];
        var prev = route[route.length - 2];
        var angle = Math.atan2(last.y - prev.y, last.x - prev.x);
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(last.x - 6 * Math.cos(angle - 0.4), last.y - 6 * Math.sin(angle - 0.4));
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(last.x - 6 * Math.cos(angle + 0.4), last.y - 6 * Math.sin(angle + 0.4));
        ctx.stroke();
      }

      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      var now = performance.now();

      var shouldSpawn = plays.length === 0 || (
        plays.length < 2 && plays.some(function (p) {
          return (now - p.birth) > (p.lifespan - 1500);
        })
      );
      if (shouldSpawn) {
        plays.push(createPlay());
      }

      for (var i = plays.length - 1; i >= 0; i--) {
        var play = plays[i];
        var age = now - play.birth;
        var life = play.lifespan;

        var alpha;
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

        var routeProgress = Math.max(0, Math.min(1, (age - 600) / 2500 * play.drawSpeed * 3));
        var markerSize = 3.5;

        for (var j = 0; j < play.players.length; j++) {
          var p = play.players[j];
          if (p.type === 'x') drawX(p.x, p.y, markerSize, alpha);
          else drawO(p.x, p.y, markerSize, alpha);

          if (p.route) {
            drawRoute(p.route, routeProgress, alpha * 0.85);
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);

    return function stop() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  };
})();
