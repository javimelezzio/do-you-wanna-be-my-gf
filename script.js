const envelope = document.getElementById('envelope');
const card = document.getElementById('card');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const note = document.getElementById('note');

let opened = false;

// Open the envelope and show the card
envelope.addEventListener('click', () => {
  if (opened) return;
  opened = true;

  envelope.classList.add('open');
  envelope.setAttribute('aria-expanded', 'true');

  setTimeout(() => {
    card.classList.add('show');
    card.setAttribute('aria-hidden', 'false');
    initNoMotion();
  }, 380);
});

// ===== NO button moves around the screen (lightweight) =====
let noX = 0, noY = 0;
let vx = 260; // px/sec
let vy = 210; // px/sec
let noW = 120, noH = 46;

let raf = null;
let lastT = 0;

function initNoMotion() {
  const r = noBtn.getBoundingClientRect();
  noW = r.width || noW;
  noH = r.height || noH;

  noBtn.style.position = 'fixed';
  noBtn.style.left = '0px';
  noBtn.style.top = '0px';
  noBtn.style.right = 'auto';
  noBtn.style.zIndex = '9999';
  noBtn.style.willChange = 'transform';

  noX = window.innerWidth * 0.70 - noW / 2;
  noY = window.innerHeight * 0.62 - noH / 2;
  noBtn.style.transform = `translate3d(${noX}px, ${noY}px, 0)`;

  startNoMotion();
}

function startNoMotion() {
  stopNoMotion();
  lastT = 0;
  raf = requestAnimationFrame(stepNo);
}

function stopNoMotion() {
  if (raf) cancelAnimationFrame(raf);
  raf = null;
}

function stepNo(t) {
  if (!lastT) lastT = t;
  const dt = Math.min(0.033, (t - lastT) / 1000);
  lastT = t;

  noX += vx * dt;
  noY += vy * dt;

  const m = 8;
  const maxX = Math.max(m, window.innerWidth - noW - m);
  const maxY = Math.max(m, window.innerHeight - noH - m);

  if (noX <= m) { noX = m; vx = Math.abs(vx); }
  if (noX >= maxX) { noX = maxX; vx = -Math.abs(vx); }
  if (noY <= m) { noY = m; vy = Math.abs(vy); }
  if (noY >= maxY) { noY = maxY; vy = -Math.abs(vy); }

  noBtn.style.transform = `translate3d(${noX}px, ${noY}px, 0)`;
  raf = requestAnimationFrame(stepNo);
}

// ===== YES button grows to cover the screen =====
let yesScale = 1;

function setYesScale() {
  document.documentElement.style.setProperty('--yesScale', yesScale.toFixed(3));
}

function scaleToCoverScreen() {
  const r = yesBtn.getBoundingClientRect();
  const w = Math.max(1, r.width);
  const h = Math.max(1, r.height);
  return Math.max(window.innerWidth / w, window.innerHeight / h) * 1.35;
}

function growYes() {
  const target = scaleToCoverScreen();
  const remaining = Math.max(0, target - yesScale);
  const step = Math.max(0.14, Math.min(0.7, remaining * 0.2));
  yesScale = Math.min(target, yesScale + step);
  setYesScale();

  if (yesScale >= target * 0.92) {
    noBtn.style.display = 'none';
    stopNoMotion();
  }
}

noBtn.addEventListener('mouseenter', () => {
  growYes();
  vx *= 1.03;
  vy *= 1.03;
});

noBtn.addEventListener('click', () => {
  growYes();
  note.textContent = "Are you sure? This NO is hard to catch…";
});

