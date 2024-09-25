// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const invoiceRoutes = require('./Routes/invoiceRoutes');
const cors = require('cors')
const app = express();
const PORT = 3000;
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// cors 
app.use(cors())

// Routes
app.use('/invoice', invoiceRoutes);
app.use('/data' , invoiceRoutes)
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
