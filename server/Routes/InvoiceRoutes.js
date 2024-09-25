// routes/invoiceRoutes.js
const express = require('express');
const { createInvoice, getInvoices } = require('../controllers/invoiceController');

const router = express.Router();

router.post('/send', createInvoice);
router.get('/get', getInvoices);

module.exports = router;
