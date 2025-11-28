const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// POST a new message
router.post('/', async (req, res) => {
  const message = new Message({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  try {
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
