// routes.js

const express = require('express');
const { placeWazirxOrder } = require('./wazirxOrders');

const router = express.Router();

// Define a route for placing a WazirX order
router.post('/wazirx/order', async (req, res) => {
    try {
        const orderDetails = req.body;  // Get order details from request body
        const response = await placeWazirxOrder(orderDetails);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error placing order on WazirX' });
    }
});

module.exports = router;
