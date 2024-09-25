// controllers/invoiceController.js
const Invoice = require('../Models/Invoice');

exports.createInvoice = async (req, res) => {
  try {
    const invoiceData = req.body;
    const invoice = new Invoice(invoiceData);
    await invoice.save();
    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (error) {
    res.status(400).json({ message: 'Error creating invoice', error });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    console.log("get  method ;" , invoices)
    res.status(200).json(invoices);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching invoices', error });
  }
};
