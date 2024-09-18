// __tests__/binanceApiService.test.js
const axios = require('axios');
const { BASE_URL, API_ENDPOINTS } = require('../binanceservice/binaceApiConfig.js');
const MockAdapter = require('axios-mock-adapter');
const { getOrderBook } = require('../binanceservice/binanceapi/binanceApiService');
const formatResponse = require('../binanceservice/mappedresponses/formatresponse');
const StreamType = require('../appConfig/enum.js');

jest.mock('/home/phaniraj/Node MS/websocket-service/binanceservice/mappedresponses/formatresponse.js'); // Mock the entire formatResponse module

describe('getOrderBook', () => {
  let mock;
  
  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it('should fetch order book data and call handleData with standardized data', async () => {
    const symbol = 'BTC_USDT';
    const limit = 100;
    const mockData = {
      lastUpdateId: 1027024,
      bids: [
        [
          "60283.99000000",
          "4.73786000"
          ]
      ],
      asks: [
        [
          "60284.00000000",
          "1.69225000"
          ]
      ]
    };

    const standardizedData = {
      ...mockData,
      symbol,
      type: StreamType.DEPTH,
    };

    // Mock the API response
    mock.onGet(`${BASE_URL}${API_ENDPOINTS.ORDER_BOOK}?symbol=${symbol.replace('_', '')}&limit=${limit}`).reply(200, mockData);

    // Mock formatResponse
    formatResponse.mockImplementation((data, symbol, type) => ({
      ...data,
      symbol,
      type
    }));

    const handleDataMock = jest.fn();

    await getOrderBook(symbol, limit, handleDataMock);

    // Ensure handleData is called with the standardized data
    expect(handleDataMock).toHaveBeenCalledWith(standardizedData, symbol, StreamType.DEPTH);
  });

  it('should throw an error if the request fails', async () => {
    const symbol = 'BTC_USDT';
    const limit = 100;

    // Mock the API response to return an error
    mock.onGet(`https://api.binance.com/api/v3/depth?symbol=${symbol.replace('_', '')}&limit=${limit}`).reply(500);

    const handleDataMock = jest.fn();

    await expect(getOrderBook(symbol, limit, handleDataMock)).rejects.toThrow('Error fetching order book data:');

    // Ensure handleData is not called if there's an error
    expect(handleDataMock).not.toHaveBeenCalled();
  });
});
