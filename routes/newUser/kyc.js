const express = require('express');
const router = express.Router();
const kyc = require("../../controller/newUser/kyc.controller");
const multer = require('multer');
const path = require('path');

// Storage engine config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/kyc/'); // Folder to save files
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + file.originalname;
      cb(null, uniqueName);
    }
  });
  
  // Multer middleware
  const upload = multer({ storage });


router.post('/register',upload.single('photoUrl'),kyc.kycRegister);
router.get("/getAllKyc",kyc.getAllKycs);
router.get("/:user",kyc.getSingleKycUser);

module.exports = router
