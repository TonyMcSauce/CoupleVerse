/* =============================================
   COUPLEVERSE – script.js
   ============================================= */

// ─── Sound Engine ───────────────────────────────────────────────
const SFX = {
  ctx: null,
  init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
  play(type) {
    try {
      this.init();
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.connect(g); g.connect(this.ctx.destination);
      const t = this.ctx.currentTime;
      switch(type) {
        case 'click':
          o.frequency.setValueAtTime(800, t);
          o.frequency.exponentialRampToValueAtTime(400, t+0.1);
          g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t+0.1);
          o.start(t); o.stop(t+0.1); break;
        case 'success':
          [523,659,784,1047].forEach((f,i)=>{
            const o2=this.ctx.createOscillator(),g2=this.ctx.createGain();
            o2.connect(g2); g2.connect(this.ctx.destination);
            o2.frequency.value=f; g2.gain.setValueAtTime(0.1,t+i*0.12);
            g2.gain.exponentialRampToValueAtTime(0.001,t+i*0.12+0.2);
            o2.start(t+i*0.12); o2.stop(t+i*0.12+0.2);
          }); break;
        case 'flip':
          o.frequency.setValueAtTime(300, t);
          o.frequency.exponentialRampToValueAtTime(600, t+0.08);
          g.gain.setValueAtTime(0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t+0.15);
          o.start(t); o.stop(t+0.15); break;
        case 'spin':
          o.type='sawtooth'; o.frequency.setValueAtTime(200,t);
          o.frequency.exponentialRampToValueAtTime(100,t+0.4);
          g.gain.setValueAtTime(0.08,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.4);
          o.start(t); o.stop(t+0.4); break;
        case 'timer':
          o.frequency.value=440; g.gain.setValueAtTime(0.12,t);
          g.gain.exponentialRampToValueAtTime(0.001,t+0.05);
          o.start(t); o.stop(t+0.05); break;
        case 'wrong':
          o.frequency.setValueAtTime(300,t); o.frequency.setValueAtTime(200,t+0.1);
          g.gain.setValueAtTime(0.1,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.2);
          o.start(t); o.stop(t+0.2); break;
      }
    } catch(e) {}
  }
};

// ─── Particle System ────────────────────────────────────────────
function initParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random()*100}%;
      width: ${2+Math.random()*4}px;
      height: ${2+Math.random()*4}px;
      animation-duration: ${8+Math.random()*12}s;
      animation-delay: ${Math.random()*12}s;
      opacity: ${0.1+Math.random()*0.3};
    `;
    container.appendChild(p);
  }
}

// ─── Theme ──────────────────────────────────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeToggle').querySelector('.theme-icon').textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('cv_theme', isDark ? 'light' : 'dark');
}
function loadTheme() {
  const t = localStorage.getItem('cv_theme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
  document.getElementById('themeToggle').querySelector('.theme-icon').textContent = t === 'dark' ? '☀️' : '🌙';
}

// ─── Navigation ─────────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${name}`);
  if (page) { page.classList.add('active'); page.scrollTop = 0; window.scrollTo(0,0); }
  // Update nav
  document.querySelectorAll('.nav-link').forEach((l, i) => {
    const pages = ['home','games','about'];
    l.classList.toggle('active', pages[i] === name);
  });
  SFX.play('click');
}
function setActiveNav(el) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  el.classList.add('active');
}
function setActiveNavMobile(el) {}
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// ─── Game Data ───────────────────────────────────────────────────
const GAMES = [
  {
    id: 'guess',
    icon: '🔮',
    title: 'Guess My Answer',
    desc: 'Answer secretly, then see if your hearts think alike.',
    tag: '2 Players',
    color1: '#e8604c', color2: '#f4a261',
    delay: '0s'
  },
  {
    id: 'deep',
    icon: '💬',
    title: 'Deep Questions',
    desc: 'A deck of thoughtful questions to explore each other\'s world.',
    tag: 'Conversation',
    color1: '#667eea', color2: '#764ba2',
    delay: '0.05s'
  },
  {
    id: 'truthdare',
    icon: '🎲',
    title: 'Truth or Dare',
    desc: 'The couple edition. Sweet, playful, and a little spicy.',
    tag: 'Dare Edition',
    color1: '#f7971e', color2: '#ffd200',
    delay: '0.1s'
  },
  {
    id: 'compliment',
    icon: '💝',
    title: 'Compliment Battle',
    desc: 'Shower each other with love. First to run dry loses.',
    tag: 'Timed',
    color1: '#f4a8c0', color2: '#c77dff',
    delay: '0.15s'
  },
  {
    id: 'memory',
    icon: '🧠',
    title: 'Memory Lane',
    desc: 'How well do you remember your story together?',
    tag: 'Trivia',
    color1: '#43b89c', color2: '#2ecc71',
    delay: '0.2s'
  },
  {
    id: 'emoji',
    icon: '😍',
    title: 'Emoji Story',
    desc: 'Tell your memories in emojis. Can they crack the code?',
    tag: 'Creative',
    color1: '#fd79a8', color2: '#e17055',
    delay: '0.25s'
  },
  {
    id: 'date',
    icon: '🎡',
    title: 'Date Idea Generator',
    desc: 'Spin the wheel and let fate plan your next adventure.',
    tag: 'Spin & Play',
    color1: '#00b894', color2: '#0984e3',
    delay: '0.3s'
  }
];

