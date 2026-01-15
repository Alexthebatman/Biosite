const systemOnline = document.querySelector('.crt-screen');
const flickerContainer = document.querySelector('.flicker-container');
const newScreen = document.querySelector('.new-screen');
const buttons = document.querySelectorAll('.menu-item');

const nameContent = document.querySelector('.name-content');
const birthdayContent = document.querySelector('.birthday-content');
const likesContent = document.querySelector('.likes-content');
const dislikesContent = document.querySelector('.dislikes-content');

const favoritePeopleContent = document.querySelector('.favorite-people-content');
const notFreeContent = document.querySelector('.notfree-content');

const funFactsContent = document.querySelector('.fun-facts-content');
const inspiredContent = document.querySelector('.inspired-content');
const suggestionsContent = document.querySelector('.suggestions-content');

const infoSetInformation = document.querySelector('.info-set-information');
const infoSetAvailability = document.querySelector('.info-set-availability');
const infoSetMisc = document.querySelector('.info-set-misc');

const pongScoreboard = document.querySelector('.pong-scoreboard');
const asciiArt = document.querySelector('.ascii-art');
const infoSets = document.querySelectorAll('.info-set');

const backToPongBtn = document.querySelector('.back-to-pong');
const contentContainer = document.querySelector('.content-container');
let pointAnnounce = false;
let pointAnnounceUntil = 0;
let pointAnnounceText = '';


let userInteracted = false;
let isTransitioning = false;
let currentTypingElement = null;

function setAsciiVisible(v) {
  if (!asciiArt) return;
  asciiArt.style.display = v ? 'block' : 'none';
}

function hideAllInfoSets() {
  infoSets.forEach(set => (set.style.display = 'none'));

  const typedContents = document.querySelectorAll('.typed-content');
  typedContents.forEach(element => {
    element.textContent = '';
    const cursor = element.querySelector('.cursor');
    if (cursor) cursor.remove();
  });

  if (currentTypingElement) {
    clearInterval(currentTypingElement.interval);
    currentTypingElement = null;
  }
}

function showHomePong() {
  // hide info sets + show pong again
  hideAllInfoSets();
  setAsciiVisible(false);
  pointAnnounce = false;
  matchOver = false;


  userInteracted = false;

  // bring pong back
  canvas.style.display = 'block';
  canvas.style.opacity = '1';
  canvas.style.pointerEvents = 'none';

  // show scoreboard again
  setScoreboardVisible(true);

  // restart game fresh
  initPongGame();

  // keep button visible on home
  if (backToPongBtn) backToPongBtn.classList.add('hidden');
}

function showBackButton(v) {
  if (!backToPongBtn) return;
  if (v) backToPongBtn.classList.remove('hidden');
  else backToPongBtn.classList.add('hidden');
}

function transitionScreens() {
  systemOnline.style.opacity = '0';
  systemOnline.style.transition = 'opacity 3s ease-in';
  setTimeout(() => {
    systemOnline.style.display = 'none';
    newScreen.classList.add('active');
    const cp = document.querySelector('.control-panel');
    if (cp) cp.classList.add('visible');
  }, 3000);
}
setTimeout(transitionScreens, 1000);

function activateTransitionFlicker(callback) {
  flickerContainer.classList.add('flicker');
  flickerContainer.addEventListener('animationend', function handler() {
    flickerContainer.removeEventListener('animationend', handler);
    hideAllInfoSets();
    flickerContainer.classList.remove('flicker');
    if (callback) callback();
    isTransitioning = false;
  });
}

function activateRandomFlicker() {
  flickerContainer.classList.add('random-flicker');
  setTimeout(() => {
    flickerContainer.classList.remove('random-flicker');
  }, 500);
}

function randomFlicker() {
  if (Math.random() < 0.01) activateRandomFlicker();
}
setInterval(randomFlicker, 3000);

function writeStringToElement(element, text, callback) {
  if (currentTypingElement && currentTypingElement.element === element) {
    clearInterval(currentTypingElement.interval);
  } else if (currentTypingElement) {
    clearInterval(currentTypingElement.interval);
    currentTypingElement = null;
  }

  const charArray = text.split('');
  let i = 0;

  element.textContent = '';
  const cursor = document.createElement('span');
  cursor.classList.add('cursor');
  cursor.textContent = ' ';
  element.appendChild(cursor);

  const timer = setInterval(() => {
    if (i < charArray.length) {
      element.textContent = element.textContent.slice(0, -1) + charArray[i];
      element.appendChild(cursor);
      i++;
    } else {
      clearInterval(timer);
      element.textContent = text;
      cursor.remove();
      currentTypingElement = null;
      if (callback) callback();
    }
  }, 50);

  currentTypingElement = { element, interval: timer };
}

