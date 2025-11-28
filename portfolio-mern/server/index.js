require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const projectRoutes = require('./routes/projects');
const messageRoutes = require('./routes/messages');

app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('Portfolio API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