function renderGames() {
  ['homeGamesGrid','gamesPageGrid'].forEach(id => {
    const grid = document.getElementById(id);
    if (!grid) return;
    grid.innerHTML = GAMES.map((g, i) => `
      <div class="game-card" style="--card-color1:${g.color1};--card-color2:${g.color2};animation-delay:${g.delay}" onclick="openGame('${g.id}')">
        <span class="card-icon">${g.icon}</span>
        <div class="card-tag">${g.tag}</div>
        <div class="card-title">${g.title}</div>
        <div class="card-desc">${g.desc}</div>
        <button class="play-btn" onclick="event.stopPropagation();openGame('${g.id}')">Play Game →</button>
      </div>
    `).join('');
  });
}

// ─── Game Overlay ────────────────────────────────────────────────
function openGame(id) {
  SFX.play('click');
  const overlay = document.getElementById('gameOverlay');
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  const content = document.getElementById('gameContent');
  const game = GAMES.find(g => g.id === id);
  content.style.setProperty('--card-color1', game?.color1 || '#e8604c');
  content.style.setProperty('--card-color2', game?.color2 || '#f4a261');
  switch(id) {
    case 'guess': renderGuessGame(content); break;
    case 'deep': renderDeepGame(content); break;
    case 'truthdare': renderTruthDare(content); break;
    case 'compliment': renderCompliment(content); break;
    case 'memory': renderMemory(content); break;
    case 'emoji': renderEmojiStory(content); break;
    case 'date': renderDateWheel(content); break;
  }
}
function closeGame() {
  SFX.play('click');
  document.getElementById('gameOverlay').classList.add('hidden');
  document.body.style.overflow = '';
  stopComplimentTimer();
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeGame(); });
document.getElementById('gameOverlay')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeGame();
});

// ─────────────────────────────────────────────────────────────────
// GAME 1: GUESS MY ANSWER
// ─────────────────────────────────────────────────────────────────
const GUESS_QUESTIONS = [
  "What is my dream vacation destination?",
  "What food reminds you of our first date?",
  "What is my go-to comfort food?",
  "What would I choose as my superpower?",
  "What's my biggest pet peeve?",
  "What is my favorite season and why?",
  "What song would play when I enter a room?",
  "What's my most embarrassing talent?",
  "What would I buy if I won the lottery?",
  "What's the weirdest thing I find attractive?",
  "What childhood dream do I still secretly hold?",
  "What's my ideal lazy Sunday?",
  "What would my last meal be?",
  "What animal best represents my personality?",
  "What's my most used emoji?",
];
let guessState = { q: 0, p1: '', p2: '', scores: [0,0], phase: 'rules' };

function renderGuessGame(el) {
  guessState = { q: 0, p1: '', p2: '', scores: [0,0], phase: 'rules' };
  el.innerHTML = `
    <div class="game-header">
      <span class="game-icon-big">🔮</span>
      <div class="game-title-big">Guess My Answer</div>
      <div class="game-subtitle">Answer secretly, then reveal together</div>
    </div>
    <div id="guessInner"></div>
  `;
  renderGuessPhase();
}
function renderGuessPhase() {
  const el = document.getElementById('guessInner');
  if (!el) return;
  const q = GUESS_QUESTIONS[guessState.q % GUESS_QUESTIONS.length];
  switch(guessState.phase) {
    case 'rules':
      el.innerHTML = `
        <div class="rules-card">
          <div class="rules-title">How to Play</div>
          <ul class="rules-list">
            <li>Read the question aloud to each other</li>
            <li>Both players type their answers secretly</li>
            <li>Tap "Reveal" to see both answers together</li>
            <li>Similar answers? Both earn a point!</li>
            <li>Use this as a conversation starter</li>
          </ul>
        </div>
        <div class="score-bar">
          <div class="score-item"><div class="score-label">Player 1</div><div class="score-value" id="gs1">0</div></div>
          <div class="score-divider"></div>
          <div class="score-item"><div class="score-label">Player 2</div><div class="score-value" id="gs2">0</div></div>
        </div>
        <button class="btn btn-primary btn-full" onclick="guessState.phase='p1';renderGuessPhase()">Start Game →</button>
      `; break;
    case 'p1':
      el.innerHTML = `
        <div class="turn-badge">👤 Player 1's Turn</div>
        <div class="question-card"><div class="question-text">${q}</div></div>
        <div class="input-group">
          <label class="input-label">Your answer (Player 1)</label>
          <input class="game-input" id="gp1input" placeholder="Type secretly…" type="text" autocomplete="off">
        </div>
        <button class="btn btn-primary btn-full" onclick="submitGuessP1()">Lock In Answer →</button>
      `;
      document.getElementById('gp1input')?.focus();
      break;
    case 'p2':
      el.innerHTML = `
        <div class="turn-badge">👤 Player 2's Turn</div>
        <div class="question-card"><div class="question-text">${q}</div></div>
        <div class="input-group">
          <label class="input-label">Your answer (Player 2)</label>
          <input class="game-input" id="gp2input" placeholder="Type secretly…" type="text" autocomplete="off">
        </div>
        <button class="btn btn-primary btn-full" onclick="submitGuessP2()">Lock In Answer →</button>
      `;
      document.getElementById('gp2input')?.focus();
      break;
    case 'reveal':
      const match = guessState.p1.toLowerCase().trim() === guessState.p2.toLowerCase().trim();
      el.innerHTML = `
        <div class="question-card" style="margin-bottom:16px"><div class="question-text">${q}</div></div>
        <div class="answer-reveal">
          <div class="answer-box ${match?'match':'no-match'}">
            <div class="answer-name">Player 1</div>
            <div class="answer-val">${guessState.p1 || '—'}</div>
          </div>
          <div class="answer-box ${match?'match':'no-match'}">
            <div class="answer-name">Player 2</div>
            <div class="answer-val">${guessState.p2 || '—'}</div>
          </div>
        </div>
        ${match ? `<div style="text-align:center;margin-bottom:16px"><span style="font-size:2rem">🎉</span><br><strong style="color:var(--accent)">You think alike! Both earn a point!</strong></div>` : `<div style="text-align:center;margin-bottom:16px;color:var(--text2)">Different answers – talk about it! 💬</div>`}
        <div class="score-bar">
          <div class="score-item"><div class="score-label">Player 1</div><div class="score-value">${guessState.scores[0]}</div></div>
          <div class="score-divider"></div>
          <div class="score-item"><div class="score-label">Player 2</div><div class="score-value">${guessState.scores[1]}</div></div>
        </div>
        <button class="btn btn-primary btn-full" onclick="nextGuessQuestion()">Next Question →</button>
      `;
      if (match) { SFX.play('success'); } else { SFX.play('flip'); }
      break;
  }
}
function submitGuessP1() {
  const v = document.getElementById('gp1input')?.value?.trim();
  if (!v) return;
  guessState.p1 = v; guessState.phase = 'p2';
  SFX.play('click'); renderGuessPhase();
}
function submitGuessP2() {
  const v = document.getElementById('gp2input')?.value?.trim();
  if (!v) return;
  guessState.p2 = v;
  const match = guessState.p1.toLowerCase() === guessState.p2.toLowerCase();
  if (match) { guessState.scores[0]++; guessState.scores[1]++; }
  guessState.phase = 'reveal';
  SFX.play('click'); renderGuessPhase();
}
function nextGuessQuestion() {
  guessState.q++; guessState.p1=''; guessState.p2=''; guessState.phase='p1';
  SFX.play('flip'); renderGuessPhase();
}

