const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const crypto = require("crypto");



const userSchema = new Schema(
    {
    uuid: { type: String, unique: true},
    name: { type: String, required: true },
    dob: { type: String, required:true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    user_type: { type: String, required: true, default: "user" },
    verify_token: { type: String, required: false },
    login_status: { type: String, required: false }, 
}, {
    timestamps: true
});

userSchema.pre("save", function (next) {
    this.uuid = "USR" + crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    next();
});
module.exports = mongoose.model("user", userSchema)