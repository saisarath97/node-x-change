// // src/sources/binance.js
// const WebSocket = require('ws');

// // const klineIntervals = require('./klineIntervals.js'); 


// const WazirxWebSocket= (symbol, handleData) => {
//   const baseUrl = 'wss://stream.wazirx.com/stream';

//     // // Define the different intervals you want to connect to
//     const klineIntervals = [
//       '1s', '1m', '3m', '5m', '15m', '30m',
//       '1h', '2h', '4h', '6h', '8h', '12h',
//       '1d', '3d', '1w', '1M'
//     ];

//   // Define the different streams to connect to for each symbol /stream?streams=${symbol}@depth5@1000ms
//   const streamTypes = [
//     // { type: 'depth', url: `${symbol.toLowerCase().replace('_', '')}@depth20@100ms` },
//     // { type: 'ticker', url: `!ticker@arr` },
//     // { type: 'kline', url: `${baseUrl}/ws/${symbol.toLowerCase().replace('_', '')}@kline_1m@+08:00` } // Example: 1m Kline
//   ];
//   console.log("klineIntervals ",klineIntervals)

//     // Add each Kline interval as a separate stream type
//     klineIntervals.forEach((interval) => {
//       streamTypes.push({
//         type: `kline_${interval}`,
//         url: `${symbol.toLowerCase().replace('_', '')}@kline_${interval}`
//       });
//     });
//   let ws;
//   // Connect to each stream type sequentially
//   const connectWebSocket = () => {
//     ws = new WebSocket(baseUrl);
//   streamTypes.forEach((stream) => {
//     ws.on('open', () => {
//       console.log(`Wazirx WebSocket connection opened for ${symbol} (${stream.type})`);
//       console.log("stream ", stream.url);
//           // Send a subscription request to the depth stream
//         ws.send(JSON.stringify({
//             event: 'subscribe',
//             streams: [stream.url], // Change stream level or interval as needed
//             })
//         );
//       startPingPong(); 
//     });

//     ws.on('message', (data) => {
//       handleData(data, symbol, 'wazirx', stream.type);
//     });

//     ws.on('error', (error) => {
//       console.error(`Wazirx WebSocket error (${stream.type}):`, error);
//     });

//     ws.on('close', () => {
//       console.log(`Wazirx WebSocket connection closed for ${symbol} (${stream.type})`);
//       clearInterval(pingInterval);
//       setTimeout(connectWebSocket, 5000);
//       // Optionally, add reconnection logic here if needed
//     });
//   });
// }

//    // Ping-pong mechanism to keep the connection alive
//    let pingInterval;
//    const startPingPong = () => {
//      pingInterval = setInterval(() => {
//        if (ws && ws.readyState === WebSocket.OPEN) {
//          console.log('Sending ping to WazirX');
//          ws.send(JSON.stringify({ event: 'ping' }));
//        }
//      }, 30000); // Send ping every 30 seconds
//    };
 
//    connectWebSocket();
// };

// module.exports = WazirxWebSocket;
