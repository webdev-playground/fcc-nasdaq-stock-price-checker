const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ipSchema = new Schema({
  stock: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Stock", ipSchema);
