const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log('Server chat berjalan di ws://localhost:8080');

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Client baru terhubung');
  clients.add(ws);

  ws.on('message', (message) => {
    console.log(`Pesan diterima dari klien: ${message}`);
    setTimeout(() => {
      const serverResponse = `Balasan dari server: ${message}`;
      console.log(`Mengirim balasan ke klien: ${serverResponse}`);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(serverResponse);
      }
    }, 4000); 

    setTimeout(() => {
      const broadcastMessage = `Broadcast dari server: ${message}`;
      console.log(`Broadcast pesan: ${broadcastMessage}`);
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(broadcastMessage);
        }
      });
    }, 4000); 
  });

  ws.on('close', () => {
    console.log('Client terputus');
    clients.delete(ws);
  });
});
