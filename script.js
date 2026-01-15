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
        document.querySelector('.control-panel')?.classList.add('visible');
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
        if (pongScoreboard) pongScoreboard.classList.add('hidden-ui');

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

// Pong screensaver + scoreboard
const canvas = document.querySelector('.pong-canvas');
const ctx = canvas.getContext('2d');

const UI_BOTTOM_GUARD = 120;

let gameOver = false;
let pongAnimationId = null;

let ball, leftPaddle, rightPaddle;
let forcedLose = false;
let forcedLoseTimeout = null;
let loseStartTime = null;

let scoreLeft = 0;
let scoreRight = 0;

let lastFrameTime = performance.now();

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

function getCanvasCSSSize() {
    const r = canvas.getBoundingClientRect();
    return { w: r.width, h: Math.max(0, r.height - UI_BOTTOM_GUARD) };
}

function resizeCanvasToCSS() {
    const r = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(r.width * dpr);
    canvas.height = Math.floor(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function initPongGame() {
    if (userInteracted) return;

    canvas.style.display = 'block';
    canvas.style.opacity = '1';

    resizeCanvasToCSS();

    if (pongScoreboard) pongScoreboard.classList.remove('hidden-ui');

    const { w } = getCanvasCSSSize();

    scoreLeft = 0;
    scoreRight = 0;

    leftPaddle = { x: 20, y: 100 + Math.random() * 100, w: 10, h: 80 };
    rightPaddle = { x: w - 20 - 10, y: 100 + Math.random() * 100, w: 10, h: 80 };

    serveBall(Math.random() < 0.5 ? 1 : -1);

    gameOver = false;
    forcedLose = false;
    loseStartTime = null;

    const forcedLoseTime = (Math.random() * 10 + 10) * 1000;
    forcedLoseTimeout = setTimeout(() => {
        if (!gameOver && !userInteracted) {
            forcedLose = true;
            loseStartTime = performance.now();
        }
    }, forcedLoseTime);

    lastFrameTime = performance.now();
    loop(lastFrameTime);
}

function serveBall(dir) {
    const { w, h } = getCanvasCSSSize();

    const baseSpeed = rand(1.4, 2.1);
    const angle = rand(-0.35, 0.35);

    ball = {
        x: w / 2,
        y: h / 2,
        vx: Math.cos(angle) * baseSpeed * dir,
        vy: Math.sin(angle) * baseSpeed,
        radius: 5,
        speed: baseSpeed,
        maxSpeed: 3.4
    };
}

function movePaddles(dt) {
    const { h } = getCanvasCSSSize();

    let paddleSpeed = 0.95;
    let jitter = 7.5;
    let reaction = 0.095;

    if (forcedLose && loseStartTime) {
        const elapsed = (performance.now() - loseStartTime) / 1000;
        const degrade = clamp(elapsed / 5, 0, 1);
        paddleSpeed = paddleSpeed - degrade * 0.5;
        jitter = jitter + degrade * 12;
        reaction = reaction - degrade * 0.04;
    }

    const leftAim = ball.y - leftPaddle.h / 2 + rand(-jitter, jitter);
    const rightAim = ball.y - rightPaddle.h / 2 + rand(-jitter, jitter);

    const leftDelta = (leftAim - leftPaddle.y) * reaction;
    const rightDelta = (rightAim - rightPaddle.y) * reaction;

    const maxStep = paddleSpeed * dt;
    leftPaddle.y += clamp(leftDelta, -maxStep, maxStep);
    rightPaddle.y += clamp(rightDelta, -maxStep, maxStep);

    leftPaddle.y = clamp(leftPaddle.y, 0, h - leftPaddle.h);
    rightPaddle.y = clamp(rightPaddle.y, 0, h - rightPaddle.h);
}

function paddleBounce(paddle) {
    const { h } = getCanvasCSSSize();

    const hitPos = (ball.y - (paddle.y + paddle.h / 2)) / (paddle.h / 2);
    const clampedHit = clamp(hitPos, -1, 1);

    const maxBounce = 0.85;
    const bounceAngle = clampedHit * maxBounce + rand(-0.06, 0.06);

    ball.speed = clamp(ball.speed + 0.10, 1.2, ball.maxSpeed);

    const dir = paddle === leftPaddle ? 1 : -1;
    ball.vx = Math.cos(bounceAngle) * ball.speed * dir;
    ball.vy = Math.sin(bounceAngle) * ball.speed;

    ball.vy += rand(-0.07, 0.07);

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
        serveBall(1);
    } else if (ball.x - ball.radius > w) {
        scoreLeft++;
        serveBall(-1);
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

    if (pongScoreboard) {
        pongScoreboard.textContent = `LEFT ${scoreLeft} : ${scoreRight} RIGHT`;
    }
}

function loop(now) {
    if (userInteracted || gameOver) return;

    const dtMs = now - lastFrameTime;
    lastFrameTime = now;

    const dt = clamp(dtMs / 16.6667, 0.5, 1.5);

    movePaddles(dt);
    updateBall(dt);
    draw();

    pongAnimationId = requestAnimationFrame(loop);
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

window.addEventListener('resize', () => {
    if (!canvas || canvas.style.display === 'none' || userInteracted) return;
    resizeCanvasToCSS();
});

// ASCII slant
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

// Date
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
