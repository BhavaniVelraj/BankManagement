// models/requestKyc.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestKycSchema = new Schema({
  user: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  comment: { type: String },
  assignedBy:{type:String}
}, {
  timestamps: true
});

module.exports = mongoose.model("requestKyc", requestKycSchema);