function showInformation() {
  setAsciiVisible(true);
  infoSetInformation.style.display = 'flex';
  writeStringToElement(nameContent, 'Alex | rocket_point', () => {
    writeStringToElement(birthdayContent, 'October 27th, 2003 | 22 & Male', () => {
      writeStringToElement(likesContent, 'Rockets, Typing, Gaming, Daves', () => {
        writeStringToElement(dislikesContent, 'Assholes, Bolt tearing up my lego box, college (help)', () => {
          startAlerts();
        });
      });
    });
  });
}

function showAvailability() {
  setAsciiVisible(true);
  infoSetAvailability.style.display = 'flex';
  writeStringToElement(
    favoritePeopleContent,
    'Luci, Lumi, Emmi, ; If I talk to you a lot, you are included',
    () => {
      writeStringToElement(
        notFreeContent,
        '6 PM - 12 AM on Weekdays | 10 AM - 3 AM on Weekends\n; Favorite people can text any time!',
        () => startAlerts()
      );
    }
  );
}

function showMisc() {
  if (!infoSetMisc) return;
  setAsciiVisible(true);
  infoSetMisc.style.display = 'flex';
  writeStringToElement(
    funFactsContent,
    'I have died a couple of times and nearly a lot of other times, plus I have a sick setup.',
    () => {
      writeStringToElement(
        inspiredContent,
        'Inspired by cold war era tech and me wanting to make myself a bio. I also got inspired to make this by Sophie :)',
        () => {
          writeStringToElement(suggestionsContent, 'Text me about anything I might have missed :)', () => {
            startAlerts();
          });
        }
      );
    }
  );
}

function setScoreboardVisible(v) {
  if (!pongScoreboard) return;
  pongScoreboard.style.opacity = v ? '1' : '0';
  pongScoreboard.style.visibility = v ? 'visible' : 'hidden';
  pongScoreboard.style.pointerEvents = 'none';
  pongScoreboard.style.position = 'absolute';
  pongScoreboard.style.top = '20px';
  pongScoreboard.style.left = '50%';
  pongScoreboard.style.transform = 'translateX(-50%)';
  pongScoreboard.style.zIndex = '120';
}

buttons.forEach((button) => {
  button.addEventListener('click', (event) => {
    if (isTransitioning) return;
    isTransitioning = true;

    userInteracted = true;
    stopPongWithFade();
    showBackButton(true);
    setScoreboardVisible(false);

    const buttonText = event.target.textContent.trim();
    if (buttonText === 'Information') activateTransitionFlicker(showInformation);
    else if (buttonText === 'Availability') activateTransitionFlicker(showAvailability);
    else if (buttonText === 'Misc.') activateTransitionFlicker(showMisc);
  });
});

