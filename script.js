(function () {
  'use strict';
  var cv = document.getElementById('scene');
  var ctx = cv.getContext('2d');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(pointer: coarse)').matches;
  var W = 0, H = 0, DPR = 1, S = 1;
  var bg = document.createElement('canvas'), bgx = bg.getContext('2d');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function angDiff(a, b) {
    var d = a - b;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    return d;
  }

  /* ---------- Wall ---------- */
  function cobweb(g, cx, cy, sx, sy, r) {
    var n = 7, i, k;
    g.lineWidth = 1; g.strokeStyle = 'rgba(215,220,235,0.2)';
    for (i = 0; i <= n; i++) {
      var a = (i / n) * Math.PI / 2, len = r * rnd(0.92, 1.08);
      g.beginPath(); g.moveTo(cx, cy);
      g.lineTo(cx + sx * Math.cos(a) * len, cy + sy * Math.sin(a) * len); g.stroke();
    }
    for (k = 1; k <= 5; k++) {
      var rk = r * k / 5.4;
      for (i = 0; i < n; i++) {
        var a0 = (i / n) * Math.PI / 2, a1 = ((i + 1) / n) * Math.PI / 2, am = (a0 + a1) / 2;
        g.beginPath();
        g.moveTo(cx + sx * Math.cos(a0) * rk, cy + sy * Math.sin(a0) * rk);
        g.quadraticCurveTo(cx + sx * Math.cos(am) * rk * 0.84, cy + sy * Math.sin(am) * rk * 0.84,
                           cx + sx * Math.cos(a1) * rk, cy + sy * Math.sin(a1) * rk);
        g.stroke();
      }
    }
  }

  function buildBg() {
    bg.width = Math.round(W * DPR); bg.height = Math.round(H * DPR);
    var g = bgx, i, k;
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    g.fillStyle = '#050508'; g.fillRect(0, 0, W, H);
    var bh = 64 * S, bw = 150 * S, gap = 2.2 * S, row = 0, x, y, w, l;
    for (y = -bh * 0.4; y < H; y += bh, row++) {
      x = -(row % 2) * bw * 0.5 - rnd(0, bw * 0.3);
      while (x < W) {
        w = bw * rnd(0.8, 1.25); l = 9 + Math.random() * 6;
        g.fillStyle = 'hsl(228,9%,' + l.toFixed(1) + '%)';
        g.fillRect(x + gap, y + gap, w - gap * 2, bh - gap * 2);
        g.fillStyle = 'rgba(255,255,255,0.04)';
        g.fillRect(x + gap, y + gap, w - gap * 2, 2 * S); g.fillRect(x + gap, y + gap, 2 * S, bh - gap * 2);
        g.fillStyle = 'rgba(0,0,0,0.4)';
        g.fillRect(x + gap, y + bh - gap - 2 * S, w - gap * 2, 2 * S); g.fillRect(x + w - gap - 2 * S, y + gap, 2 * S, bh - gap * 2);
        x += w;
      }
    }
    var n = Math.round(W * H / 80);
    for (i = 0; i < n; i++) {
      g.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,' + rnd(0.02, 0.06).toFixed(3) + ')' : 'rgba(0,0,0,' + rnd(0.08, 0.2).toFixed(3) + ')';
      g.fillRect(Math.random() * W, Math.random() * H, rnd(1, 2.2), rnd(1, 2.2));
    }
    for (i = 0; i < 9; i++) {
      var sx = Math.random() * W, sy = Math.random() * H, sr = rnd(120, 320) * S;
      var gr = g.createRadialGradient(sx, sy, 0, sx, sy, sr);
      var tint = Math.random() < 0.35 ? '30,48,28' : '0,0,0';
      gr.addColorStop(0, 'rgba(' + tint + ',' + rnd(0.15, 0.35).toFixed(2) + ')');
      gr.addColorStop(1, 'rgba(' + tint + ',0)');
      g.fillStyle = gr; g.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
    }
    for (i = 0; i < 7; i++) {
      var dx = Math.random() * W, dl = rnd(0.15, 0.6) * H, dw = rnd(5, 14) * S;
      var lg = g.createLinearGradient(0, 0, 0, dl);
      lg.addColorStop(0, 'rgba(100,40,22,0.22)'); lg.addColorStop(1, 'rgba(100,40,22,0)');
      g.fillStyle = lg; g.fillRect(dx, 0, dw, dl);
    }
    for (i = 0; i < 5; i++) {
      var cx = Math.random() * W, cy = Math.random() * H, a = rnd(0, 6.28);
      g.beginPath(); g.moveTo(cx, cy);
      for (k = 0; k < 14; k++) {
        a += rnd(-0.7, 0.7); var st = rnd(10, 26) * S;
        cx += Math.cos(a) * st; cy += Math.sin(a) * st; g.lineTo(cx, cy);
      }
      g.strokeStyle = 'rgba(0,0,0,0.75)'; g.lineWidth = 2 * S; g.stroke();
      g.save(); g.translate(1.5, 1.5);
      g.strokeStyle = 'rgba(255,255,255,0.05)'; g.lineWidth = 1; g.stroke();
      g.restore();
    }
    cobweb(g, 0, 0, 1, 1, rnd(200, 300) * S);
    cobweb(g, W, 0, -1, 1, rnd(200, 300) * S);
    cobweb(g, 0, H, 1, -1, rnd(160, 240) * S);
    cobweb(g, W, H, -1, -1, rnd(160, 240) * S);
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    S = clamp(Math.min(W, H) / 700, 0.55, 1.6);
    buildBg();
  }

  /* ---------- Spider ---------- */
  var HX = [22, 10, -4, -18], HY = 10;
  var RX = [100, 62, -20, -100], RY = [125, 150, 150, 125];
  var L1 = [78, 82, 80, 76], L2 = [96, 102, 100, 94];
  var EYES = [[25, -4.5, 3.3], [25, 4.5, 3.3], [20.5, -10, 2.4], [20.5, 10, 2.4], [15, -8, 1.8], [15, 8, 1.8], [28, -11, 1.5], [28, 11, 1.5]];
  var legs = [], side, j;
  for (side = -1; side <= 1; side += 2) {
    for (j = 0; j < 4; j++) {
      legs.push({
        side: side, j: j, group: (j + (side > 0 ? 1 : 0)) % 2,
        foot: { x: 0, y: 0 }, from: { x: 0, y: 0 }, to: { x: 0, y: 0 },
        t: 1, stepping: false, dur: 0.15, lift: 0
      });
    }
  }
  var L = { x: 0, y: 0, tx: 0, ty: 0, speed: 0 };
  var sp = { x: 0, y: 0, vx: 0, vy: 0, h: 0, phi: 0, lunge: 0, lungeIn: 2.5, scare: 0, t: 0 };
  var fl = { on: false, next: rnd(4, 7), t: 0, dur: 0, mul: 1 };
  var hc = 1, hs = 0;
  var jump = { on: false, t: 0, cool: 12, near: 0, enabled: true };
  var JT = 1.3, ZMAX = 6.5;
  var shake = { x: 0, y: 0 };
  var kids = [];

  function wx(lx, ly) { return sp.x + lx * hc - ly * hs; }
  function wy(lx, ly) { return sp.y + lx * hs + ly * hc; }

  function knee(hx, hy, fx, fy, l1, l2, ox, oy) {
    var dx = fx - hx, dy = fy - hy, d = Math.hypot(dx, dy) || 0.001;
    var maxd = l1 + l2 - 0.5;
    if (d > maxd) { var k = maxd / d; fx = hx + dx * k; fy = hy + dy * k; dx *= k; dy *= k; d = maxd; }
    var ux = dx / d, uy = dy / d;
    var a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
    var h = Math.sqrt(Math.max(l1 * l1 - a * a, 0));
    var px = -uy, py = ux;
    var k1x = hx + ux * a + px * h, k1y = hy + uy * a + py * h;
    var k2x = hx + ux * a - px * h, k2y = hy + uy * a - py * h;
    var d1 = (k1x - hx) * ox + (k1y - hy) * oy, d2 = (k2x - hx) * ox + (k2y - hy) * oy;
    return d1 >= d2 ? [k1x, k1y, fx, fy] : [k2x, k2y, fx, fy];
  }

  function resetSpider() {
    L.x = L.tx = W * 0.42; L.y = L.ty = H * 0.62;
    sp.x = L.x + 150 * S; sp.y = L.y - 95 * S;
    sp.h = Math.atan2(L.y - sp.y, L.x - sp.x);
    hc = Math.cos(sp.h); hs = Math.sin(sp.h);
    legs.forEach(function (l) {
      l.foot.x = wx(RX[l.j] * S, l.side * RY[l.j] * S);
      l.foot.y = wy(RX[l.j] * S, l.side * RY[l.j] * S);
    });
    kids.length = 0;
    for (var q = 0; q < 7; q++) {
      kids.push({
        x: L.x + rnd(-230, 230) * S, y: L.y + rnd(-200, 160) * S, vx: 0, vy: 0, h: rnd(0, 6.28),
        ph: rnd(0, 6.28), ph0: rnd(0, 6.28), off: rnd(0, 6.28), dir: Math.random() < 0.5 ? -1 : 1,
        r: rnd(70, 210), sp: rnd(0.8, 1.4), sz: rnd(0.22, 0.34), act: 0
      });
    }
  }

  /* ---------- Sound (optional, starts off) ---------- */
  var AC = null, master = null, soundOn = false, nextBeat = 0, noiseBuf = null, lastTick = 0;
  function initAudio() {
    if (AC) return;
    var A = window.AudioContext || window.webkitAudioContext;
    if (!A) return;
    AC = new A();
    master = AC.createGain(); master.gain.value = 0; master.connect(AC.destination);
    var lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 140;
    var dg = AC.createGain(); dg.gain.value = 0.05;
    lp.connect(dg); dg.connect(master);
    [41, 43.3].forEach(function (f) {
      var o = AC.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.connect(lp); o.start();
    });
    var len = Math.floor(AC.sampleRate * 0.05);
    noiseBuf = AC.createBuffer(1, len, AC.sampleRate);
    var data = noiseBuf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }
  function thump(t, vol) {
    var o = AC.createOscillator(), g = AC.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.12);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.2);
  }
  function heartbeat(prox) {
    if (!AC || !soundOn) return;
    var now = AC.currentTime;
    if (now >= nextBeat) {
      thump(now + 0.02, 0.5); thump(now + 0.2, 0.34);
      nextBeat = now + 1.2 - 0.75 * prox;
    }
  }
  function tick() {
    if (!AC || !soundOn || !noiseBuf) return;
    var now = AC.currentTime;
    if (now - lastTick < 0.03) return;
    lastTick = now;
    var s = AC.createBufferSource(); s.buffer = noiseBuf;
    var bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2600 + Math.random() * 1200; bp.Q.value = 2;
    var g = AC.createGain(); g.gain.setValueAtTime(0.05, now); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    s.connect(bp); bp.connect(g); g.connect(master); s.start(now);
  }

  function sting() {
    if (!AC || !soundOn) return;
    var now = AC.currentTime;
    var slam = AC.createOscillator(), sg = AC.createGain();
    slam.type = 'sine';
    slam.frequency.setValueAtTime(90, now); slam.frequency.exponentialRampToValueAtTime(28, now + 0.5);
    sg.gain.setValueAtTime(0.9, now); sg.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    slam.connect(sg); sg.connect(master); slam.start(now); slam.stop(now + 0.65);
    [1100, 1167].forEach(function (f) {
      var o = AC.createOscillator(), g = AC.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(f, now); o.frequency.exponentialRampToValueAtTime(f * 0.45, now + 0.45);
      g.gain.setValueAtTime(0.18, now); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      o.connect(g); g.connect(master); o.start(now); o.stop(now + 0.55);
    });
  }

  var soundBtn = document.getElementById('sound');
  soundBtn.addEventListener('click', function () {
    soundOn = !soundOn;
    soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    soundBtn.textContent = soundOn ? 'Sound on' : 'Sound off';
    if (soundOn) { initAudio(); if (AC && AC.state === 'suspended') AC.resume(); }
    if (master) master.gain.value = soundOn ? 0.9 : 0;
  });

  var scareBtn = document.getElementById('scare');
  scareBtn.addEventListener('click', function () {
    jump.enabled = !jump.enabled;
    scareBtn.setAttribute('aria-pressed', jump.enabled ? 'true' : 'false');
    scareBtn.textContent = jump.enabled ? 'Jump scares on' : 'Jump scares off';
  });

  /* ---------- Input ---------- */
  function onPoint(e) {
    if (e.target && e.target.closest && e.target.closest('.dock')) return;
    if (e.pointerType === 'touch' && e.type === 'pointermove' && !e.buttons && e.pressure === 0) return;
    L.tx = e.clientX; L.ty = e.clientY;
  }
  window.addEventListener('pointermove', onPoint);
  window.addEventListener('pointerdown', onPoint);

  var hint = document.getElementById('hint');
  if (coarse) hint.textContent = 'Drag your light. Something is already following it.';
  setTimeout(function () { hint.classList.add('hide'); }, 9000);

  /* ---------- Draw helpers ---------- */
  function drawLeg(l, hx, hy, kn) {
    var segs = [[hx, hy, kn[0], kn[1], 7.5 * S * (1 + 0.15 * l.lift)], [kn[0], kn[1], kn[2], kn[3], 4.4 * S]];
    var i, k, sgm;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#050508';
    for (i = 0; i < 2; i++) {
      sgm = segs[i];
      ctx.lineWidth = sgm[4];
      ctx.beginPath(); ctx.moveTo(sgm[0], sgm[1]); ctx.lineTo(sgm[2], sgm[3]); ctx.stroke();
    }
    // coarse bristles along both segments
    ctx.strokeStyle = '#0c0c14'; ctx.lineWidth = 1.1 * S;
    ctx.beginPath();
    for (i = 0; i < 2; i++) {
      sgm = segs[i];
      var sx = sgm[2] - sgm[0], sy = sgm[3] - sgm[1], sl = Math.hypot(sx, sy) || 1;
      var ux = sx / sl, uy = sy / sl, nx = -uy, ny = ux;
      for (k = 1; k <= 7; k++) {
        var f = k / 8, bx = sgm[0] + sx * f, by = sgm[1] + sy * f;
        var bl = (5.2 - 2.4 * f) * S * (i ? 0.85 : 1.1);
        ctx.moveTo(bx, by); ctx.lineTo(bx + (nx * 0.9 + ux * 0.6) * bl, by + (ny * 0.9 + uy * 0.6) * bl);
        ctx.moveTo(bx, by); ctx.lineTo(bx - (nx * 0.9 - ux * 0.6) * bl, by - (ny * 0.9 - uy * 0.6) * bl);
      }
    }
    ctx.stroke();
    // thorn at the knee, pointing away from the leg line
    var mx = (hx + kn[2]) / 2, my = (hy + kn[3]) / 2, ox = kn[0] - mx, oy = kn[1] - my, ol = Math.hypot(ox, oy) || 1;
    ox /= ol; oy /= ol;
    ctx.fillStyle = '#050508';
    ctx.beginPath();
    ctx.moveTo(kn[0] - oy * 3.4 * S, kn[1] + ox * 3.4 * S);
    ctx.lineTo(kn[0] + ox * 11 * S, kn[1] + oy * 11 * S);
    ctx.lineTo(kn[0] + oy * 3.4 * S, kn[1] - ox * 3.4 * S);
    ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(kn[0], kn[1], 4.6 * S, 0, 6.2832); ctx.fill();
    // hooked claw at the foot
    var fx = kn[2] - kn[0], fy = kn[3] - kn[1], fl2 = Math.hypot(fx, fy) || 1;
    ctx.strokeStyle = '#2b2a33'; ctx.lineWidth = 1.8 * S;
    ctx.beginPath(); ctx.moveTo(kn[2], kn[3]);
    ctx.quadraticCurveTo(kn[2] + fx / fl2 * 5 * S - fy / fl2 * 3 * S, kn[3] + fy / fl2 * 5 * S + fx / fl2 * 3 * S,
                         kn[2] + fx / fl2 * 8 * S, kn[3] + fy / fl2 * 8 * S);
    ctx.stroke();
    // glossy rim light toward the flashlight (only visible where it is lit)
    var ddx = L.x - mx, ddy = L.y - my, dl = Math.hypot(ddx, ddy) || 1;
    var rx = ddx / dl * 1.6 * S, ry = ddy / dl * 1.6 * S;
    ctx.strokeStyle = 'rgba(165,172,215,0.55)'; ctx.lineWidth = 1.1 * S;
    ctx.beginPath(); ctx.moveTo(hx + rx, hy + ry); ctx.lineTo(kn[0] + rx, kn[1] + ry); ctx.lineTo(kn[2] + rx, kn[3] + ry); ctx.stroke();
  }

  function bodyGradient(cx, cy, r, nx, ny) {
    var g = ctx.createRadialGradient(cx + nx * r * 0.35, cy + ny * r * 0.35, 0, cx, cy, r * 1.1);
    g.addColorStop(0, '#5a5e78'); g.addColorStop(0.3, '#171820'); g.addColorStop(1, '#020205');
    return g;
  }

  function drawBody(breath) {
    var ldx = L.x - sp.x, ldy = L.y - sp.y, ld = Math.hypot(ldx, ldy) || 1;
    var nx = (ldx * hc + ldy * hs) / ld, ny = (-ldx * hs + ldy * hc) / ld, i, sg;
    ctx.save();
    ctx.translate(sp.x, sp.y); ctx.rotate(sp.h);
    ctx.lineCap = 'round';

    // abdomen: bristles, bulb, wet sheen, hourglass
    var ax = -32 * S, arx = 38 * S * (1 + breath), ary = 29 * S * (1 + breath * 0.5);
    ctx.strokeStyle = '#0b0b12'; ctx.lineWidth = 1.2 * S;
    ctx.beginPath();
    for (i = 0; i < 40; i++) {
      var ha = i / 40 * 6.2832, hl = (3.2 + 2.4 * Math.sin(i * 3.1)) * S;
      var hx0 = ax + Math.cos(ha) * arx * 0.96, hy0 = Math.sin(ha) * ary * 0.96;
      ctx.moveTo(hx0, hy0); ctx.lineTo(hx0 + Math.cos(ha) * hl, hy0 + Math.sin(ha) * hl);
    }
    ctx.stroke();
    ctx.fillStyle = bodyGradient(ax, 0, Math.max(arx, ary), nx, ny);
    ctx.beginPath(); ctx.ellipse(ax, 0, arx, ary, 0, 0, 6.2832); ctx.fill();
    var shx = ax + nx * 14 * S, shy = ny * 10 * S;
    var sh = ctx.createRadialGradient(shx, shy, 0, shx, shy, 14 * S);
    sh.addColorStop(0, 'rgba(210,218,255,0.5)'); sh.addColorStop(1, 'rgba(210,218,255,0)');
    ctx.fillStyle = sh;
    ctx.beginPath(); ctx.ellipse(shx, shy, 14 * S, 10 * S, 0, 0, 6.2832); ctx.fill();
    var hg = ctx.createLinearGradient(ax - 18 * S, 0, ax + 18 * S, 0);
    hg.addColorStop(0, '#6e0d12'); hg.addColorStop(0.5, '#c4222a'); hg.addColorStop(1, '#6e0d12');
    ctx.fillStyle = hg;
    ctx.beginPath();
    ctx.moveTo(ax + 16 * S, -9 * S); ctx.lineTo(ax, 0); ctx.lineTo(ax + 16 * S, 9 * S); ctx.closePath();
    ctx.moveTo(ax - 16 * S, -9 * S); ctx.lineTo(ax, 0); ctx.lineTo(ax - 16 * S, 9 * S); ctx.closePath();
    ctx.fill();

    // cephalothorax
    var hx = 14 * S;
    ctx.fillStyle = bodyGradient(hx, 0, 21 * S, nx, ny);
    ctx.beginPath(); ctx.ellipse(hx, 0, 21 * S, 17 * S, 0, 0, 6.2832); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(hx - 2 * S, 0, 11 * S, 8 * S, 0, 0, 6.2832); ctx.fill();

    // eight glossy black eyes: dull, no glow, a wet highlight only where the light reaches
    for (i = 0; i < EYES.length; i++) {
      var ex = EYES[i][0] * S, ey = EYES[i][1] * S, er = EYES[i][2] * S * 1.05;
      ctx.fillStyle = '#010103';
      ctx.beginPath(); ctx.arc(ex, ey, er, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = '#2a0c10'; ctx.lineWidth = 0.9 * S;
      ctx.beginPath(); ctx.arc(ex, ey, er, 0, 6.2832); ctx.stroke();
      ctx.fillStyle = 'rgba(240,244,255,0.95)';
      ctx.beginPath(); ctx.arc(ex + nx * er * 0.38, ey + ny * er * 0.38, er * 0.26, 0, 6.2832); ctx.fill();
    }

    // palps, chelicerae and curved ivory fangs
    for (sg = -1; sg <= 1; sg += 2) {
      ctx.strokeStyle = '#0b0b12'; ctx.lineWidth = 3.6 * S;
      ctx.beginPath(); ctx.moveTo(30 * S, sg * 9 * S); ctx.quadraticCurveTo(44 * S, sg * 12 * S, 47 * S, sg * 5 * S); ctx.stroke();
      ctx.fillStyle = '#0b0b12';
      ctx.beginPath(); ctx.arc(47 * S, sg * 5 * S, 3.2 * S, 0, 6.2832); ctx.fill();
      ctx.beginPath(); ctx.ellipse(34 * S, sg * 4.6 * S, 8 * S, 5 * S, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = '#d9d3bd';
      ctx.beginPath();
      ctx.moveTo(36 * S, sg * 6.8 * S);
      ctx.quadraticCurveTo(50 * S, sg * 5.5 * S, 56 * S, sg * 0.8 * S);
      ctx.quadraticCurveTo(48 * S, sg * 2.6 * S, 36 * S, sg * 2.4 * S);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(200,235,170,0.85)';
      ctx.beginPath(); ctx.arc(55.5 * S, sg * 2.4 * S, 1.5 * S, 0, 6.2832); ctx.fill();
    }
    ctx.restore();
  }

  /* ---------- Spiderlings ---------- */
  function updateKids(dt) {
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      k.off += dt * 0.35 * k.dir;
      var tx = L.x + Math.cos(k.off) * k.r * S, ty = L.y + Math.sin(k.off) * k.r * S;
      var dx = tx - k.x, dy = ty - k.y, d = Math.hypot(dx, dy) || 1;
      var v = 170 * S * k.sp * (0.4 + 0.6 * Math.abs(Math.sin(sp.t * 3.3 + k.ph0))) * clamp((d - 4 * S) / (40 * S), 0, 1);
      var kk = 1 - Math.exp(-dt * 6);
      k.vx += (dx / d * v - k.vx) * kk; k.vy += (dy / d * v - k.vy) * kk;
      k.x += k.vx * dt; k.y += k.vy * dt;
      var s2 = Math.hypot(k.vx, k.vy);
      k.act = clamp(s2 / (80 * S), 0, 1);
      if (s2 > 8 * S) k.h += angDiff(Math.atan2(k.vy, k.vx), k.h) * (1 - Math.exp(-dt * 10));
      k.ph += dt * 16 * k.act;
    }
  }

  function drawKid(k) {
    var u = S * k.sz, side, j;
    ctx.save(); ctx.translate(k.x, k.y); ctx.rotate(k.h);
    ctx.lineCap = 'round'; ctx.strokeStyle = '#06060a'; ctx.lineWidth = Math.max(1.1, 4 * u);
    for (side = -1; side <= 1; side += 2) {
      for (j = 0; j < 4; j++) {
        var wob = Math.sin(k.ph + j * 1.7 + side) * 7 * u * k.act;
        var hx = HX[j] * u, hy = side * HY * u, fx = RX[j] * u + wob, fy = side * RY[j] * u;
        ctx.beginPath(); ctx.moveTo(hx, hy);
        ctx.quadraticCurveTo((hx + fx) / 2, (hy + fy) / 2 + side * 22 * u, fx, fy);
        ctx.stroke();
      }
    }
    ctx.fillStyle = '#0a0a10';
    ctx.beginPath(); ctx.ellipse(-30 * u, 0, 35 * u, 27 * u, 0, 0, 6.2832); ctx.fill();
    ctx.beginPath(); ctx.ellipse(14 * u, 0, 21 * u, 17 * u, 0, 0, 6.2832); ctx.fill();
    ctx.fillStyle = 'rgba(120,130,170,0.5)';
    ctx.beginPath(); ctx.ellipse(-34 * u, -8 * u, 14 * u, 8 * u, 0, 0, 6.2832); ctx.fill();
    ctx.restore();
  }

  /* ---------- Main loop ---------- */
  var last = performance.now();

  function frame(now) {
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now; sp.t += dt;
    var R = clamp(250 * S, 170, 420);

    // light follows pointer with a little lag
    var px = L.x, py = L.y, kl = 1 - Math.exp(-dt * 18);
    L.x += (L.tx - L.x) * kl; L.y += (L.ty - L.y) * kl;
    L.speed += (Math.hypot(L.x - px, L.y - py) / Math.max(dt, 0.001) - L.speed) * 0.15;

    // flicker
    if (!reduce) {
      if (!fl.on) {
        fl.next -= dt; fl.mul = 1 - Math.random() * 0.04;
        if (fl.next <= 0) {
          fl.on = true; fl.t = 0; fl.dur = rnd(0.4, 0.9);
          if (sp.lunge <= 0) sp.lunge = 0.35;
          sp.lungeIn = rnd(3, 6);
        }
      } else {
        fl.t += dt; fl.mul = Math.random() < 0.55 ? rnd(0, 0.22) : rnd(0.5, 1);
        if (fl.t > fl.dur) { fl.on = false; fl.next = rnd(5, 10); fl.mul = 1; }
      }
    } else fl.mul = 1;

    // spider movement: circles the light, stalks in stop-start creeps, lunges
    sp.phi += dt * 0.55;
    var ro = 90 * S;
    var dx = L.x + Math.cos(sp.phi) * ro - sp.x, dy = L.y + Math.sin(sp.phi) * ro - sp.y;
    var d = Math.hypot(dx, dy) || 1;
    var dl = Math.hypot(L.x - sp.x, L.y - sp.y);

    // jump scare: hold the light near it too long and it lunges at the screen
    if (jump.enabled && !reduce && !jump.on) {
      jump.cool -= dt;
      if (dl < 130 * S) jump.near += dt; else jump.near = Math.max(0, jump.near - dt * 0.5);
      if (jump.cool <= 0 && jump.near > 6) { jump.on = true; jump.t = 0; sting(); }
    }
    var zoom = 1, zp = 0, flash = 0;
    if (jump.on) {
      jump.t += dt;
      var ju = jump.t / JT;
      if (ju < 0.14) zp = ju / 0.14; else if (ju < 0.62) zp = 1; else zp = Math.max(0, 1 - (ju - 0.62) / 0.3);
      zp = zp * zp * (3 - 2 * zp);
      zoom = 1 + (ZMAX - 1) * zp;
      flash = ju < 0.2 ? 1 - ju / 0.2 : 0;
      shake.x = (Math.random() - 0.5) * 22 * zp; shake.y = (Math.random() - 0.5) * 22 * zp;
      if (ju >= 1) { jump.on = false; jump.cool = rnd(14, 22); jump.near = 0; sp.scare = 1.2; }
    } else { shake.x = 0; shake.y = 0; }
    var maxV = 62 * S * (0.5 + 0.5 * Math.abs(Math.sin(sp.t * 1.6))), resp = 3;
    sp.lungeIn -= dt;
    if (!reduce && sp.lunge <= 0 && sp.lungeIn <= 0) {
      if (dl > 150 * S) sp.lunge = rnd(0.22, 0.38);
      sp.lungeIn = rnd(3, 7);
    }
    if (!reduce && L.speed > 1700 && dl < R * 0.8 && sp.scare <= 0) sp.scare = 0.5;
    if (sp.scare > 0) {
      sp.scare -= dt;
      dx = sp.x - L.x; dy = sp.y - L.y; d = Math.hypot(dx, dy) || 1;
      maxV = 330 * S; resp = 10;
    } else if (sp.lunge > 0) {
      sp.lunge -= dt; maxV = (reduce ? 260 : 540) * S; resp = 14;
    }
    var slow = clamp((d - 6 * S) / (50 * S), 0, 1), kk = 1 - Math.exp(-dt * resp);
    sp.vx += (dx / d * maxV * slow - sp.vx) * kk;
    sp.vy += (dy / d * maxV * slow - sp.vy) * kk;
    if (jump.on) { sp.vx = 0; sp.vy = 0; }
    sp.x = clamp(sp.x + sp.vx * dt, -40, W + 40);
    sp.y = clamp(sp.y + sp.vy * dt, -40, H + 40);
    var spd = Math.hypot(sp.vx, sp.vy);
    var th = (spd > 12 * S && sp.scare <= 0) ? Math.atan2(sp.vy, sp.vx) : Math.atan2(L.y - sp.y, L.x - sp.x);
    sp.h += angDiff(th, sp.h) * (1 - Math.exp(-dt * (sp.lunge > 0 ? 16 : 7)));
    hc = Math.cos(sp.h); hs = Math.sin(sp.h);

    // feet: diagonal gait, step when a foot falls behind its rest spot
    var stepping = [0, 0], i, l;
    for (i = 0; i < legs.length; i++) if (legs[i].stepping) stepping[legs[i].group]++;
    var thr = 34 * S;
    for (i = 0; i < legs.length; i++) {
      l = legs[i];
      var hipx = wx(HX[l.j] * S, l.side * HY * S), hipy = wy(HX[l.j] * S, l.side * HY * S);
      var rx = wx(RX[l.j] * S, l.side * RY[l.j] * S), ry = wy(RX[l.j] * S, l.side * RY[l.j] * S);
      if (l.stepping) {
        l.t += dt / l.dur;
        if (l.t >= 1) {
          l.t = 1; l.stepping = false; l.lift = 0; stepping[l.group]--;
          l.foot.x = l.to.x; l.foot.y = l.to.y; tick();
        } else {
          var e = l.t * l.t * (3 - 2 * l.t);
          l.foot.x = l.from.x + (l.to.x - l.from.x) * e;
          l.foot.y = l.from.y + (l.to.y - l.from.y) * e;
          l.lift = Math.sin(Math.PI * l.t);
        }
      } else {
        var fd = Math.hypot(l.foot.x - rx, l.foot.y - ry);
        var over = Math.hypot(l.foot.x - hipx, l.foot.y - hipy) > (L1[l.j] + L2[l.j]) * S * 0.97;
        if (fd > thr && (over || stepping[1 - l.group] === 0)) {
          l.from.x = l.foot.x; l.from.y = l.foot.y;
          l.to.x = rx + sp.vx * 0.12; l.to.y = ry + sp.vy * 0.12;
          l.t = 0; l.stepping = true; stepping[l.group]++;
          l.dur = clamp(0.2 - spd / (900 * S), 0.07, 0.2);
        }
      }
    }

    /* --- draw --- */
    ctx.setTransform(DPR, 0, 0, DPR, shake.x * DPR, shake.y * DPR);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.drawImage(bg, -24, -24, W + 48, H + 48);

    updateKids(dt);
    for (i = 0; i < kids.length; i++) drawKid(kids[i]);

    ctx.save();
    if (zp > 0) {
      var zx = sp.x + (W / 2 - sp.x) * zp, zy = sp.y + (H / 2 - sp.y) * zp;
      ctx.translate(zx, zy); ctx.scale(zoom, zoom); ctx.translate(-sp.x, -sp.y);
    }
    for (i = 0; i < legs.length; i++) {
      l = legs[i];
      var hx2 = wx(HX[l.j] * S, l.side * HY * S), hy2 = wy(HX[l.j] * S, l.side * HY * S);
      var kn = knee(hx2, hy2, l.foot.x, l.foot.y, L1[l.j] * S, L2[l.j] * S, -hs * l.side, hc * l.side);
      drawLeg(l, hx2, hy2, kn);
    }
    drawBody(0.03 * Math.sin(sp.t * 2.1));
    ctx.restore();

    // darkness with a flashlight hole
    var lm = fl.mul, amb = 0.958 - 0.6 * zp, rr = R * (0.985 + Math.random() * 0.015);
    var af = amb / 0.958, stops = [[0, 0], [0.4, 0.12 * af], [0.72, 0.55 * af], [1, amb]];
    var dg = ctx.createRadialGradient(L.x, L.y, 0, L.x, L.y, rr);
    for (i = 0; i < stops.length; i++) {
      dg.addColorStop(stops[i][0], 'rgba(0,0,0,' + (stops[i][1] * lm + amb * (1 - lm)).toFixed(3) + ')');
    }
    ctx.fillStyle = dg; ctx.fillRect(-30, -30, W + 60, H + 60);
    if (flash > 0) {
      ctx.fillStyle = 'rgba(190,10,20,' + (0.5 * flash).toFixed(3) + ')';
      ctx.fillRect(-30, -30, W + 60, H + 60);
    }

    // warm tint in the beam
    ctx.globalCompositeOperation = 'lighter';
    var wg = ctx.createRadialGradient(L.x, L.y, 0, L.x, L.y, rr * 0.9);
    wg.addColorStop(0, 'rgba(255,232,185,' + (0.09 * lm).toFixed(3) + ')');
    wg.addColorStop(1, 'rgba(255,232,185,0)');
    ctx.fillStyle = wg; ctx.fillRect(L.x - rr, L.y - rr, rr * 2, rr * 2);

    var prox = clamp(1 - dl / (450 * S), 0, 1);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';

    heartbeat(prox);
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  resetSpider();
  requestAnimationFrame(frame);
})();
