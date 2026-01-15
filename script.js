// Selectors and Variables
const systemOnline = document.querySelector('.crt-screen');
const flickerContainer = document.querySelector('.flicker-container');
const newScreen = document.querySelector('.new-screen');
const buttons = document.querySelectorAll('.menu-item');

// Information set elements
const nameContent = document.querySelector('.name-content');
const birthdayContent = document.querySelector('.birthday-content');
const likesContent = document.querySelector('.likes-content');
const dislikesContent = document.querySelector('.dislikes-content');

// Availability set elements
const favoritePeopleContent = document.querySelector('.favorite-people-content');
const notFreeContent = document.querySelector('.notfree-content');

// Misc set elements
const funFactsContent = document.querySelector('.fun-facts-content');
const inspiredContent = document.querySelector('.inspired-content');
const suggestionsContent = document.querySelector('.suggestions-content');

// Containers for each set
const infoSetInformation = document.querySelector('.info-set-information');
const infoSetAvailability = document.querySelector('.info-set-availability');
const infoSetMisc = document.querySelector('.info-set-misc');

// Select all info-set elements, including the new Misc. set
const infoSets = document.querySelectorAll('.info-set');

// State Flags
let userInteracted = false;
let isTransitioning = false; // Prevents overlapping transitions
let currentTypingElement = null; // Tracks the element currently being typed

// Function to hide all info sets and clear their content
function hideAllInfoSets() {
    infoSets.forEach(set => {
        set.style.display = 'none';
    });

    // Clear all typed contents and remove cursors
    const typedContents = document.querySelectorAll('.typed-content');
    typedContents.forEach(element => {
        element.textContent = '';
        const cursor = element.querySelector('.cursor');
        if (cursor) cursor.remove();
    });

    // Clear any ongoing typing intervals
    if (currentTypingElement) {
        clearInterval(currentTypingElement.interval);
        currentTypingElement = null;
    }
}

// Initial Transition: Fade out "SYSTEM ONLINE" and show new screen
function transitionScreens() {
    systemOnline.style.opacity = '0';
    systemOnline.style.transition = 'opacity 3s ease-in';
    setTimeout(() => {
        systemOnline.style.display = 'none';
        newScreen.classList.add('active');
    }, 3000);
}
setTimeout(transitionScreens, 1000);

// Activate flicker for transitions (Single Flicker)
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

// Activate random flicker (Subtler Flicker)
function activateRandomFlicker() {
    flickerContainer.classList.add('random-flicker');
    setTimeout(() => {
        flickerContainer.classList.remove('random-flicker');
    }, 500);
}

// Random flicker function
function randomFlicker() {
    if (Math.random() < 0.01) {
        activateRandomFlicker();
    }
}
setInterval(randomFlicker, 3000);

// Write string to element with proper clearing
function writeStringToElement(element, text, callback) {
    if (currentTypingElement && currentTypingElement.element === element) {
        clearInterval(currentTypingElement.interval);
    } else if (currentTypingElement) {
        clearInterval(currentTypingElement.interval);
        currentTypingElement = null;
    }

    const charArray = text.split('');
    let i = 0;

    // Clear existing content and add cursor
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

// Show Information set
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

// Show Availability set
function showAvailability() {
    infoSetAvailability.style.display = 'flex';
    writeStringToElement(favoritePeopleContent, 'Luci, Lumi, Emmi, ; If I talk to you a lot, you are included', () => {
        writeStringToElement(notFreeContent, '6 PM - 12 AM on Weekdays | 10 AM - 3 AM on Weekends\n; Favorite people can text any time!', () => {
            startAlerts();
        });
    });
}

// Show Misc. content
function showMisc() {
    if (infoSetMisc) {
        infoSetMisc.style.display = 'flex';

        // Animate typing for each box sequentially
        writeStringToElement(funFactsContent, 'I have died a couple of times and nearly a lot of other times, plus I have a sick setup.', () => {
            writeStringToElement(inspiredContent, 'Inspired by cold war era tech and me wanting to make myself a bio. I also got inspired to make this by Sophie :)', () => {
                writeStringToElement(suggestionsContent, 'Text me about anything I might have missed :)', () => {
                    startAlerts();
                });
            });
        });
    }
}

// Update the event listener for menu buttons
buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
        if (isTransitioning) return;
        isTransitioning = true;

        userInteracted = true;
        stopPongWithFade();

        const buttonText = event.target.textContent.trim();

        // Show the selected info set with a flicker effect
        if (buttonText === 'Information') {
            activateTransitionFlicker(showInformation);
        } else if (buttonText === 'Availability') {
            activateTransitionFlicker(showAvailability);
        } else if (buttonText === 'Misc.') {
            activateTransitionFlicker(showMisc);
        }
    });
});

