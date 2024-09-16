// binanceOrders.js

const axios = require('axios');
const apiConfig = require('./apiConfig');
const binanceInterceptor = require('./binanceInterceptor');

// Create an Axios instance for Binance
const binanceInstance = axios.create({
    baseURL: apiConfig.binance.baseURL
});

// Apply the Binance interceptor to the Axios instance
binanceInstance.interceptors.request.use(binanceInterceptor, error => Promise.reject(error));

/**
 * Function to place a new order on Binance.
 *
 * @param {Object} orderDetails - The details of the order to be placed.
 * @returns {Promise<Object>} - The response from Binance API.
 */
async function placeOrder(orderDetails) {
    const endpoint = apiConfig.binance.endpoints.newOrder;
    try {
        const response = await binanceInstance.post(endpoint, null, {
            headers: {
                [apiConfig.binance.securityType]: 'true' // Signal to interceptor that signature is required
            },
            params: orderDetails
        });

        console.log('Binance Order Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error placing Binance order:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Function to place a market order on Binance.
 *
 * @param {Object} orderDetails - The details of the market order.
 * @returns {Promise<Object>} - The response from Binance API.
 */
async function marketOrder(orderDetails) {
    orderDetails.type = 'MARKET';  // Set the order type to MARKET
    return placeOrder(orderDetails);
}

/**
 * Function to place a limit order on Binance.
 *
 * @param {Object} orderDetails - The details of the limit order.
 * @returns {Promise<Object>} - The response from Binance API.
 */
async function limitOrder(orderDetails) {
    orderDetails.type = 'LIMIT';  // Set the order type to LIMIT
    return placeOrder(orderDetails);
}

/**
 * Function to get the order book from Binance.
 *
 * @param {Object} params - The parameters for the order book request (e.g., symbol).
 * @returns {Promise<Object>} - The response from Binance API.
 */
async function getOrderBook(params) {
    const endpoint = apiConfig.binance.endpoints.orderBook; // Define the correct endpoint in apiConfig.js
    try {
        const response = await binanceInstance.get(endpoint, { params });
        console.log('Binance Order Book Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching Binance order book:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = {
    placeOrder,
    marketOrder,
    limitOrder,
    getOrderBook
};
