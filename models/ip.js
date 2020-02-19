const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ipSchema = new Schema({
  ip: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("IP", ipSchema);
