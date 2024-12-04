const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User'); // Import the User model
const Todo = require('./models/Todo');  // Import Todo model
require('dotenv').config(); 

const app = express();
app.use(express.json());
app.use(session({
    secret: 'your-secret-key', // Used to sign the session ID cookie
    resave: false,              // Don't save session if unmodified
    saveUninitialized: true,    // Save new session even if it's empty
    cookie: { secure: false }   // Set 'secure: true' in production with HTTPS
}));
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000 // Increase timeout
})
.then(() => {
    console.log("MongoDB Connected!");
})
.catch((err) => {
    console.error("MongoDB connection error:", err.message);
});

app.get('/', (req, res) => {
  res.send("testing hehe");
});
//Route to register
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ username });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      const newUser = new User({ username, password });
  
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error' });
    }
});
  
// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        
        if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare the password with the hashed password in the database
        const isMatch = await user.comparePassword(password);

        if (isMatch) {
        // Store user info in session
        req.session.user = { username: user.username, id: user._id };
        res.status(200).json({ message: 'Login successful' });
        } else {
        res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});
const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).send('Please log in first.');
    }
    next();
};
// Route to check if the user is authenticated
app.get('/auth-status', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ message: 'User is authenticated', user: req.session.user });
    } else {
        res.status(401).json({ message: 'User is not authenticated' });
    }
});

// Route to log out
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
        return res.status(500).json({ message: 'Failed to log out' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});
// CREATE - Create a new todo
app.post('/todos', isAuthenticated, async (req, res) => {
    const { task } = req.body;
    try {
      const todo = new Todo({
        task,
        completed: false
      });
      await todo.save();
      res.status(201).send('Todo created successfully');
    } catch (err) {
      res.status(500).send('Error creating todo');
    }
});
// READ - Get all todos
app.get('/todos', isAuthenticated, async (req, res) => {
    try {
      const todos = await Todo.find();
      res.status(200).json(todos);
    } catch (err) {
      res.status(500).send('Error fetching todos');
    }
});
// UPDATE - Update a todo (mark as completed or edit task)
app.put('/todos/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;
    
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(id, { task, completed }, { new: true });
      if (!updatedTodo) {
        return res.status(404).send('Todo not found');
      }
      res.status(200).send('Todo updated successfully');
    } catch (err) {
      res.status(500).send('Error updating todo');
    }
});
// DELETE - Delete a todo
app.delete('/todos/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    
    try {
      const deletedTodo = await Todo.findByIdAndDelete(id);
      if (!deletedTodo) {
        return res.status(404).send('Todo not found');
      }
      res.status(200).send('Todo deleted successfully');
    } catch (err) {
      res.status(500).send('Error deleting todo');
    }
});
app.listen(3000, console.log("Serer started on port http://localhost:3000/"))
