const WebSocket = require('ws');

// 创建一个WebSocket服务器的实例
const wss = new WebSocket.Server({ port: 8080 });

// 用于存储所有玩家状态的对象
const players = {};

// 生成随机颜色的函数
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// 广播所有玩家状态的函数
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// 当有玩家连接到服务器时
wss.on('connection', ws => {
    // 为新玩家分配一个唯一的ID和初始状态
    const currentPlayerID = Date.now().toString();
    players[currentPlayerID] = { x: 50, y: 50, radius: 10, color: getRandomColor() };

    // 通知新玩家他们的ID和颜色，并广播所有玩家状态
    ws.send(JSON.stringify({ type: 'init', id: currentPlayerID, color: players[currentPlayerID].color }));
    broadcast(JSON.stringify({ type: 'update', players: players }));

    // 当从客户端接收到消息时
    ws.on('message', message => {
        const msg = JSON.parse(message);

        // 更新发送消息的玩家的位置
        if(players[msg.id]) {
            players[msg.id].x = msg.x;
            players[msg.id].y = msg.y;
        }

        // 广播更新后的所有玩家状态
        broadcast(JSON.stringify({ type: 'update', players: players }));
    });

    // 当玩家断开连接时
    ws.on('close', () => {
        // 从玩家状态中移除
        delete players[currentPlayerID];

        // 广播更新后的所有玩家状态
        broadcast(JSON.stringify({ type: 'update', players: players }));
    });
});

console.log('WebSocket server is running on port 8080');

