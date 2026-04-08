//to prevent issues with connecting to DB if your node version is more recent
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const connectDB = require('./db');
const routes = require('./routes');
const express = require('express');
const app = express();
const port = 3000;

connectDB();
app.use(express.json());
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
