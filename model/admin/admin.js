// models/admin.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "manager" },
}, {
  timestamps: true
});

module.exports = mongoose.model("admin", adminSchema);
