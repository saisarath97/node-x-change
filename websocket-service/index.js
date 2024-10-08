// const BinanceWebSocket = require('./binanceservice/websocket/binancewebsocket.js');
// const WazirxWebSocket = require('./wazirxwebsocket.js');

// const botsConfig = require('./botconfigs.json');

// const express = require('express');
// const WebSocket = require('ws');
// const http = require('http')
// const { createClient } = require('redis');
// const redisClient = createClient({ url: 'redis://redis:6379' });

// // const redis = require('redis');

// const app = express();

// const port = 3001;

// const websocketPort = 3002;

// // const baseUrl = 'wss://stream.binance.com:9443'

// // app.use('/api', routes);

// app.use(express.json())

// app.get('/users', (req, res) => {
//     res.json({ message: 'List of users' });
//   });

// redisClient.connect().catch(console.error); // Handle Redis client connection errors

// redisClient.on('connect', () => {
//   console.log('Connected to Redis');
// });

// redisClient.on('error', (err) => {
//   console.error('Redis client error:', err);
// });


// const server = http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type':'text/plain'});
//     res.end('Websocket server is running \n');
// })

// // create a websocket server from http server to serve the UI client
// const wss = new WebSocket.Server({server});

// const clients = new Map(); // Map to track client subscriptions

// wss.on('connection', (ws) => {
//     console.log('New Connection is established ', ws);
//     // Initialize client subscriptions
//     clients.set(ws, new Set());
//     ws.send('Welcome to new websocket server');
//     ws.on('message' , (message) => {
//         const data = JSON.parse(message);
//         handleSubscribe(ws, data);
//         console.log(`Request from connection ${message}`);
//     });
//     ws.on('close', () => {
//         clients.delete(ws)
//         console.log('Client disconnected');
//     })
// });

// // handle subscription and channels to the list for a connection
// function handleSubscribe(ws, data){
//     if(data.action === 'subscribe'){
//         const channel = data.channel;
//         const symbol = data.symbol;
//         if(channel){
//             clients.get(ws).add(`${symbol}_${channel}`);
//             console.log(`Client subscribed to ${symbol} (${channel}`);
//         }
//     } else if(data.action === 'unsubscribe'){
//         const channel = data.channel;
//         const symbol = data.symbol;
//         if(channel){
//             clients.get(ws).delete(`${symbol}_${channel}`);
//             console.log(`Client unsubscribed from ${symbol} (${channel}`);
//         }
//     }
// }

// // Handle incoming data from WebSocket connections, store in redis and then send to connected clients
// const handleData = async (data, symbol, source, streamType) => {
//   const jsonData = JSON.parse(data);
  
//   // Store data in Redis
//   try {
//     await redisClient.set(`${symbol}_${source}_${streamType}_orderbook`, JSON.stringify(jsonData));
//     console.log(`Stored data in Redis for ${symbol} from ${source} (${streamType})`);
//   } catch (err) {
//     console.error('Redis set error:', err);
//   }

//   // Broadcast to connected clients
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN && clients.get(client).has(`${symbol}_${streamType}`)) {
//       client.send(JSON.stringify(jsonData));
//     }
//   });
//   console.log(`Received Data from ${source} for ${symbol} (${streamType}): `, jsonData);
// };

// // Dynamically initialize WebSocket connections based on bot configuration
// botsConfig.forEach(({ symbol, source }) => {
//     switch (source.toLowerCase()) {
//       case 'binance':
//         BinanceWebSocket(symbol, handleData);
//         break;
//       case 'wazirx':
//         WazirxWebSocket(symbol, handleData);
//         break;
//       default:
//         console.log(`Unsupported source: ${source}`);
//     }
// });

// // websocket server 
// server.listen(websocketPort, () => {
//     console.log(`Websocket server is listening on http://localhost: ${websocketPort}`);
// });

// app.listen(port, () => {
//  console.log(`WebSocket Service is listening at http://localhost: ${port}`)   
// })


const express = require('express');
const http = require('http');
const { createWebSocketServer, broadcastData } = require('./handlers/websockethandler.js');
const { redisClient } = require('./utils/redisClient.js');
// const BinanceWebSocket = require('./websockets/binanceWebSocket');
const BinanceWebSocket = require('./binanceservice/websocket/binancewebsocket.js');
const WazirxWebSocket = require('./wazirxservice/websocket/wazirxwebsocket.js');
const botsConfig = require('./appConfig/botconfigs.json');

const app = express();
const port = 3001;
const websocketPort = 3002;

app.use(express.json());

app.get('/users', (req, res) => {
  res.json({ message: 'List of users' });
});

const server = http.createServer(app);

// Initialize WebSocket server
createWebSocketServer(server, websocketPort);

// Handle data storage and broadcasting
const handleData = async (data, symbol, streamType) => {
  try {
    var jsonData = JSON.stringify(data);
    await redisClient.set(`${symbol}_${streamType}`, jsonData);
    console.log(`Stored data in Redis for ${symbol} for (${streamType})`);
  } catch (err) {
    console.error('Redis set error:', err);
  }

  broadcastData(symbol, streamType, data); // Call the broadcast function from webSocketHandler.js
};

// Dynamically initialize WebSocket connections based on bot configuration
botsConfig.forEach(({ symbol, source }) => {
  switch (source.toLowerCase()) {
    case 'binance':
      BinanceWebSocket(symbol, handleData);
      break;
    case 'wazirx':
      WazirxWebSocket(symbol, handleData);
      break;
    default:
      console.log(`Unsupported source: ${source}`);
  }
});

app.listen(port, () => {
  console.log(`WebSocket Service is listening at http://localhost:${port}`);
});
