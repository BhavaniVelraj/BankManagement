const mongoose = require("mongoose")
const config = require("./config.json")

mongoose.connect(config.connectionString)

let database = mongoose.connection;
database.on("error",function(){ 
    console.log("MongoDb connection error")
})
database.on("open",function(){
    console.log("MongoDb Conncetion SuccessFully")
})

module.exports = {
    users:require("../model/newUser/user"),
    kycs:require("../model/newUser/kyc"),
    requestKycs:require("../model/newUser/requestKyc")
  }