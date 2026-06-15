const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '..', '.env')
});

const materialsRoutes = require('./routes/materials');
const dashboardRoutes = require('./routes/dashboard');
const transactionRoutes = require('./routes/transactions');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/materials', materialsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transactions', transactionRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong'
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
