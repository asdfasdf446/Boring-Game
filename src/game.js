// 获取Canvas元素和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 存储所有玩家的对象
var players = {};

// 设置本地玩家的初始状态
const player = {
  id: null,
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  color: 'blue',
  speed: 5,
  dx: 0,
  dy: 0
};

// 创建WebSocket连接
const ws = new WebSocket('ws://YOUR_SERVER_IP:8080');

// WebSocket事件监听
ws.onopen = function() {
  console.log('Connected to the server');
};

ws.onmessage = function(event) {
  const message = JSON.parse(event.data);
  if (message.type === 'update') {
    players = message.players;
  } else if (message.type === 'init') {
    player.id = message.id;
    player.color = message.color; // 服务器指定颜色
  }
};

// 发送本地玩家的状态到服务器
function sendPlayerUpdate() {
  if (player.id !== null) {
    ws.send(JSON.stringify({
      type: 'update',
      id: player.id,
      x: player.x,
      y: player.y
    }));
  }
}

// 更新本地玩家位置的函数
function updatePlayerPosition() {
  player.x += player.dx;
  player.y += player.dy;

  // 检测边界
  player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
  player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

  // 发送位置更新
  sendPlayerUpdate();
}

// 清除Canvas的函数
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 绘制所有玩家
function drawPlayers() {
  Object.keys(players).forEach(function(id) {
    const otherPlayer = players[id];
    ctx.beginPath();
    ctx.arc(otherPlayer.x, otherPlayer.y, otherPlayer.radius, 0, Math.PI * 2);
    ctx.fillStyle = otherPlayer.color;
    ctx.fill();
    ctx.closePath();
  });
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
  if (['Right', 'ArrowRight', 'Left', 'ArrowLeft'].includes(e.key)) {
    player.dx = 0;
  } else if (['Up', 'ArrowUp', 'Down', 'ArrowDown'].includes(e.key)) {
    player.dy = 0;
  }
}

// 添加键盘事件监听器
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

// 游戏主函数
function game() {
  clearCanvas();
  drawPlayers(); // 现在这个函数负责绘制所有玩家
  updatePlayerPosition();
  requestAnimationFrame(game);
}

// 开始游戏
game();

