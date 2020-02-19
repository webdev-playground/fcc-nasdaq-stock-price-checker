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
  }
});

module.exports = mongoose.model("Stock", ipSchema);
