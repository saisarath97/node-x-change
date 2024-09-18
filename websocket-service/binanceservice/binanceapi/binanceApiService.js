
const axios = require('axios');
const { BASE_URL, API_ENDPOINTS } = require('../binaceApiConfig.js');
const formatResponse = require('../mappedresponses/formatresponse.js');
const StreamType  = require('../../appConfig/enum.js');


// Function to get the order book data
const getOrderBook = async (symbol, limit = 100, handleData) => {
  try {
    const symbolToSend = symbol.replace('_', '');
    const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.ORDER_BOOK}?symbol=${symbolToSend}&limit=${limit}`);

    const standardizedData = formatResponse(response.data, symbol, StreamType.DEPTH);
    handleData(standardizedData, symbol, StreamType.DEPTH);
  } catch (error) {
    console.error('Error fetching order book data:', error);
    throw new Error('Error fetching order book data: ' + error.message); // Ensure proper error message
  }
};

module.exports = {
  getOrderBook,
};
