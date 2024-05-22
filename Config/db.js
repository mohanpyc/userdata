const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  console.log('connection sent before try')
  try {
    console.log('connection sent')
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
