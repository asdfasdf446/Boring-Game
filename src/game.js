// 获取Canvas元素和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置玩家的初始状态
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  color: 'blue',
  speed: 5,
  dx: 0,
  dy: 0
};

// 画圆形的函数
function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();
}

// 更新玩家位置的函数
function updatePlayerPosition() {
  player.x += player.dx;
  player.y += player.dy;

  // 检测边界
  if (player.x + player.radius > canvas.width) {
    player.x = canvas.width - player.radius;
  } else if (player.x - player.radius < 0) {
    player.x = player.radius;
  }

  if (player.y + player.radius > canvas.height) {
    player.y = canvas.height - player.radius;
  } else if (player.y - player.radius < 0) {
    player.y = player.radius;
  }
}

// 清除Canvas的函数
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 键盘事件监听器
function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    player.dx = player.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    player.dx = -player.speed;
  } else if (e.key === 'Up' || e.key === 'ArrowUp') {
    player.dy = -player.speed;
  } else if (e.key === 'Down' || e.key === 'ArrowDown') {
    player.dy = player.speed;
  }
}

function keyUpHandler(e) {
  if (
    e.key === 'Right' || e.key === 'ArrowRight' ||
    e.key === 'Left' || e.key === 'ArrowLeft'
  ) {
    player.dx = 0;
  } else if (
    e.key === 'Up' || e.key === 'ArrowUp' ||
    e.key === 'Down' || e.key === 'ArrowDown'
  ) {
    player.dy = 0;
  }
}

// 添加键盘事件监听器
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

// 游戏主函数
function game() {
  clearCanvas();
  drawPlayer();
  updatePlayerPosition();

  requestAnimationFrame(game);
}

// 开始游戏
game();
