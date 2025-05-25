const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestKycSchema = new Schema({
  user: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  requestedAt: { type: Date, default: Date.now },
  

})

module.exports = mongoose.model("requestKyc",requestKycSchema)