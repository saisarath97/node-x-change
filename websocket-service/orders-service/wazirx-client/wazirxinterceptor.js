// wazirxInterceptor.js

const crypto = require('crypto-js');

// WazirX API Constants
const WazirxApiConstants = {
    API_KEY_HEADER: 'X-WAPI-APIKEY', // Replace with the actual header name
    ENDPOINT_SECURITY_TYPE_APIKEY: 'x-api-key-required', // Replace with actual requirement header
    ENDPOINT_SECURITY_TYPE_SIGNED: 'x-signed-required'   // Replace with actual requirement header
};

// Your API credentials
const apiKey = 'your-api-key';
const secret = 'your-secret-key';

/**
 * WazirX interceptor function for Axios requests.
 * Adds API Key and signs the request if necessary.
 */
function wazirxInterceptor(request) {
    const isApiKeyRequired = request.headers[WazirxApiConstants.ENDPOINT_SECURITY_TYPE_APIKEY] !== undefined;
    const isSignatureRequired = request.headers[WazirxApiConstants.ENDPOINT_SECURITY_TYPE_SIGNED] !== undefined;

    // Remove custom headers that were used to indicate the type of security required
    delete request.headers[WazirxApiConstants.ENDPOINT_SECURITY_TYPE_APIKEY];
    delete request.headers[WazirxApiConstants.ENDPOINT_SECURITY_TYPE_SIGNED];

    // Add API key if required
    if (isApiKeyRequired || isSignatureRequired) {
        request.headers[WazirxApiConstants.API_KEY_HEADER] = apiKey;
    }

    // Sign the request if required
    if (isSignatureRequired) {
        const payload = request.params ? new URLSearchParams(request.params).toString() : '';
        if (payload) {
            // Create HMAC SHA256 signature using the secret key
            const signature = crypto.HmacSHA256(payload, secret).toString(crypto.enc.Hex);

            // Add the signature to the request parameters
            request.params = { ...request.params, signature: signature };
        }
    }

    return request;
}

module.exports = wazirxInterceptor;
