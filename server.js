const WebSocket = require('ws');

// 创建WebSocket服务器监听在8080端口
const wss = new WebSocket.Server({ port: 8080 });

// 存储所有的客户端连接
const clients = [];

// 广播给所有客户端的函数
function broadcast(data) {
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

wss.on('connection', function connection(ws) {
  // 添加新连接的客户端
  clients.push(ws);

  // 当服务器收到来自客户端的消息
  ws.on('message', function incoming(message) {
    // 将收到的消息广播给所有客户端
    broadcast(message);
  });

  // 当客户端断开连接
  ws.on('close', function close() {
    // 从客户端列表中移除
    const index = clients.indexOf(ws);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});

console.log('WebSocket server is running on port 8080');
