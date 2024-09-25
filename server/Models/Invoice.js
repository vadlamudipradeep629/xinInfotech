// models/Invoice.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: String,
  quantity: Number,
  unitPrice: Number,
  discount: Number,
  tax: Number,
  amountBeforeTax: Number,
  amountAfterTax: Number,
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  customerName: String,
  billingAddress: String,
  items: [itemSchema],
  totalWithoutTax: Number,
  totalTaxAmount: Number,
  totalWithTax: Number,
  roundOffAmount: Number,
  finalTotalAmount: Number,
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;









/*
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  balance: { type: Number, required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  invoiceDate: { type: Date, required: true },
  stateOfSupply: { type: String, required: true },
  billingAddress: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactNumber: { type: String, required: true },
  items: [
    {
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      amountBeforeTax: { type: Number, required: true },
      amountAfterTax: { type: Number, required: true },
    },
  ],
  totalWithoutTax: { type: Number, required: true },
  totalTaxAmount: { type: Number, required: true },
  totalWithTax: { type: Number, required: true },
  roundOffAmount: { type: Number, default: 0 },
  finalTotalAmount: { type: Number, required: true },
});

module.exports = mongoose.model('Invoice', invoiceSchema);
*/
