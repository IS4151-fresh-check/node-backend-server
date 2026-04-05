const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();
const connectDB = require('./db');
const routes = require('./routes');
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

connectDB();
app.use(express.json());
app.use('/api', routes);

// const PI_URL = 'http://PI_IP_ADDRESS:5000'; // Assuming Pi runs a small flask/node server

// // 1. FRONTEND CALL: Get data for ONE specific section
// app.get('/api/section/:id', async (req, res) => {
//   const sectionId = req.params.id;
//   try {
//     // We forward the request to the Pi for this specific section
//     const response = await axios.get(`${PI_URL}/sensors/${sectionId}`);
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: 'Could not reach Raspberry Pi' });
//   }
// });

// // 2. FRONTEND CALL: Get data for ALL sections
// app.get('/api/sections/all', async (req, res) => {
//   try {
//     const response = await axios.get(`${PI_URL}/sensors/all`);
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch all sensor data' });
//   }
// });

// // 3. INTERNAL SERVER CALL: Get values from Pi (Used by logic/frontend)
// // Note: This is usually a helper function rather than a public endpoint,
// // but here is a POST if you want to trigger a manual refresh from the App.
// app.post('/api/refresh-pi', async (req, res) => {
//   const { section } = req.body;
//   try {
//     const response = await axios.get(`${PI_URL}/read?section=${section}`);
//     // You could save this to a database here
//     res.json({ status: 'Success', data: response.data });
//   } catch (error) {
//     res.status(500).send('Communication with Pi failed');
//   }
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
