// wazirxOrders.js

const axios = require('axios');
const wazirxInterceptor = require('./wazirxInterceptor');
const apiConfig = require('./apiConfig');

// Create an Axios instance for WazirX
const wazirxInstance = axios.create({
    baseURL: apiConfig.wazirx.baseURL
});

// Apply the WazirX interceptor to the Axios instance
wazirxInstance.interceptors.request.use(wazirxInterceptor, error => Promise.reject(error));

/**
 * Function to place a new order on WazirX.
 *
 * @param {Object} orderDetails - The details of the order to be placed.
 * @returns {Promise<Object>} - The response from WazirX API.
 */
async function placeOrder(orderDetails) {
    return executeOrder(apiConfig.wazirx.endpoints.newOrder, orderDetails);
}

/**
 * Function to place a market order on WazirX.
 *
 * @param {Object} orderDetails - The details of the market order.
 * @returns {Promise<Object>} - The response from WazirX API.
 */
async function marketOrder(orderDetails) {
    orderDetails.type = 'MARKET';  // Set the order type to MARKET
    return placeOrder(orderDetails);
}

/**
 * Function to place a limit order on WazirX.
 *
 * @param {Object} orderDetails - The details of the limit order.
 * @returns {Promise<Object>} - The response from WazirX API.
 */
async function limitOrder(orderDetails) {
    orderDetails.type = 'LIMIT';  // Set the order type to LIMIT
    return placeOrder(orderDetails);
}

/**
 * Function to get the order book from WazirX.
 *
 * @param {Object} params - The parameters for the order book request (e.g., symbol).
 * @returns {Promise<Object>} - The response from WazirX API.
 */
async function getOrderBook(params) {
    const endpoint = apiConfig.wazirx.endpoints.orderBook; // Define the correct endpoint in apiConfig.js
    try {
        const response = await wazirxInstance.get(endpoint, { params });
        console.log('WazirX Order Book Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching WazirX order book:', error.response ? error.response.data : error.message);
        throw error;
    }
}

/**
 * Helper function to execute an order on WazirX.
 *
 * @param {string} endpoint - The endpoint for the order request.
 * @param {Object} orderDetails - The details of the order to be placed.
 * @returns {Promise<Object>} - The response from WazirX API.
 */
async function executeOrder(endpoint, orderDetails) {
    try {
        const response = await wazirxInstance.post(endpoint, null, {
            headers: {
                'x-api-key-required': 'true',  // Custom header to signal API key requirement
                'x-signed-required': 'true'    // Custom header to signal signing requirement
            },
            params: orderDetails
        });

        console.log('WazirX Order Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error placing WazirX order:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = {
    placeOrder,
    marketOrder,
    limitOrder,
    getOrderBook
};
