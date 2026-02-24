const express = require('express');
const app = express();
const flowRoutes = require('./routes/flowRoutes');
const errorHandler = require('./middlewares/errorMiddleware');

app.use(express.json());
app.use('/api', flowRoutes);

app.use(errorHandler);

module.exports = app;