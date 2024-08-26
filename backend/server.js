const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();

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
    console.error('Error storing input:', error);
    res.status(500).json({ error: 'An error occurred while storing the input' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});
