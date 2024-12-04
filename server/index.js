const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User');  // Import the User model
const Todo = require('./models/Todo');  // Import Todo model
require('dotenv').config();

const app = express();

// Allow requests from your frontend's origin


const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://antonhatodo.netlify.app',
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  credentials: true, // Allow credentials (e.g., cookies) to be sent
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // Ensure this is set correctly
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
    },
  })
);

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

// Middleware for authentication
const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).send('Please log in first.');
    }
    req.user = req.session.user; // Explicitly set req.user from session
    next();
};

// Route to register
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
            res.status(200).json({ 
                message: 'Login successful', 
                user: { username: user.username, id: user._id, session: req.session.user },
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password', user: null });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', user: null });
    }
});
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
            username: req.user.username, // Now correctly set
            task,
            completed: false
        });
        
        await todo.save();

        // Return the created todo with its id as JSON
        res.status(201).json({
            message: 'Todo created successfully',
            todo: {
                id: todo._id,
                task: todo.task,
                completed: todo.completed,
                username: todo.username
            }
        });
    } catch (err) {
        console.log(err); // Log the error for debugging
        res.status(500).json({ message: 'Error creating todo' });
    }
});


// READ - Get all todos
app.get('/todos', isAuthenticated, async (req, res) => {
    try {
        // Access the username from the current session
        const username = req.user.username;

        // Fetch todos for the current user
        const todos = await Todo.find({ username });

        res.status(200).json(todos);
    } catch (err) {
        console.error(err, req.session.user );
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

app.listen(3000, console.log("Server started on port http://localhost:3000/"));