// ─────────────────────────────────────────────────────────────────
// GAME 2: DEEP QUESTIONS
// ─────────────────────────────────────────────────────────────────
const DEEP_QUESTIONS = [
  "What is one thing you admire most about me?",
  "When do you feel most loved by me?",
  "What's a memory with me that still makes you smile?",
  "What's something you've always wanted to tell me but never did?",
  "What does home feel like to you?",
  "What's your biggest fear in our relationship?",
  "What's a goal you've been too afraid to share?",
  "What does love mean to you in one sentence?",
  "What's one thing I do that makes you feel truly seen?",
  "If you could relive one moment of our relationship, what would it be?",
  "What's something small I do that secretly means a lot to you?",
  "What's your love language, and do I speak it well?",
  "What's one adventure you dream of us having together?",
  "What would the perfect day with me look like?",
  "What's something you wish I understood better about you?",
  "What are you most grateful for in us?",
  "What moment made you realize you wanted to be with me?",
  "What's one thing you want us to work on together?",
  "What's your favorite thing about the way we communicate?",
  "How have I changed you for the better?",
];
let deepIdx = 0;
let deepFlipped = false;

function renderDeepGame(el) {
  deepIdx = Math.floor(Math.random() * DEEP_QUESTIONS.length);
  deepFlipped = false;
  el.innerHTML = `
    <div class="game-header">
      <span class="game-icon-big">💬</span>
      <div class="game-title-big">Deep Questions</div>
      <div class="game-subtitle">Tap the card to reveal each question</div>
    </div>
    <div class="rules-card">
      <div class="rules-title">How to Play</div>
      <ul class="rules-list">
        <li>Tap the card to reveal a question</li>
        <li>Both partners answer honestly and fully</li>
        <li>No skipping unless both agree</li>
        <li>After answering, tap "Next" for another card</li>
      </ul>
    </div>
    <div style="text-align:center;margin-bottom:8px;color:var(--text3);font-size:0.85rem">Tap to reveal</div>
    <div class="question-card" id="deepCard" onclick="flipDeepCard()">
      <div class="question-text" id="deepQ">Tap to reveal ✨</div>
    </div>
    <div class="btn-row" style="justify-content:center;margin-top:16px">
      <button class="btn btn-secondary" onclick="deepSkip()">Skip</button>
      <button class="btn btn-primary" onclick="deepNext()">Next Question →</button>
    </div>
    <div style="margin-top:16px;text-align:center;color:var(--text3);font-size:0.85rem" id="deepCount">Card 1 of ${DEEP_QUESTIONS.length}</div>
  `;
}
function flipDeepCard() {
  if (!deepFlipped) {
    document.getElementById('deepQ').textContent = DEEP_QUESTIONS[deepIdx];
    deepFlipped = true;
    SFX.play('flip');
    document.getElementById('deepCard').style.background = 'linear-gradient(135deg,var(--card-color1,#667eea),var(--card-color2,#764ba2))';
  }
}
function deepNext() {
  deepIdx = (deepIdx + 1) % DEEP_QUESTIONS.length;
  deepFlipped = false;
  const card = document.getElementById('deepCard');
  const qEl = document.getElementById('deepQ');
  if (card && qEl) {
    card.style.background = 'linear-gradient(135deg,var(--card-color1,#667eea),var(--card-color2,#764ba2))';
    qEl.textContent = 'Tap to reveal ✨';
    card.style.background = '';
    document.getElementById('deepCount').textContent = `Card ${deepIdx+1} of ${DEEP_QUESTIONS.length}`;
    SFX.play('click');
  }
}
function deepSkip() { deepNext(); }

