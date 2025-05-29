const express = require('express');
const router = express.Router();
const kycRequest = require("../../controller/newUser/requestKyc.controller");

router.post('/createRequest',kycRequest.createKycRequest);
router.get('/getAllKycRequests',kycRequest.getAllKycRequests);
router.get('/:id',kycRequest.getKycRequestById);
router.post('/createRequest',kycRequest.createKycRequest);
router.post('/createRequest',kycRequest.createKycRequest);







module.exports = router