// Alerts
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
    alertBox.classList.add('alert-fade-out'); // Add fade class
    setTimeout(() => {
        if (alertBox.parentNode === alertContainer) {
            alertContainer.removeChild(alertBox);
        }
    }, 1000); // Wait for fade animation to finish
}, 6000);
}

function startAlerts() {
    if (!alertInterval) {
        alertInterval = setInterval(showRandomAlert, 10000);
    }
}

// Pong screensaver
const canvas = document.querySelector('.pong-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

let gameOver = false;
let pongAnimationId = null;
let ball, leftPaddle, rightPaddle;
let forcedLose = false; 
let forcedLoseTimeout = null;
let loseStartTime = null;

// Initialize Pong Game
function initPongGame() {
    if (userInteracted) return;

    // Initialize ball with random velocity
    const vx = (Math.random() * 0.8 + 0.7) * (Math.random() < 0.5 ? 1 : -1); // 0.7 to 1.5 speed, random direction
    const vy = (Math.random() * 0.7 + 0.5) * (Math.random() < 0.5 ? 1 : -1); // 0.5 to 1.2 speed, random direction

    ball = { x: 300, y: 200, vx, vy, radius: 5 };

    // Random initial paddle positions within a range
    leftPaddle = { x: 20, y: 100 + Math.random() * 100, w: 10, h: 80 };
    rightPaddle = { x: 570, y: 100 + Math.random() * 100, w: 10, h: 80 };

    gameOver = false;
    forcedLose = false;
    loseStartTime = null;

    // Random forced lose time between 10 and 20 seconds
    const forcedLoseTime = (Math.random() * 10 + 10) * 1000; // between 10s and 20s
    forcedLoseTimeout = setTimeout(() => {
        if (!gameOver && !userInteracted) {
            forcedLose = true;
            loseStartTime = performance.now();
        }
    }, forcedLoseTime);

    loop();
}

function movePaddles() {
    let paddleSpeed = 1.2;
    let baseError = 1.5;

    if (forcedLose && loseStartTime) {
        const elapsed = (performance.now() - loseStartTime) / 1000;
        let degradeFactor = Math.min(elapsed / 5, 1); 
        paddleSpeed -= degradeFactor * 0.7;  
        baseError += degradeFactor * 3;      
    }

    const leftError = (Math.random() - 0.5) * baseError;
    const rightError = (Math.random() - 0.5) * baseError;

    const leftTarget = ball.y - leftPaddle.h / 2 + leftError;
    const rightTarget = ball.y - rightPaddle.h / 2 + rightError;

    if (leftTarget < leftPaddle.y) leftPaddle.y -= paddleSpeed;
    else leftPaddle.y += paddleSpeed;

    if (rightTarget < rightPaddle.y) rightPaddle.y -= paddleSpeed;
    else rightPaddle.y += paddleSpeed;

    clampPaddle(leftPaddle);
    clampPaddle(rightPaddle);
}

function clampPaddle(p) {
    if (p.y < 0) p.y = 0;
    if (p.y + p.h > canvas.height) p.y = canvas.height - p.h;
}

function updateBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.vy = -ball.vy;
    }

    if (ball.x - ball.radius < leftPaddle.x + leftPaddle.w &&
        ball.y > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.h) {
        ball.x = leftPaddle.x + leftPaddle.w + ball.radius;
        ball.vx = -ball.vx;
    }

    if (ball.x + ball.radius > rightPaddle.x &&
        ball.y > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.h) {
        ball.x = rightPaddle.x - ball.radius;
        ball.vx = -ball.vx;
    }

    if (ball.x < 0 || ball.x > canvas.width) endGame();
}

function endGame() {
    gameOver = true;
    clearTimeout(forcedLoseTimeout);
    setTimeout(drawEndScreen, 500);
}

function drawEndScreen() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff"; 
    ctx.font = "20px Courier New";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const winnerText = ball.x < 0 ? "RIGHT PLAYER WINS" : "LEFT PLAYER WINS";
    ctx.fillText(winnerText, canvas.width / 2, canvas.height / 2);

    if (!userInteracted) {
        setTimeout(() => {
            if (!userInteracted) {
                resetGame();
            }
        }, 3000);
    }
}

function resetGame() {
    if (userInteracted) return; 
    initPongGame();
}

function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.w, leftPaddle.h);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.w, rightPaddle.h);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.03)";
    for (let i = 0; i < canvas.height; i += 2) {
        ctx.fillRect(0, i, canvas.width, 1);
    }
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

document.addEventListener('DOMContentLoaded', () => {
    hideAllInfoSets();
});

initPongGame();




