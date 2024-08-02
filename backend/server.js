require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const InputSchema = new mongoose.Schema({
  inputs: [Number],
  gini: Number,
  timestamp: { type: Date, default: Date.now }
});

const Input = mongoose.model('Input', InputSchema);

app.post('/api/store-input', async (req, res) => {
  try {
    const { inputs, gini } = req.body;
    const newInput = new Input({ inputs, gini });
    await newInput.save();
    res.status(201).json({ message: 'Input stored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while storing the input' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});