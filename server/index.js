const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Loads environment variables from .env file

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parses incoming JSON requests

// Example Routes
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/api/todos', (req, res) => {
  const todo = req.body;
  console.log('Received todo:', todo);
  res.status(201).json({ message: 'Todo created', todo });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
