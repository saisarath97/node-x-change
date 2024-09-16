// binanceInterceptor.js

const crypto = require('crypto-js');
const BinanceApiConstants = {
    API_KEY_HEADER: 'X-MBX-APIKEY',
    ENDPOINT_SECURITY_TYPE_APIKEY: 'x-api-key-required',
    ENDPOINT_SECURITY_TYPE_SIGNED: 'x-signed-required'
};

const apiKey = 'your-api-key';
const secret = 'your-secret-key';

// Binance interceptor function
function binanceInterceptor(request) {
    const isApiKeyRequired = request.headers[BinanceApiConstants.ENDPOINT_SECURITY_TYPE_APIKEY] !== undefined;
    const isSignatureRequired = request.headers[BinanceApiConstants.ENDPOINT_SECURITY_TYPE_SIGNED] !== undefined;

    // Remove custom headers
    delete request.headers[BinanceApiConstants.ENDPOINT_SECURITY_TYPE_APIKEY];
    delete request.headers[BinanceApiConstants.ENDPOINT_SECURITY_TYPE_SIGNED];

    // Add API key if required
    if (isApiKeyRequired || isSignatureRequired) {
        request.headers[BinanceApiConstants.API_KEY_HEADER] = apiKey;
    }

    // Sign the request if required
    if (isSignatureRequired) {
        const payload = request.params ? new URLSearchParams(request.params).toString() : '';
        if (payload) {
            const signature = crypto.HmacSHA256(payload, secret).toString(crypto.enc.Hex);
            request.params = { ...request.params, signature: signature };
        }
    }

    return request;
}

module.exports = binanceInterceptor;
