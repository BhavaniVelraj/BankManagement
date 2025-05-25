const express = require('express');
const router = express.Router();
const userRoute = require("../routes/newUser/user")
const kycRoute = require("../routes/newUser/kyc")

router.use('/user',userRoute);
router.use('/kyc',kycRoute);


module.exports = router