const alertMessages = [
  "Nuclear tensions rising as Russian stockpile surpasses estimates",
  "Reports of nuclear missile movements spotted over the Arctic Circle",
  "Soviet submarines detected near the Eastern Seaboard",
  "Diplomatic talks failing; intelligence suggests hidden warheads in Europe",
  "NATO on high alert: Unconfirmed reports of missile test launches",
  "Spy planes reveal increased activity at classified facilities"
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let shuffledMessages = shuffleArray([...alertMessages]);
let currentAlertIndex = 0;
let alertInterval = null;

function showRandomAlert() {
  const alertContainer = document.querySelector('.alert-container');
  if (!alertContainer) return;
  if (alertContainer.children.length > 0) return;

  if (currentAlertIndex >= shuffledMessages.length) {
    shuffledMessages = shuffleArray([...alertMessages]);
    currentAlertIndex = 0;
  }

  const msg = shuffledMessages[currentAlertIndex++];
  const alertBox = document.createElement('div');
  alertBox.className = 'alert-box';
  alertBox.textContent = msg;

  alertContainer.appendChild(alertBox);

  setTimeout(() => {
    alertBox.classList.add('alert-fade-out');
    setTimeout(() => {
      if (alertBox.parentNode === alertContainer) alertContainer.removeChild(alertBox);
    }, 1000);
  }, 4000);
}

function startAlerts() {
  if (!alertInterval) alertInterval = setInterval(showRandomAlert, 5000);
}

const canvas = document.querySelector('.pong-canvas');
const ctx = canvas.getContext('2d');

let pongAnimationId = null;

let ball, leftPaddle, rightPaddle;
let forcedLose = false;
let forcedLoseTimeout = null;
let loseStartTime = null;

let scoreLeft = 0;
let scoreRight = 0;

let lastFrameTime = performance.now();

const WIN_SCORE = 7;
let matchOver = false;
let matchOverUntil = 0;
let matchWinnerText = '';

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function getCanvasCSSSize() {
  const r = canvas.getBoundingClientRect();
  return { w: r.width, h: r.height };
}

function resizeCanvasToCSS() {
  const r = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(r.width * dpr);
  canvas.height = Math.floor(r.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function predictYAtX(targetX) {
  const { h } = getCanvasCSSSize();
  if (!ball || Math.abs(ball.vx) < 0.0001) return ball ? ball.y : h / 2;

  let t = (targetX - ball.x) / ball.vx;
  if (t < 0) t = 0;

  const top = ball.radius;
  const bottom = h - ball.radius;
  const span = bottom - top;

  let y = ball.y + ball.vy * t;
  if (span <= 0) return clamp(y, top, bottom);

  let m = (y - top) % (2 * span);
  if (m < 0) m += 2 * span;
  if (m > span) m = 2 * span - m;

  return top + m;
}

function updateScoreboardText() {
  if (!pongScoreboard) return;
  pongScoreboard.textContent = `LEFT ${scoreLeft} : ${scoreRight} RIGHT`;
}

function initPongGame() {
  if (userInteracted) return;

  canvas.style.display = 'block';
  canvas.style.opacity = '1';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';

  const contentContainer = document.querySelector('.content-container');
  if (contentContainer) {
    contentContainer.style.position = 'relative';
    contentContainer.style.zIndex = '5';
  }

  const cp = document.querySelector('.control-panel');
  if (cp) cp.style.zIndex = '100';

  resizeCanvasToCSS();

  const { w, h } = getCanvasCSSSize();

  scoreLeft = 0;
  scoreRight = 0;
  matchOver = false;
  matchWinnerText = '';
  setScoreboardVisible(true);
  updateScoreboardText();

  leftPaddle = {
    x: 20,
    y: 100 + Math.random() * 100,
    w: 10,
    h: 80,
    vy: rand(-0.6, 0.6),
    phase: rand(0, Math.PI * 2),
    targetY: h / 2,
    bias: rand(-6, 6),
    nextRetargetAt: 0
  };

  rightPaddle = {
    x: w - 20 - 10,
    y: 100 + Math.random() * 100,
    w: 10,
    h: 80,
    vy: rand(-0.6, 0.6),
    phase: rand(0, Math.PI * 2),
    targetY: h / 2,
    bias: rand(-6, 6),
    nextRetargetAt: 0
  };

  serveBall(Math.random() < 0.5 ? 1 : -1);

  forcedLose = false;
  loseStartTime = null;

  const forcedLoseTime = (Math.random() * 10 + 10) * 1000;
  forcedLoseTimeout = setTimeout(() => {
    if (!matchOver && !userInteracted) {
      forcedLose = true;
      loseStartTime = performance.now();
    }
  }, forcedLoseTime);

  lastFrameTime = performance.now();
  pongAnimationId = requestAnimationFrame(loop);
}

function serveBall(dir) {
  const { w, h } = getCanvasCSSSize();

  const baseSpeed = rand(3.6, 4.4);
  const angle = rand(-0.32, 0.32);

  ball = {
    x: w / 2,
    y: h / 2,
    vx: Math.cos(angle) * baseSpeed * dir,
    vy: Math.sin(angle) * baseSpeed,
    radius: 5,
    speed: baseSpeed,
    maxSpeed: 6.3
  };
}

function endMatch(winner) {
  matchOver = true;
  matchWinnerText = winner === 'left' ? 'Left side wins' : 'Right side wins';
  matchOverUntil = performance.now() + 2200;
  clearTimeout(forcedLoseTimeout);
}

function announcePoint(side) {
  pointAnnounce = true;
  pointAnnounceText = side === 'left' ? 'Left side scores' : 'Right side scores';
  pointAnnounceUntil = performance.now() + 900; // how long it stays on screen (ms)
}

function resetMatch() {
  scoreLeft = 0;
  scoreRight = 0;
  updateScoreboardText();

  matchOver = false;
  matchWinnerText = '';

  const { h } = getCanvasCSSSize();
  leftPaddle.targetY = h / 2 - leftPaddle.h / 2;
  rightPaddle.targetY = h / 2 - rightPaddle.h / 2;

  leftPaddle.vy = rand(-0.4, 0.4);
  rightPaddle.vy = rand(-0.4, 0.4);

  serveBall(Math.random() < 0.5 ? 1 : -1);

  forcedLose = false;
  loseStartTime = null;

  const forcedLoseTime = (Math.random() * 10 + 10) * 1000;
  forcedLoseTimeout = setTimeout(() => {
    if (!matchOver && !userInteracted) {
      forcedLose = true;
      loseStartTime = performance.now();
    }
  }, forcedLoseTime);
}

function retargetPaddle(p, isLeft, now) {
  const { h } = getCanvasCSSSize();

  const ballComing = isLeft ? ball.vx < 0 : ball.vx > 0;

  let aimError = ballComing ? 10 : 16;
  let idleAmp = 22;
  let idleFreq = 1.05;

  if (forcedLose && loseStartTime) {
    const elapsed = (performance.now() - loseStartTime) / 1000;
    const degrade = clamp(elapsed / 5, 0, 1);
    aimError += degrade * 26;
    idleAmp += degrade * 14;
  }

  const drift = rand(-1.2, 1.2);
  p.bias = clamp(p.bias * 0.92 + drift, -aimError, aimError);

  let desired;

  if (ballComing) {
    const targetX = isLeft ? (p.x + p.w) : p.x;
    const predicted = predictYAtX(targetX);
    desired = predicted - p.h / 2 + p.bias;
  } else {
    const center = h / 2 - p.h / 2;
    const bob = Math.sin((now / 1000) * idleFreq + p.phase) * idleAmp;
    desired = center + bob + p.bias * 0.5;
  }

  p.targetY = clamp(desired, 0, h - p.h);

  const base = ballComing ? 70 : 120;
  const jitter = ballComing ? 60 : 110;
  p.nextRetargetAt = now + base + Math.random() * jitter;
}

function moveOnePaddle(p, isLeft, dt, now) {
  const { h } = getCanvasCSSSize();

  if (now >= p.nextRetargetAt) retargetPaddle(p, isLeft, now);

  const ballComing = isLeft ? ball.vx < 0 : ball.vx > 0;

  let maxSpeed = ballComing ? 10.5 : 7.0;
  let accel = ballComing ? 1.9 : 1.4;
  let damping = ballComing ? 0.90 : 0.86;

  if (forcedLose && loseStartTime) {
    const elapsed = (performance.now() - loseStartTime) / 1000;
    const degrade = clamp(elapsed / 5, 0, 1);
    maxSpeed -= degrade * 5.3;
    accel -= degrade * 0.9;
  }

  const diff = p.targetY - p.y;
  const desiredVy = clamp(diff * 0.28, -maxSpeed, maxSpeed);

  const blend = clamp(accel * 0.22, 0.10, 0.35);
  p.vy = p.vy + (desiredVy - p.vy) * blend * dt;

  p.vy *= damping;
  p.y += p.vy * dt;

  p.y = clamp(p.y, 0, h - p.h);
}

function movePaddles(dt, now) {
  moveOnePaddle(leftPaddle, true, dt, now);
  moveOnePaddle(rightPaddle, false, dt, now);
}

function paddleBounce(paddle) {
  const { h } = getCanvasCSSSize();

  const hitPos = (ball.y - (paddle.y + paddle.h / 2)) / (paddle.h / 2);
  const clampedHit = clamp(hitPos, -1, 1);

  const maxBounce = 0.90;
  const bounceAngle = clampedHit * maxBounce + rand(-0.05, 0.05);

  ball.speed = clamp(ball.speed + 0.14, 3.1, ball.maxSpeed);

  const dir = paddle === leftPaddle ? 1 : -1;
  ball.vx = Math.cos(bounceAngle) * ball.speed * dir;
  ball.vy = Math.sin(bounceAngle) * ball.speed;

  ball.vy += rand(-0.10, 0.10);
  ball.y = clamp(ball.y, ball.radius, h - ball.radius);
}

function updateBall(dt) {
  const { w, h } = getCanvasCSSSize();

  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= h) {
    ball.vy = -ball.vy;
    ball.y = clamp(ball.y, ball.radius, h - ball.radius);
  }

  if (
    ball.vx < 0 &&
    ball.x - ball.radius <= leftPaddle.x + leftPaddle.w &&
    ball.y >= leftPaddle.y &&
    ball.y <= leftPaddle.y + leftPaddle.h
  ) {
    ball.x = leftPaddle.x + leftPaddle.w + ball.radius;
    paddleBounce(leftPaddle);
  }

  if (
    ball.vx > 0 &&
    ball.x + ball.radius >= rightPaddle.x &&
    ball.y >= rightPaddle.y &&
    ball.y <= rightPaddle.y + rightPaddle.h
  ) {
    ball.x = rightPaddle.x - ball.radius;
    paddleBounce(rightPaddle);
  }

  if (ball.x + ball.radius < 0) {
    scoreRight++;
    updateScoreboardText();
    announcePoint('right');

    if (scoreRight >= WIN_SCORE) endMatch('right');
    else serveBall(1);
  } else if (ball.x - ball.radius > w) {
    scoreLeft++;
    updateScoreboardText();
    announcePoint('left');

    if (scoreLeft >= WIN_SCORE) endMatch('left');
    else serveBall(-1);
  }
}

function draw() {
  const { w, h } = getCanvasCSSSize();

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.w, leftPaddle.h);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.w, rightPaddle.h);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.03)";
  for (let i = 0; i < h; i += 2) ctx.fillRect(0, i, w, 1);

  // Point announcement (only when match is not over)
  if (pointAnnounce && !matchOver) {
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#ffffff";
    ctx.font = "22px Courier New";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(pointAnnounceText, w / 2, h / 2);
  }

  // Win announcement overrides everything
  if (matchOver) {
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#ffffff";
    ctx.font = "22px Courier New";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(matchWinnerText, w / 2, h / 2);
  }
}

