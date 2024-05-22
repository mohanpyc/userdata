const express = require('express');
const connectDB = require('./Config/db');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

connectDB();

app.use(bodyParser.json());

app.use(express.json({ extended: false }));

app.use(cors());

app.get('/', (req, res) => res.send('API Running'));

app.use('/api/auth', require('./Routes/authRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
