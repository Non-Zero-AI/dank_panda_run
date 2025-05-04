const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const panda = {
  x: 180,
  y: 500,
  width: 40,
  height: 40,
  speed: 5
};

let obstacles = [];
let boosts = [];
let score = 0;
let gameOver = false;
let boostActive = false;
let boostTimer = 0;
let continues = 0;
let survivalTime = 0;

function drawPanda() {
  // Head
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(panda.x + panda.width / 2, panda.y + panda.height / 2, 20, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(panda.x + 5, panda.y + 5, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(panda.x + panda.width - 5, panda.y + 5, 6, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.beginPath();
  ctx.arc(panda.x + 10, panda.y + 15, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(panda.x + panda.width - 10, panda.y + 15, 4, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.beginPath();
  ctx.arc(panda.x + panda.width / 2, panda.y + 25, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawObstacles() {
  obstacles.forEach(obs => {
    // Tree trunk
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(obs.x + obs.width / 3, obs.y + obs.height / 2, obs.width / 3, obs.height / 2);
    // Tree foliage
    ctx.fillStyle = "#228B22";
    ctx.beginPath();
    ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 1.2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function updateObstacles() {
  for (let obs of obstacles) {
    obs.y += 4;
    if (
      panda.x < obs.x + obs.width &&
      panda.x + panda.width > obs.x &&
      panda.y < obs.y + obs.height &&
      panda.y + panda.height > obs.y
    ) {
      endGame();
    }
  }
  obstacles = obstacles.filter(obs => obs.y < canvas.height);
}

function spawnObstacle() {
  const x = Math.floor(Math.random() * (canvas.width - 40));
  obstacles.push({ x, y: -40, width: 40, height: 40 });
}

function drawBoosts() {
  boosts.forEach(b => {
    ctx.fillStyle = "#00cc00";
    ctx.beginPath();
    ctx.moveTo(b.x + 10, b.y);
    ctx.lineTo(b.x + 15, b.y + 10);
    ctx.lineTo(b.x + 5, b.y + 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(b.x + 9, b.y + 10, 2, 10);
  });
}

function updateBoosts() {
  for (let b of boosts) {
    b.y += 3;
    if (
      panda.x < b.x + b.width &&
      panda.x + panda.width > b.x &&
      panda.y < b.y + b.height &&
      panda.y + panda.height > b.y
    ) {
      boostActive = true;
      boostTimer = 300;
      continues++;
      b.collected = true;
    }
  }
  boosts = boosts.filter(b => b.y < canvas.height && !b.collected);
}

function spawnBoost() {
  const x = Math.floor(Math.random() * (canvas.width - 20));
  boosts.push({ x, y: -20, width: 20, height: 20 });
}

function drawScore() {
  ctx.fillStyle = boostActive ? "#00cc00" : "black";
  ctx.font = "16px sans-serif";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("Continues: " + continues, 10, 40);
  ctx.fillText("Time: " + Math.floor(survivalTime / 60) + "s", 10, 60);
}

function endGame() {
  if (continues > 0) {
    continues--;
    return;
  }
  gameOver = true;
  document.getElementById("finalScore").innerText = "Score: " + score;
  document.getElementById("gameOverScreen").classList.remove("hidden");
}

function restartGame() {
  panda.x = 180;
  obstacles = [];
  score = 0;
  gameOver = false;
  document.getElementById("gameOverScreen").classList.add("hidden");
  requestAnimationFrame(gameLoop);
}

let keys = {};
document.addEventListener("keydown", e => {
  keys[e.key] = true;
});
document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

// Touch controls for mobile
let isTouching = false;
canvas.addEventListener("touchstart", e => {
  isTouching = true;
});
canvas.addEventListener("touchmove", e => {
  if (isTouching && e.touches.length > 0) {
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    panda.x = touchX - panda.width / 2;
    if (panda.x < 0) panda.x = 0;
    if (panda.x > canvas.width - panda.width) panda.x = canvas.width - panda.width;
  }
});
canvas.addEventListener("touchend", () => {
  isTouching = false;
});

let frame = 0;
let boostSpawnTimer = Math.floor(Math.random() * 600) + 600; // 10–20 seconds at 60fps

function gameLoop() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (keys["ArrowLeft"] && panda.x > 0) panda.x -= panda.speed;
  if (keys["ArrowRight"] && panda.x < canvas.width - panda.width) panda.x += panda.speed;

  drawPanda();
  drawObstacles();
  drawBoosts();
  updateObstacles();
  updateBoosts();
  drawScore();

  if (frame % 60 === 0) {
    spawnObstacle();
    score += boostActive ? 5 : 1;
  }

  if (frame % boostSpawnTimer === 0) {
    spawnBoost();
    boostSpawnTimer = Math.floor(Math.random() * 600) + 600;
  }

  if (boostActive) {
    boostTimer--;
    if (boostTimer <= 0) boostActive = false;
  }
  survivalTime++;
  frame++;
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