function loop(now) {
  if (userInteracted) return;

  const dtMs = now - lastFrameTime;
  lastFrameTime = now;

  const dt = clamp(dtMs / 16.6667, 0.9, 1.1);

  if (pointAnnounce && now >= pointAnnounceUntil) {
    pointAnnounce = false;
  }

  if (!matchOver) {
    movePaddles(dt, now);
    updateBall(dt);
  } else if (now >= matchOverUntil) {
    resetMatch();
  }

  draw();
  pongAnimationId = requestAnimationFrame(loop);
}

function stopPongWithFade() {
  userInteracted = true;

  if (pongAnimationId) {
    cancelAnimationFrame(pongAnimationId);
    pongAnimationId = null;
  }

  clearTimeout(forcedLoseTimeout);

  canvas.style.transition = 'opacity 0.5s ease';
  canvas.style.opacity = '0';
  setTimeout(() => {
    canvas.style.display = 'none';
  }, 500);
}

window.addEventListener('resize', () => {
  if (!canvas || canvas.style.display === 'none' || userInteracted) return;
  resizeCanvasToCSS();
});

(function applyAsciiSlant() {
  const blocks = document.querySelectorAll("pre.ascii-art[data-slant]");
  blocks.forEach((pre) => {
    const slant = Math.max(0, parseInt(pre.dataset.slant || "0", 10));
    if (!slant) return;

    const raw = pre.textContent.replace(/\t/g, "  ");
    const lines = raw.split("\n");

    const slanted = lines.map((line, i) => {
      if (line.trim().length === 0) return line;
      return " ".repeat(i * slant) + line;
    });

    pre.textContent = slanted.join("\n");
  });
})();

function setDate() {
  const dateDisplay = document.querySelector('.date-display');
  if (!dateDisplay) return;

  const today = new Date();
  const options = { month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  dateDisplay.textContent = `${formattedDate}, 1962`;
}
setDate();

if (backToPongBtn) {
  backToPongBtn.addEventListener('click', () => {
    showBackButton(false);
    showHomePong();
  });
}

if (backToPongBtn) {
  console.log('Back button found!');
  backToPongBtn.addEventListener('click', (e) => {
    console.log('Back button clicked!');
    e.stopPropagation();  // Prevent event bubbling
    showBackButton(false);
    showHomePong();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  hideAllInfoSets();
  setAsciiVisible(false);
  setScoreboardVisible(true);
  showBackButton(false);
});

initPongGame();







