// const express = require('express');
// const router = express.Router();
// const kyc = require("../../controller/newUser/kyc.controller");
// const multer = require('multer');
// const path = require('path');

// // Storage engine config
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/kyc/'); // Folder to save files
//     },
//     filename: (req, file, cb) => {
//       const uniqueName = Date.now() + '-' + file.originalname;
//       cb(null, uniqueName);
//     }
//   });
  
//   // Multer middlewarea/
//   const upload = multer({ storage });


// router.post('/register',upload.single('photoUrl'),kyc.kycRegister);
// router.get("/getAllKyc",kyc.getAllKycs);
// router.get("/:user",kyc.getSingleKycUser);

// module.exports = router
const express = require('express');
const router = express.Router();
const kyc = require("../../controller/newUser/kyc.controller");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads/kyc/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); // Folder to save files
    },
    filename: (req, file, cb) => {
      // Generate unique filename with timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const uniqueName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
      cb(null, uniqueName);
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer middleware with validation
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'File upload error: ' + err.message
    });
  }
  
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed!'
    });
  }
  
  next(err);
};

// KYC Routes
router.post('/register', upload.single('photoUpload'), handleMulterError, kyc.kycRegister);
router.get("/getAllKyc", kyc.getAllKycs);
router.get("/:user", kyc.getSingleKycUser);

module.exports = router;