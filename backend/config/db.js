const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use the variable from process.env
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;

//C:\Users\Rushabh\Desktop\SR TEST\backend\config\db.js