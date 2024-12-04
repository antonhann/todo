const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const serverless = require("serverless-http")
const router = express.Router();

require('dotenv').config(); // Loads environment variables from .env file

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parses incoming JSON requests

// Example Routes
router.get('/', (req, res) => {
  res.send('Server is running!');
});

router.post('/api/todos', (req, res) => {
  const todo = req.body;
  console.log('Received todo:', todo);
  res.status(201).json({ message: 'Todo created', todo });
});

app.use('/.netlify/functions/api',router)
module.exports.handler = serverless(app)