// ===== Open a love letter in a new tab (generated from index) =====
function openLetterInNewTab() {
  const letter = `Hi,

I just want to tell you something honestly:
being with you makes everything feel better.
I love your vibe, your smile, and the way you make my day brighter.

I don’t want perfect— I want real:
to respect you, support you, and choose you every day.

Thank you for being you.
With all my heart,
— Me`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>For you 💌</title>
  <style>
    *{ box-sizing:border-box; }
    body{
      margin:0; min-height:100vh; display:grid; place-items:center;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      background:
        radial-gradient(900px 520px at 18% 18%, rgba(255,77,141,.20), transparent 60%),
        radial-gradient(900px 520px at 82% 22%, rgba(124,58,237,.16), transparent 60%),
        linear-gradient(180deg, #070014, #1a0030);
      color: rgba(255,255,255,.92);
      padding: 18px;
    }
    .paper{
      width:min(860px, 94vw);
      border-radius:22px;
      background: rgba(255,255,255,.10);
      border: 1px solid rgba(255,255,255,.18);
      backdrop-filter: blur(12px);
      box-shadow: 0 30px 90px rgba(0,0,0,.45);
      overflow:hidden;
    }
    .top{
      padding: 18px;
      border-bottom: 1px solid rgba(255,255,255,.14);
      display:flex; gap:12px; align-items:center;
    }
    .seal{
      width:44px; height:44px; border-radius:999px;
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.55), transparent 55%),
                  linear-gradient(135deg, #ff8dbb, #ff2e6f);
      box-shadow: 0 12px 30px rgba(255,46,111,.24), 0 0 0 1px rgba(255,255,255,.16) inset;
      flex: 0 0 auto;
    }
    h1{ margin:0; font-size:20px; }
    .sub{ margin:4px 0 0; opacity:.78; font-size:13px; }
    .body{ padding: 18px; }
    pre{ margin:0; white-space:pre-wrap; line-height:1.65; font-size:16px; color: rgba(255,255,255,.88); }
    .btns{ display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; margin-top: 16px; }
    button{
      padding:12px 14px; border-radius:14px; border:0; cursor:pointer;
      font-weight:900; letter-spacing:.2px; color:#250010;
      background: linear-gradient(135deg, #ff96c2, #ff2e6f 60%, #ff4d8d);
      box-shadow: 0 16px 34px rgba(255,46,111,.22), 0 0 0 1px rgba(255,255,255,.12) inset;
    }
    .ghost{
      background: rgba(0,0,0,.22);
      color: rgba(255,255,255,.90);
      border: 1px solid rgba(255,255,255,.14);
      box-shadow: 0 10px 22px rgba(0,0,0,.18);
    }
  </style>
</head>
<body>
  <main class="paper">
    <header class="top">
      <div class="seal"></div>
      <div>
        <h1>A letter for you</h1>
        <div class="sub">I wrote this from the heart</div>
      </div>
    </header>
    <section class="body">
      <pre id="t"></pre>
      <div class="btns">
        <button class="ghost" id="copy">Copy</button>
        <button id="close">Close</button>
      </div>
    </section>
  </main>

  <script>
    const text = ${JSON.stringify(letter)};
    document.getElementById('t').textContent = text;

    document.getElementById('close').addEventListener('click', () => window.close());
    document.getElementById('copy').addEventListener('click', async () => {
      try{
        await navigator.clipboard.writeText(text);
        const b = document.getElementById('copy');
        b.textContent = 'Copied!';
        setTimeout(() => b.textContent = 'Copy', 1200);
      }catch{
        alert('Could not copy. Please copy manually.');
      }
    });
  </script>
</body>
</html>`;

  const w = window.open('', '_blank');
  if (!w) return false;

  w.document.open();
  w.document.write(html);
  w.document.close();
  return true;
}

// YES click
yesBtn.addEventListener('click', () => {
  yesScale = Math.max(yesScale, scaleToCoverScreen());
  setYesScale();

  yesBtn.style.display = 'none';
  noBtn.style.display = 'none';
  stopNoMotion();

  note.textContent = "I knew you would say yes!";

  const ok = openLetterInNewTab();
  if (!ok) note.textContent = "I knew you would say yes! (Enable pop-ups to see the letter)";
});

// Keep YES covering the screen if resized
window.addEventListener('resize', () => {
  if (yesScale > 1.01) {
    yesScale = Math.max(yesScale, scaleToCoverScreen());
    setYesScale();
  }
});
