const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const panda = {
  x: 130,
  y: 500,
  width: 40,
  height: 40,
  speed: 6
};

let danks = [];
let score = 0;
let energy = 100;
let gameOver = false;

const pandaImg = document.getElementById("pandaSprite");
const weedImg = document.getElementById("weedSprite");

function drawPanda() {
  ctx.drawImage(pandaImg, panda.x, panda.y, panda.width, panda.height);
}

function drawDanks() {
  danks.forEach(d => {
    ctx.drawImage(weedImg, d.x, d.y, d.width, d.height);
  });
}

function updateDanks() {
  for (let d of danks) {
    d.y += 5;
    if (
      panda.x < d.x + d.width &&
      panda.x + panda.width > d.x &&
      panda.y < d.y + d.height &&
      panda.y + panda.height > d.y
    ) {
      score++;
      energy = Math.min(100, energy + 20);
      d.collected = true;
    }
  }
  danks = danks.filter(d => d.y < canvas.height && !d.collected);
}

function spawnDank() {
  const x = Math.floor(Math.random() * (canvas.width - 20));
  danks.push({ x, y: -20, width: 20, height: 20 });
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "16px sans-serif";
  ctx.fillText("Danks: " + score, 10, 20);
}

function drawEnergyBar() {
  ctx.fillStyle = "gray";
  ctx.fillRect(10, 30, 100, 10);
  ctx.fillStyle = "limegreen";
  ctx.fillRect(10, 30, energy, 10);
}

function endGame() {
  gameOver = true;
  document.getElementById("finalScore").innerText = "Danks: " + score;
  document.getElementById("gameOverScreen").classList.remove("hidden");
}

function restartGame() {
  panda.x = 130;
  danks = [];
  score = 0;
  energy = 100;
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
function gameLoop() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (keys["ArrowLeft"] && panda.x > 0) panda.x -= panda.speed;
  if (keys["ArrowRight"] && panda.x < canvas.width - panda.width) panda.x += panda.speed;

  drawPanda();
  drawDanks();
  updateDanks();
  drawScore();
  drawEnergyBar();

  if (frame % 20 === 0) {
    spawnDank();
  }

  energy -= 0.2;
  if (energy <= 0) endGame();

  frame++;
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
