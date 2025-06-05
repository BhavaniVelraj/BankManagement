const express = require('express');
const router = express.Router();
const userRoute = require("../routes/newUser/user")
const kycRoute = require("../routes/newUser/kyc")
const kycRequestRoute = require("../routes/newUser/requestKyc")

const adminRoute =require("../routes/admin/admin")

router.use('/user',userRoute);
router.use('/kyc',kycRoute);
router.use('/kycrequest',kycRequestRoute)
router.use('/admin',adminRoute);



module.exports = router