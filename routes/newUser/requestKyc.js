const express = require('express');
const router = express.Router();
const kycRequestController = require("../../controller/newUser/requestKyc.controller");

// Validation middleware for KYC request creation
const validateKycRequest = (req, res, next) => {
  const { user } = req.body;
  
  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }
  
  next();
};

// KYC Request Routes
router.post('/createRequest', validateKycRequest, kycRequestController.createKycRequest);
router.get('/getAllRequests', kycRequestController.getAllKycRequests);
router.get('/getRequest/:id', kycRequestController.getKycRequestById);
router.put('/updateRequest/:id', kycRequestController.updateKycRequestStatus);
router.get('/userRequests/:userId', kycRequestController.getUserKycRequests);
router.get('/completeInfo/:userId', kycRequestController.getCompleteKycInfo);

// Status-based routes
router.get('/pending', async (req, res) => {
  try {
    req.query.status = 'pending';
    await kycRequestController.getAllKycRequests(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending requests',
      error: error.message
    });
  }
});

router.get('/approved', async (req, res) => {
  try {
    req.query.status = 'approved';
    await kycRequestController.getAllKycRequests(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching approved requests',
      error: error.message
    });
  }
});

router.get('/rejected', async (req, res) => {
  try {
    req.query.status = 'rejected';
    await kycRequestController.getAllKycRequests(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching rejected requests',
      error: error.message
    });
  }
});

// Test route to verify the route is working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'KYC Request routes are working!',
    timestamp: new Date(),
    availableRoutes: [
      'POST /kycrequest/createRequest',
      'GET /kycrequest/getAllRequests',
      'GET /kycrequest/getRequest/:id',
      'PUT /kycrequest/updateRequest/:id',
      'GET /kycrequest/userRequests/:userId',
      'GET /kycrequest/completeInfo/:userId',
      'GET /kycrequest/pending',
      'GET /kycrequest/approved',
      'GET /kycrequest/rejected'
    ]
  });
});

module.exports = router;