// ─────────────────────────────────────────────────────────────────
// GAME 3: TRUTH OR DARE
// ─────────────────────────────────────────────────────────────────
const TRUTHS = [
  "What's something you've never told anyone about yourself?",
  "What's the most embarrassing thing you've done in front of me?",
  "What's a silly thing you find super attractive about me?",
  "If you had to describe me using only a food, what would it be?",
  "What's the first thing you noticed about me?",
  "What's your biggest insecurity, and how can I help with it?",
  "Have you ever had a dream about me? What happened?",
  "What song do you secretly think is 'our song'?",
  "What's a habit of mine that secretly melts your heart?",
  "What would you change about our relationship if you could?",
  "What's the funniest thing I've ever done?",
  "What's your guilty pleasure that you haven't told me?",
  "If I were a movie character, who would I be?",
  "What's one thing I do that you find irresistibly cute?",
  "What's a compliment you've wanted to give me for a long time?",
];
const DARES = [
  "Give your partner a 20-second hug and hold it. ⏱️",
  "Sing the first line of your partner's favorite song. 🎵",
  "Say three things you love about your partner right now. ❤️",
  "Give your partner a 5-second forehead kiss. 💋",
  "Text a family member: 'I have the best partner in the world.' 📱",
  "Do your best impression of your partner. 😂",
  "Tell your partner your honest first impression of them. 🤔",
  "Let your partner choose your phone wallpaper for 24 hours. 📲",
  "Speak in an accent for the next 3 minutes. 🎭",
  "Give your partner a 30-second back massage. 💆",
  "Share one thing you're grateful for about today. ✨",
  "Create a 10-second dance move and teach it to your partner. 💃",
  "Write your partner a compliment on a piece of paper. 📝",
  "Let your partner pick your outfit tomorrow. 👗",
  "Do your best 'cooking show voice' and narrate making a snack. 🍳",
];
let tdScores = [0, 0];

function renderTruthDare(el) {
  tdScores = [0,0];
  el.innerHTML = `
    <div class="game-header">
      <span class="game-icon-big">🎲</span>
      <div class="game-title-big">Truth or Dare</div>
      <div class="game-subtitle">The couple edition</div>
    </div>
    <div class="rules-card">
      <div class="rules-title">How to Play</div>
      <ul class="rules-list">
        <li>Take turns choosing Truth or Dare</li>
        <li>The game generates a random prompt for you</li>
        <li>Complete the challenge honestly</li>
        <li>If you refuse, the other player earns a point</li>
      </ul>
    </div>
    <div class="score-bar">
      <div class="score-item"><div class="score-label">Player 1</div><div class="score-value" id="tds1">0</div></div>
      <div class="score-divider"></div>
      <div class="score-item"><div class="score-label">Player 2</div><div class="score-value" id="tds2">0</div></div>
    </div>
    <div class="truth-dare-row">
      <button class="btn-truth" onclick="pickTD('truth')">🤔 Truth</button>
      <button class="btn-dare" onclick="pickTD('dare')">⚡ Dare</button>
    </div>
    <div id="tdChallenge"></div>
  `;
}
function pickTD(type) {
  SFX.play('flip');
  const list = type === 'truth' ? TRUTHS : DARES;
  const item = list[Math.floor(Math.random()*list.length)];
  const bg = type === 'truth'
    ? 'linear-gradient(135deg,#667eea,#764ba2)'
    : 'linear-gradient(135deg,#f7971e,#ffd200)';
  const col = type === 'dare' ? '#1a1206' : 'white';
  document.getElementById('tdChallenge').innerHTML = `
    <div class="challenge-card" style="border-color:${type==='truth'?'#667eea':'#f7971e'}">
      <div class="challenge-type">${type === 'truth' ? '🤔 Truth' : '⚡ Dare'}</div>
      <div class="challenge-text">${item}</div>
    </div>
    <div class="btn-row" style="justify-content:center">
      <button class="btn btn-secondary" onclick="tdRefuse()">😅 Refuse (+1 opp)</button>
      <button class="btn btn-primary" onclick="tdDone()">✅ Done!</button>
    </div>
    <div style="margin-top:12px;text-align:center;color:var(--text3);font-size:0.8rem">Whose turn is it? Tap above to pick again</div>
  `;
}
function tdRefuse() { SFX.play('wrong'); }
function tdDone() { SFX.play('success'); }

// ─────────────────────────────────────────────────────────────────
// GAME 4: COMPLIMENT BATTLE
// ─────────────────────────────────────────────────────────────────
let compState = { player: 1, history: [], timerVal: 30, timerInt: null, running: false, scores: [0,0] };

