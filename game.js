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
let score = 0;
let gameOver = false;

function drawPanda() {
  ctx.fillStyle = "white";
  ctx.fillRect(panda.x, panda.y, panda.width, panda.height);
  ctx.fillStyle = "black";
  ctx.fillRect(panda.x + 10, panda.y + 10, 5, 5);
  ctx.fillRect(panda.x + 25, panda.y + 10, 5, 5);
}

function drawObstacles() {
  ctx.fillStyle = "green";
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
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

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px sans-serif";
  ctx.fillText("Score: " + score, 10, 30);
}

function endGame() {
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

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && panda.x > 0) panda.x -= panda.speed;
  if (e.key === "ArrowRight" && panda.x < canvas.width - panda.width) panda.x += panda.speed;
});

let frame = 0;
function gameLoop() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPanda();
  drawObstacles();
  updateObstacles();
  drawScore();
  if (frame % 60 === 0) {
    spawnObstacle();
    score++;
  }
  frame++;
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
