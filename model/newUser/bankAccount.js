const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankAccountSchema = new Schema({
user: { type: "" ,ref: 'User', required: true },
  accountNumber: { type: String, required: true, unique: true },  
  accountType: { type: String, required: true }, 
  balance: { type: Number, default: 0 },
  branchName: { type: String, required: true },
  ifscCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("bankAccount",bankAccountSchema)