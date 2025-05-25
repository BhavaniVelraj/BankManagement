
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const kycSchema = new Schema({
  user: {type: String},
  aadhaarNumber: { type: String },
  panNumber: { type: String },
  passportNumber: {
    type: String,
    required: function () {
      return this.isForeignClient;
    }
  },
  voterIdNumber: { type: String },
  drivingLicenseNumber: { type: String },
  occupation: { type: String },
  annualIncome: { type: Number },
  sourceOfFunds: { type: String },
  customerType: { type: String, enum: ['individual', 'business', 'trust'], required: true },
  relatedPerson: {
    name: { type: String },
    kycNumber: { type: String },
    relation: { type: String }
  },
  address: { type: String, required: true },
  isForeignClient: { type: Boolean, required: true },
  photoUrl: { type: Object }
}, {
  timestamps: true
});

module.exports = mongoose.model('kyc',kycSchema)