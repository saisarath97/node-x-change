// apiConfig.js

const apiConfig = {
    binance: {
        baseURL: 'https://api.binance.com',
        endpoints: {
            newOrder: '/api/v3/order'
            // Add other Binance endpoints here
        }
    },
    wazirx: {
        baseURL: 'https://api.wazirx.com',
        endpoints: {
            // Define WazirX specific endpoints here
        }
    }
};

module.exports = apiConfig;
