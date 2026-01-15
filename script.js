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

const infoSets = document.querySelectorAll('.info-set');

let userInteracted = false;
let isTransitioning = false;
let currentTypingElement = null;

function hideAllInfoSets() {
    infoSets.forEach(set => {
        set.style.display = 'none';
    });

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

function transitionScreens() {
    systemOnline.style.opacity = '0';
    systemOnline.style.transition = 'opacity 3s ease-in';
    setTimeout(() => {
        systemOnline.style.display = 'none';
        newScreen.classList.add('active');
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
    if (Math.random() < 0.01) {
        activateRandomFlicker();
    }
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
    infoSetAvailability.style.display = 'flex';
    writeStringToElement(favoritePeopleContent, 'Luci, Lumi, Emmi, ; If I talk to you a lot, you are included', () => {
        writeStringToElement(notFreeContent, '6 PM - 12 AM on Weekdays | 10 AM - 3 AM on Weekends\n; Favorite people can text any time!', () => {
            startAlerts();
        });
    });
}

function showMisc() {
    if (infoSetMisc) {
        infoSetMisc.style.display = 'flex';
        writeStringToElement(funFactsContent, 'I have died a couple of times and nearly a lot of other times, plus I have a sick setup.', () => {
            writeStringToElement(inspiredContent, 'Inspired by cold war era tech and me wanting to make myself a bio. I also got inspired to make this by Sophie :)', () => {
                writeStringToElement(suggestionsContent, 'Text me about anything I might have missed :)', () => {
                    startAlerts();
                });
            });
        });
    }
}

buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
        if (isTransitioning) return;
        isTransitioning = true;

        userInteracted = true;
        stopPongWithFade();

        const buttonText = event.target.textContent.trim();

        if (buttonText === 'Information') {
            activateTransitionFlicker(showInformation);
        } else if (buttonText === 'Availability') {
            activateTransitionFlicker(showAvailability);
        } else if (buttonText === 'Misc.') {
            activateTransitionFlicker(showMisc);
        }
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

    const randomMsg = shuffledMessages[currentAlertIndex];
    currentAlertIndex++;

    const alertBox = document.createElement('div');
    alertBox.className = 'alert-box';
    alertBox.textContent = randomMsg;

    alertContainer.appendChild(alertBox);

    setTimeout(() => {
        alertBox.classList.add('alert-fade-out');
        setTimeout(() => {
            if (alertBox.parentNode === alertContainer) {
                alertContainer.removeChild(alertBox);
            }
        }, 1000);
    }, 4000);
}

function startAlerts() {
    if (!alertInterval) {
        alertInterval = setInterval(showRandomAlert, 5000);
    }
}

const canvas = document.querySelector('.pong-canvas');
const ctx = canvas.getContext('2d');

let gameOver = false;
let pongAnimationId = null;
let ball, leftPaddle, rightPaddle;
let forcedLose = false;
let forcedLoseTimeout = null;
let loseStartTime = null;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function resizeCanvasToCSS() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener('resize', () => {
  if (!canvas || canvas.style.display === 'none') return;
  resizeCanvasToCSS();
});

function initPongGame() {
  if (userInteracted) return;

  canvas.style.display = 'block';
  canvas.style.opacity = '1';

  resizeCanvasToCSS();

  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;

  const initialSpeed = rand(3.5, 5.0);
  const angle = rand(-0.6, 0.6);
  const dir = Math.random() < 0.5 ? -1 : 1;

  ball = {
    x: w / 2,
    y: rand(h * 0.3, h * 0.7),
    vx: Math.cos(angle) * initialSpeed * dir,
    vy: Math.sin(angle) * initialSpeed,
    radius: 6,
    speed: initialSpeed,
    maxSpeed: 9.5
  };

  // Randomized paddle properties for variety each game
  leftPaddle = {
    x: 24,
    y: rand(h * 0.1, h * 0.7),
    w: 12,
    h: 90,
    speed: rand(3.2, 4.2),           // Constant speed, randomized per game
    direction: 0,                     // -1 up, 0 idle, 1 down
    reactionOffset: rand(-15, 15),    // Where it "aims" relative to ball
    deadzone: rand(5, 20)             // How close before it stops
  };

  rightPaddle = {
    x: w - 24 - 12,
    y: rand(h * 0.1, h * 0.7),
    w: 12,
    h: 90,
    speed: rand(3.2, 4.2),
    direction: 0,
    reactionOffset: rand(-15, 15),
    deadzone: rand(5, 20)
  };

  gameOver = false;
  forcedLose = false;
  loseStartTime = null;

  const forcedLoseTime = rand(10, 20) * 1000;
  forcedLoseTimeout = setTimeout(() => {
    if (!gameOver && !userInteracted) {
      forcedLose = true;
      loseStartTime = performance.now();
    }
  }, forcedLoseTime);

  loop();
}

function movePaddles() {
  const h = canvas.getBoundingClientRect().height;

  // Degrade one paddle's ability over time to force a loss
  let leftSpeedMod = 1;
  let rightSpeedMod = 1;
  let leftDeadzoneMod = 0;
  let rightDeadzoneMod = 0;

  if (forcedLose && loseStartTime) {
    const elapsed = (performance.now() - loseStartTime) / 1000;
    const degrade = clamp(elapsed / 4, 0, 1);
    
    // Pick which paddle to handicap based on ball direction
    if (ball.vx < 0) {
      leftSpeedMod = 1 - degrade * 0.5;
      leftDeadzoneMod = degrade * 40;
    } else {
      rightSpeedMod = 1 - degrade * 0.5;
      rightDeadzoneMod = degrade * 40;
    }
  }

  // Move left paddle - classic Pong constant speed movement
  const leftTarget = ball.y + leftPaddle.reactionOffset;
  const leftCenter = leftPaddle.y + leftPaddle.h / 2;
  const leftDiff = leftTarget - leftCenter;
  const leftDeadzone = leftPaddle.deadzone + leftDeadzoneMod;

  if (leftDiff > leftDeadzone) {
    leftPaddle.direction = 1;
  } else if (leftDiff < -leftDeadzone) {
    leftPaddle.direction = -1;
  } else {
    leftPaddle.direction = 0;
  }

  leftPaddle.y += leftPaddle.direction * leftPaddle.speed * leftSpeedMod;
  leftPaddle.y = clamp(leftPaddle.y, 0, h - leftPaddle.h);

  // Move right paddle - same logic
  const rightTarget = ball.y + rightPaddle.reactionOffset;
  const rightCenter = rightPaddle.y + rightPaddle.h / 2;
  const rightDiff = rightTarget - rightCenter;
  const rightDeadzone = rightPaddle.deadzone + rightDeadzoneMod;

  if (rightDiff > rightDeadzone) {
    rightPaddle.direction = 1;
  } else if (rightDiff < -rightDeadzone) {
    rightPaddle.direction = -1;
  } else {
    rightPaddle.direction = 0;
  }

  rightPaddle.y += rightPaddle.direction * rightPaddle.speed * rightSpeedMod;
  rightPaddle.y = clamp(rightPaddle.y, 0, h - rightPaddle.h);
}

function paddleBounce(paddle) {
  const h = canvas.getBoundingClientRect().height;

  const hitPos = (ball.y - (paddle.y + paddle.h / 2)) / (paddle.h / 2);
  const clampedHit = clamp(hitPos, -1, 1);

  const maxBounce = 0.9;
  const bounceAngle = clampedHit * maxBounce + rand(-0.08, 0.08);

  ball.speed = clamp(ball.speed + 0.25, 3, ball.maxSpeed);

  const dir = paddle === leftPaddle ? 1 : -1;
  ball.vx = Math.cos(bounceAngle) * ball.speed * dir;
  ball.vy = Math.sin(bounceAngle) * ball.speed;

  ball.vy += rand(-0.25, 0.25);

  ball.y = clamp(ball.y, ball.radius, h - ball.radius);
}

function updateBall() {
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;

  ball.x += ball.vx;
  ball.y += ball.vy;

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

  if (ball.x + ball.radius < 0 || ball.x - ball.radius > w) endGame();
}

function endGame() {
  gameOver = true;
  clearTimeout(forcedLoseTimeout);
  setTimeout(drawEndScreen, 350);
}

function drawEndScreen() {
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#fff";
  ctx.font = "20px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const winnerText = (ball.x < w / 2) ? "RIGHT PLAYER WINS" : "LEFT PLAYER WINS";
  ctx.fillText(winnerText, w / 2, h / 2);

  if (!userInteracted) {
    setTimeout(() => {
      if (!userInteracted) resetGame();
    }, 2200);
  }
}

function resetGame() {
  if (userInteracted) return;
  initPongGame();
}

function draw() {
  const w = canvas.getBoundingClientRect().width;
  const h = canvas.getBoundingClientRect().height;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#fff";
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.w, leftPaddle.h);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.w, rightPaddle.h);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.03)";
  for (let i = 0; i < h; i += 2) ctx.fillRect(0, i, w, 1);
}

function loop() {
  if (!gameOver) {
    movePaddles();
    updateBall();
    draw();
    pongAnimationId = requestAnimationFrame(loop);
  }
}

function stopPongWithFade() {
  userInteracted = true;
  if (pongAnimationId) {
    cancelAnimationFrame(pongAnimationId);
    pongAnimationId = null;
  }
  canvas.style.transition = 'opacity 0.5s ease';
  canvas.style.opacity = '0';
  setTimeout(() => {
    canvas.style.display = 'none';
  }, 500);
}


function transitionScreens() {
    systemOnline.style.opacity = '0';
    systemOnline.style.transition = 'opacity 3s ease-in';
    setTimeout(() => {
        systemOnline.style.display = 'none';
        newScreen.classList.add('active');
        document.querySelector('.control-panel').classList.add('visible');
    }, 3000);
}

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

document.addEventListener('DOMContentLoaded', () => {
    hideAllInfoSets();
});

initPongGame();