function renderCompliment(el) {
  compState = { player: 1, history: [], timerVal: 30, timerInt: null, running: false, scores: [0,0] };
  el.innerHTML = `
    <div class="game-header">
      <span class="game-icon-big">💝</span>
      <div class="game-title-big">Compliment Battle</div>
      <div class="game-subtitle">Alternate compliments until someone runs dry</div>
    </div>
    <div class="rules-card">
      <div class="rules-title">How to Play</div>
      <ul class="rules-list">
        <li>Players alternate giving compliments</li>
        <li>You have 30 seconds per turn</li>
        <li>Compliments cannot be repeated</li>
        <li>If you repeat or run out of time, the other player earns a point</li>
      </ul>
    </div>
    <div class="score-bar">
      <div class="score-item"><div class="score-label">Player 1</div><div class="score-value" id="cps1">0</div></div>
      <div class="score-divider"></div>
      <div class="score-item"><div class="score-label">Player 2</div><div class="score-value" id="cps2">0</div></div>
    </div>
    <div class="turn-badge" id="compTurnBadge">👤 Player 1's Turn</div>
    <div class="timer-ring">
      <div class="timer-display" id="compTimer">30</div>
      <div class="timer-label">seconds</div>
    </div>
    <div class="input-group">
      <input class="game-input" id="compInput" placeholder="Type a compliment…" autocomplete="off" onkeydown="if(event.key==='Enter')submitCompliment()">
    </div>
    <div class="btn-row" style="justify-content:center;margin-bottom:16px">
      <button class="btn btn-secondary" onclick="toggleCompTimer()" id="compTimerBtn">▶ Start Timer</button>
      <button class="btn btn-primary" onclick="submitCompliment()">Send Compliment 💌</button>
    </div>
    <div class="compliment-history" id="compHistory"><div style="color:var(--text3);font-size:0.85rem;text-align:center">Compliments will appear here…</div></div>
    <div class="btn-row" style="justify-content:center;margin-top:8px">
      <button class="btn btn-secondary" onclick="compTimeout()">😅 Couldn't Think of One</button>
    </div>
  `;
}
function toggleCompTimer() {
  if (!compState.running) {
    compState.running = true;
    document.getElementById('compTimerBtn').textContent = '⏸ Pause';
    compState.timerInt = setInterval(() => {
      compState.timerVal--;
      const el = document.getElementById('compTimer');
      if (el) el.textContent = compState.timerVal;
      SFX.play('timer');
      if (compState.timerVal <= 0) compTimeout();
    }, 1000);
  } else {
    clearInterval(compState.timerInt); compState.running = false;
    document.getElementById('compTimerBtn').textContent = '▶ Resume';
  }
}
function stopComplimentTimer() { if (compState.timerInt) clearInterval(compState.timerInt); }
function resetCompTimer() {
  clearInterval(compState.timerInt); compState.timerInt = null;
  compState.running = false; compState.timerVal = 30;
  const el = document.getElementById('compTimer');
  if (el) el.textContent = '30';
  const btn = document.getElementById('compTimerBtn');
  if (btn) btn.textContent = '▶ Start Timer';
}
function submitCompliment() {
  const input = document.getElementById('compInput');
  const val = input?.value?.trim();
  if (!val) return;
  const lower = val.toLowerCase();
  const isRepeat = compState.history.some(h => h.text.toLowerCase() === lower);
  if (isRepeat) {
    SFX.play('wrong');
    input.style.borderColor = '#e8604c';
    setTimeout(() => { if (input) input.style.borderColor = ''; }, 1500);
    const other = compState.player === 1 ? 2 : 1;
    compState.scores[other-1]++;
    updateCompScores();
    showCompMessage(`😅 Repeated! Player ${other} earns a point!`, 'red');
    return;
  }
  SFX.play('success');
  compState.history.unshift({ player: compState.player, text: val });
  input.value = '';
  renderCompHistory();
  resetCompTimer();
  compState.player = compState.player === 1 ? 2 : 1;
  const badge = document.getElementById('compTurnBadge');
  if (badge) badge.textContent = `👤 Player ${compState.player}'s Turn`;
}
function compTimeout() {
  SFX.play('wrong');
  const other = compState.player === 1 ? 2 : 1;
  compState.scores[other-1]++;
  updateCompScores();
  resetCompTimer();
  showCompMessage(`⏰ Time's up! Player ${other} earns a point!`, 'red');
}
function updateCompScores() {
  const s1 = document.getElementById('cps1');
  const s2 = document.getElementById('cps2');
  if (s1) s1.textContent = compState.scores[0];
  if (s2) s2.textContent = compState.scores[1];
}
function renderCompHistory() {
  const el = document.getElementById('compHistory');
  if (!el) return;
  el.innerHTML = compState.history.map(h =>
    `<div class="compliment-item"><strong>P${h.player}:</strong> ${h.text}</div>`
  ).join('') || '<div style="color:var(--text3);font-size:0.85rem;text-align:center">Compliments will appear here…</div>';
}
function showCompMessage(msg, type) {
  const el = document.createElement('div');
  el.style.cssText = `text-align:center;padding:10px;background:rgba(232,96,76,0.1);border-radius:8px;color:var(--accent);font-weight:600;font-size:0.9rem;margin:8px 0;animation:cardIn 0.3s both`;
  el.textContent = msg;
  document.getElementById('compHistory')?.before(el);
  setTimeout(() => el.remove(), 3000);
}

// ─────────────────────────────────────────────────────────────────
// GAME 5: MEMORY LANE
// ─────────────────────────────────────────────────────────────────
const MEMORY_QUESTIONS = [
  "What was our very first movie together?",
  "What was the first gift they gave you?",
  "What did we eat on our first date?",
  "Where was our first kiss?",
  "What song was playing the first time we danced together?",
  "What was the first trip we took together?",
  "What's the first inside joke we ever had?",
  "Where were we when you first said 'I love you'?",
  "What was the first restaurant we went to together?",
  "What were you wearing on our first date?",
  "What's the first thing you cooked for me?",
  "What was the first photo we took together?",
  "What was the first show we binge-watched together?",
  "What's the first nickname you gave me?",
  "What was the first argument we had and how did we solve it?",
];
let memState = { q: 0, answerer: 1, scores: [0,0], phase: 'rules' };

function renderMemory(el) {
  memState = { q: 0, answerer: 1, scores: [0,0], phase: 'rules' };
  el.innerHTML = `
    <div class="game-header">
      <span class="game-icon-big">🧠</span>
      <div class="game-title-big">Memory Lane</div>
      <div class="game-subtitle">How well do you remember your story?</div>
    </div>
    <div id="memInner"></div>
  `;
  renderMemPhase();
}
function renderMemPhase() {
  const el = document.getElementById('memInner');
  if (!el) return;
  const q = MEMORY_QUESTIONS[memState.q % MEMORY_QUESTIONS.length];
  switch(memState.phase) {
    case 'rules':
      el.innerHTML = `
        <div class="rules-card">
          <div class="rules-title">How to Play</div>
          <ul class="rules-list">
            <li>One partner answers the question first</li>
            <li>The other confirms if it's correct</li>
            <li>Correct answers earn a point</li>
            <li>Alternate who answers each round</li>
          </ul>
        </div>
        <div class="score-bar">
          <div class="score-item"><div class="score-label">Player 1</div><div class="score-value" id="ms1">0</div></div>
          <div class="score-divider"></div>
          <div class="score-item"><div class="score-label">Player 2</div><div class="score-value" id="ms2">0</div></div>
        </div>
        <button class="btn btn-primary btn-full" onclick="memState.phase='answer';renderMemPhase()">Start Game →</button>
      `; break;
    case 'answer':
      el.innerHTML = `
        <div class="turn-badge">👤 Player ${memState.answerer} Answers</div>
        <div class="question-card"><div class="question-text">${q}</div></div>
        <div class="input-group">
          <label class="input-label">Player ${memState.answerer}'s answer</label>
          <input class="game-input" id="memInput" placeholder="Type your answer…" autocomplete="off">
        </div>
        <div class="score-bar">
          <div class="score-item"><div class="score-label">Player 1</div><div class="score-value">${memState.scores[0]}</div></div>
          <div class="score-divider"></div>
          <div class="score-item"><div class="score-label">Player 2</div><div class="score-value">${memState.scores[1]}</div></div>
        </div>
        <button class="btn btn-primary btn-full" onclick="submitMem()">Submit Answer →</button>
      `;
      document.getElementById('memInput')?.focus();
      break;
    case 'judge':
      el.innerHTML = `
        <div class="question-card" style="margin-bottom:16px"><div class="question-text">${q}</div></div>
        <div class="answer-box" style="margin-bottom:16px;text-align:center">
          <div class="answer-name">Player ${memState.answerer} said</div>
          <div class="answer-val">${memState.lastAnswer}</div>
        </div>
        <p style="text-align:center;color:var(--text2);margin-bottom:16px">Player ${memState.answerer===1?2:1}, was this correct?</p>
        <div class="btn-row" style="justify-content:center">
          <button class="btn btn-secondary" onclick="memJudge(false)">❌ Not Quite</button>
          <button class="btn btn-primary" onclick="memJudge(true)">✅ Correct!</button>
        </div>
      `; break;
  }
}
let memLastAnswer = '';
function submitMem() {
  const v = document.getElementById('memInput')?.value?.trim();
  if (!v) return;
  memState.lastAnswer = v;
  memState.phase = 'judge';
  SFX.play('click'); renderMemPhase();
}
function memJudge(correct) {
  if (correct) { memState.scores[memState.answerer-1]++; SFX.play('success'); }
  else { SFX.play('wrong'); }
  memState.answerer = memState.answerer === 1 ? 2 : 1;
  memState.q++; memState.phase = 'answer';
  renderMemPhase();
}

// ─────────────────────────────────────────────────────────────────
// GAME 6: EMOJI STORY
// ─────────────────────────────────────────────────────────────────
let emojiState = { phase: 'rules', teller: 1, scores: [0,0], currentStory: '' };

function renderEmojiStory(el) {
  emojiState = { phase: 'rules', teller: 1, scores: [0,0], currentStory: '' };
  el.innerHTML = `
    <div class="game-header">
      <span class="game-icon-big">😍</span>
      <div class="game-title-big">Emoji Story</div>
      <div class="game-subtitle">Tell memories in emojis only</div>
    </div>
    <div id="emojiInner"></div>
  `;
  renderEmojiPhase();
}
function renderEmojiPhase() {
  const el = document.getElementById('emojiInner');
  if (!el) return;
  switch(emojiState.phase) {
    case 'rules':
      el.innerHTML = `
        <div class="rules-card">
          <div class="rules-title">How to Play</div>
          <ul class="rules-list">
            <li>The Storyteller types a memory using ONLY emojis</li>
            <li>The Guesser tries to decode the emoji story</li>
            <li>Correct guess = Guesser earns a point</li>
            <li>Reveal the story if they can't guess</li>
            <li>Switch roles each round</li>
          </ul>
        </div>
        <div class="score-bar">
          <div class="score-item"><div class="score-label">Player 1</div><div class="score-value" id="es1">0</div></div>
          <div class="score-divider"></div>
          <div class="score-item"><div class="score-label">Player 2</div><div class="score-value" id="es2">0</div></div>
        </div>
        <button class="btn btn-primary btn-full" onclick="emojiState.phase='tell';renderEmojiPhase()">Start Game →</button>
      `; break;
    case 'tell':
      el.innerHTML = `
        <div class="turn-badge">✍️ Player ${emojiState.teller} is the Storyteller</div>
        <p style="color:var(--text2);font-size:0.9rem;margin-bottom:16px">Player ${emojiState.teller===1?2:1}, look away! Type a relationship memory using only emojis below.</p>
        <div class="input-group">
          <label class="input-label">Your emoji story (emojis only!)</label>
          <input class="game-input emoji-input-big" id="emojiInput" placeholder="✈️❤️🌊🍕…" autocomplete="off">
        </div>
        <div class="score-bar">
          <div class="score-item"><div class="score-label">Player 1</div><div class="score-value">${emojiState.scores[0]}</div></div>
          <div class="score-divider"></div>
          <div class="score-item"><div class="score-label">Player 2</div><div class="score-value">${emojiState.scores[1]}</div></div>
        </div>
        <button class="btn btn-primary btn-full" onclick="submitEmojiStory()">Ready to Guess! →</button>
      `;
      break;
    case 'guess':
      el.innerHTML = `
        <div class="turn-badge">🔍 Player ${emojiState.teller===1?2:1} is Guessing</div>
        <div class="emoji-display">${emojiState.currentStory}</div>
        <div class="input-group">
          <label class="input-label">What's the memory?</label>
          <input class="game-input" id="emojiGuessInput" placeholder="Describe the memory…" autocomplete="off">
        </div>
        <div class="score-bar">
          <div class="score-item"><div class="score-label">Player 1</div><div class="score-value">${emojiState.scores[0]}</div></div>
          <div class="score-divider"></div>
          <div class="score-item"><div class="score-label">Player 2</div><div class="score-value">${emojiState.scores[1]}</div></div>
        </div>
        <div class="btn-row" style="justify-content:center">
          <button class="btn btn-secondary" onclick="emojiReveal()">🙈 Reveal Story</button>
          <button class="btn btn-primary" onclick="emojiCorrect()">✅ They Got It!</button>
        </div>
      `;
      document.getElementById('emojiGuessInput')?.focus();
      break;
    case 'reveal':
      el.innerHTML = `
        <div class="emoji-display">${emojiState.currentStory}</div>
        <div class="input-group">
          <label class="input-label">The real story was…</label>
          <input class="game-input" id="emojiRealStory" placeholder="Describe the real story…" autocomplete="off">
        </div>
        <div class="score-bar">
          <div class="score-item"><div class="score-label">Player 1</div><div class="score-value">${emojiState.scores[0]}</div></div>
          <div class="score-divider"></div>
          <div class="score-item"><div class="score-label">Player 2</div><div class="score-value">${emojiState.scores[1]}</div></div>
        </div>
        <button class="btn btn-primary btn-full" onclick="emojiNextRound()">Next Round →</button>
      `;
      break;
  }
}
function submitEmojiStory() {
  const v = document.getElementById('emojiInput')?.value?.trim();
  if (!v) return;
  emojiState.currentStory = v; emojiState.phase = 'guess';
  SFX.play('flip'); renderEmojiPhase();
}
function emojiCorrect() {
  const guesser = emojiState.teller === 1 ? 2 : 1;
  emojiState.scores[guesser-1]++;
  SFX.play('success'); emojiNextRound();
}
function emojiReveal() { emojiState.phase = 'reveal'; SFX.play('click'); renderEmojiPhase(); }
function emojiNextRound() {
  emojiState.teller = emojiState.teller === 1 ? 2 : 1;
  emojiState.phase = 'tell'; emojiState.currentStory = '';
  SFX.play('click'); renderEmojiPhase();
}

// ─────────────────────────────────────────────────────────────────
// GAME 7: DATE IDEA GENERATOR (Spinning Wheel)
// ─────────────────────────────────────────────────────────────────
const DATE_IDEAS = [
  { label: 'Cook Together', icon: '👨‍🍳', desc: 'Pick a new recipe and cook it from scratch together.' },
  { label: 'Movie Night', icon: '🎬', desc: 'Build a fort, make popcorn, pick a classic film.' },
  { label: 'Midnight Walk', icon: '🌙', desc: 'Take a long walk under the stars and just talk.' },
  { label: 'First Date\nRecreation', icon: '💝', desc: 'Recreate your very first date exactly as it was.' },
  { label: 'New Restaurant', icon: '🍜', desc: 'Try that place you\'ve been meaning to visit.' },
  { label: 'Stargazing', icon: '⭐', desc: 'Find a dark spot and look up at the sky together.' },
  { label: 'Game Night', icon: '🎮', desc: 'Board games, card games, or video games — your pick.' },
  { label: 'Sunrise\nAdventure', icon: '🌅', desc: 'Wake up early and watch the sunrise with coffee.' },
  { label: 'Spa Night', icon: '🛁', desc: 'Face masks, candles, massage — treat each other.' },
  { label: 'Road Trip', icon: '🚗', desc: 'Just drive with music and no destination in mind.' },
  { label: 'Art Together', icon: '🎨', desc: 'Paint, draw, or create something side by side.' },
  { label: 'Picnic', icon: '🧺', desc: 'Pack snacks and find a beautiful outdoor spot.' },
];

let wheelAngle = 0;
let wheelSpinning = false;
let wheelResult = null;

function renderDateWheel(el) {
  el.innerHTML = `
    <div class="game-header">
      <span class="game-icon-big">🎡</span>
      <div class="game-title-big">Date Idea Generator</div>
      <div class="game-subtitle">Spin the wheel and let fate decide</div>
    </div>
    <div class="rules-card">
      <div class="rules-title">How to Play</div>
      <ul class="rules-list">
        <li>Tap the wheel (or button) to spin</li>
        <li>Whatever it lands on is your next date</li>
        <li>If both of you reject it, spin again</li>
        <li>No rejecting twice in a row!</li>
      </ul>
    </div>
    <div class="wheel-container">
      <div class="wheel-wrap">
        <div class="wheel-pointer" id="wheelPointer">▼</div>
        <canvas id="wheelCanvas" class="wheel-canvas" width="300" height="300" onclick="spinWheel()"></canvas>
      </div>
      <button class="btn btn-primary" onclick="spinWheel()" style="min-width:180px">🎡 Spin the Wheel!</button>
    </div>
    <div id="wheelResultBox" style="display:none" class="wheel-result">
      <h3 id="wrTitle"></h3>
      <p id="wrDesc"></p>
      <button class="btn btn-secondary" onclick="spinWheel()" style="margin-top:12px">Spin Again 🔄</button>
    </div>
  `;
  drawWheel(wheelAngle);
}

function drawWheel(rotation) {
  const canvas = document.getElementById('wheelCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 150, cy = 150, r = 145;
  const n = DATE_IDEAS.length;
  const slice = (2 * Math.PI) / n;
  const colors = ['#e8604c','#f4a261','#c77dff','#f4a8c0','#43b89c','#667eea','#f7971e','#2ecc71','#fd79a8','#00b894','#e17055','#6c5ce7'];
  ctx.clearRect(0,0,300,300);
  for (let i = 0; i < n; i++) {
    const start = rotation + i * slice;
    const end = start + slice;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,start,end); ctx.closePath();
    ctx.fillStyle = colors[i % colors.length]; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.save();
    ctx.translate(cx,cy); ctx.rotate(start + slice/2);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.font = 'bold 13px DM Sans, system-ui';
    ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 3;
    const label = DATE_IDEAS[i].label.replace('\n',' ');
    ctx.fillText(label.length > 12 ? label.slice(0,12)+'…' : label, r-10, 5);
    ctx.font = '16px serif'; ctx.fillText(DATE_IDEAS[i].icon, r-label.length*3.5-24, 5);
    ctx.restore();
  }
  // Center circle
  ctx.beginPath(); ctx.arc(cx,cy,22,0,2*Math.PI);
  ctx.fillStyle = '#fff'; ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#e8604c'; ctx.font = 'bold 14px DM Sans'; ctx.textAlign = 'center';
  ctx.fillText('✦', cx, cy+5);
}

function spinWheel() {
  if (wheelSpinning) return;
  wheelSpinning = true;
  SFX.play('spin');
  document.getElementById('wheelResultBox').style.display = 'none';
  const totalSpins = (5 + Math.random() * 5) * 2 * Math.PI;
  const duration = 3500 + Math.random() * 1500;
  const startAngle = wheelAngle;
  const startTime = performance.now();
  function animate(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - t, 4);
    wheelAngle = startAngle + totalSpins * ease;
    drawWheel(wheelAngle);
    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      wheelSpinning = false;
      const n = DATE_IDEAS.length;
      const slice = (2 * Math.PI) / n;
      const normalAngle = ((wheelAngle % (2*Math.PI)) + 2*Math.PI) % (2*Math.PI);
      const pointerAngle = (Math.PI*3/2 - normalAngle + 2*Math.PI) % (2*Math.PI);
      const idx = Math.floor(pointerAngle / slice) % n;
      const idea = DATE_IDEAS[idx];
      const box = document.getElementById('wheelResultBox');
      document.getElementById('wrTitle').textContent = `${idea.icon} ${idea.label.replace('\n',' ')}`;
      document.getElementById('wrDesc').textContent = idea.desc;
      box.style.display = 'block';
      SFX.play('success');
    }
  }
  requestAnimationFrame(animate);
}

// ─── Init ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  initParticles();
  renderGames();
});
