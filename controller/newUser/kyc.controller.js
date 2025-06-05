// const database = require("../../database/database");
// const Joi = require("joi");

// const kyc = database.kycs;
// const User = database.users; // Assuming you have a users model



// // Validation schema for KYC data
// const kycValidationSchema = Joi.object({
//   user: Joi.string().required().messages({
//     'string.empty': 'User ID is required',
//     'any.required': 'User ID is required'
//   }),
  
//   aadhaarNumber: Joi.string().pattern(/^\d{12}$/).allow('', null).messages({
//     'string.pattern.base': 'Aadhaar number must be exactly 12 digits'
//   }),
  
//   panNumber: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).allow('', null).messages({
//     'string.pattern.base': 'PAN number must be in valid format (e.g., ABCDE1234F)'
//   }),
  
//   passportNumber: Joi.string().allow('', null).when('isForeignClient', {
//     is: true,
//     then: Joi.string().required().messages({
//       'string.empty': 'Passport number is required for foreign clients',
//       'any.required': 'Passport number is required for foreign clients'
//     })
//   }),
  
//   voterIdNumber: Joi.string().allow('', null),
  
//   drivingLicenseNumber: Joi.string().allow('', null),
  
//   occupation: Joi.string().allow('', null),
  
//   annualIncome: Joi.number().allow('', null).messages({
//     'number.base': 'Annual income must be a number'
//   }),
  
//   sourceOfFunds: Joi.string().allow('', null),
  
//   customerType: Joi.string().valid('individual', 'business', 'trust').required().messages({
//     'string.empty': 'Customer type is required',
//     'any.required': 'Customer type is required',
//     'any.only': 'Customer type must be one of: individual, business, trust'
//   }),
  
//   relatedPersonName: Joi.string().allow('', null),
//   relatedPersonKycNumber: Joi.string().allow('', null),
//   relatedPersonRelation: Joi.string().allow('', null),
  
//   address: Joi.string().required().messages({
//     'string.empty': 'Address is required',
//     'any.required': 'Address is required'
//   }),
  
//   isForeignClient: Joi.boolean().required().messages({
//     'boolean.base': 'Foreign client status must be true or false',
//     'any.required': 'Foreign client status is required'
//   })
// });

// // KYC Registration controller
// async function kycRegister(req, res, next) {
//   try {
//     // First verify if the user exists
//     const user = await User.findById(req.body.user);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Check if KYC already exists for this user
//     const existingKyc = await kyc.findOne({ user: req.body.user });
//     if (existingKyc) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "KYC details already exist for this user" 
//       });
//     }

//     // Process file uploads if any
//     let photoUrl = null;
//     if (req.files && req.files.photoUpload) {
//       photoUrl = `/uploads/kyc/${req.files.photoUpload[0].filename}`;
//     }

//     // Convert string "true"/"false" to boolean
//     const isForeignClient = req.body.isForeignClient === "true" || req.body.isForeignClient === true;

//     // Create KYC data object
//     const kycData = {
//       user: req.body.user,
//       aadhaarNumber: req.body.aadhaarNumber,
//       panNumber: req.body.panNumber,
//       passportNumber: req.body.passportNumber,
//       voterIdNumber: req.body.voterIdNumber,
//       drivingLicenseNumber: req.body.drivingLicenseNumber,
//       occupation: req.body.occupation,
//       annualIncome: req.body.annualIncome ? Number(req.body.annualIncome) : null,
//       sourceOfFunds: req.body.sourceOfFunds,
//       customerType: req.body.customerType,
//       relatedPersonName: req.body.relatedPersonName,
//       relatedPersonKycNumber: req.body.relatedPersonKycNumber,
//       relatedPersonRelation: req.body.relatedPersonRelation,
//       address: req.body.address,
//       isForeignClient: isForeignClient
//     };

//     // Validate with Joi
//     const { error } = kycValidationSchema.validate(kycData);
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details[0].message
//       });
//     }

//     // Structure the data according to your model
//     const kycModelData = {
//       user: kycData.user,
//       aadhaarNumber: kycData.aadhaarNumber,
//       panNumber: kycData.panNumber,
//       passportNumber: kycData.passportNumber,
//       voterIdNumber: kycData.voterIdNumber,
//       drivingLicenseNumber: kycData.drivingLicenseNumber,
//       occupation: kycData.occupation,
//       annualIncome: kycData.annualIncome,
//       sourceOfFunds: kycData.sourceOfFunds,
//       customerType: kycData.customerType,
//       relatedPerson: {
//         name: kycData.relatedPersonName,
//         kycNumber: kycData.relatedPersonKycNumber,
//         relation: kycData.relatedPersonRelation
//       },
//       address: kycData.address,
//       isForeignClient: kycData.isForeignClient,
//       photoUrl: {
//         originalName: req.file.originalname,
//         mimeType: req.file.mimetype,
//         size: req.file.size,
//         path: req.file.path,
//       }
//     };

//     // Save the KYC data
//     const newKyc = await kyc.create(kycModelData);

//     return res.status(201).json({
//       success: true,
//       message: "KYC details registered successfully",
//       data: newKyc
//     });
//   } catch (error) {
//     console.error("KYC Registration Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while registering KYC details",
//       error: error.message
//     });
//   }
// }

// async function getAllKycs(req,res){
//     try {
//         const kycsList = await kyc.find().exec();
//         return res.status(200).json({ status: "Success", data: kycsList });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: "Failed", message: "Internal server error" });
//     }

// }
// async function getSingleKycUser(req,res){
//     try {
//         const user = req.params.user;

//         const kycUserData = await kyc.findOne({ "user": user }).exec();

//         if (!kycUserData) {
//             return res.status(404).json({ status: "Failed", message: "User not found" });
//         }

//         return res.status(200).json({ status: "Success", data: kycUserData });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: "Failed", message: "Internal server error" });
//     }
    

// }

// // Export the function with the multer middleware
// module.exports = { kycRegister,getAllKycs,getSingleKycUser};

const database = require("../../database/database");
const Joi = require("joi");

const kyc = database.kycs;
const User = database.users;

// Validation schema for KYC data
const kycValidationSchema = Joi.object({
  user: Joi.string().required().messages({
    'string.empty': 'User ID is required',
    'any.required': 'User ID is required'
  }),
  
  aadhaarNumber: Joi.string().pattern(/^\d{12}$/).allow('', null).messages({
    'string.pattern.base': 'Aadhaar number must be exactly 12 digits'
  }),
  
  panNumber: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).allow('', null).messages({
    'string.pattern.base': 'PAN number must be in valid format (e.g., ABCDE1234F)'
  }),
  
  passportNumber: Joi.string().allow('', null).when('isForeignClient', {
    is: true,
    then: Joi.string().required().messages({
      'string.empty': 'Passport number is required for foreign clients',
      'any.required': 'Passport number is required for foreign clients'
    })
  }),
  
  voterIdNumber: Joi.string().allow('', null),
  drivingLicenseNumber: Joi.string().allow('', null),
  occupation: Joi.string().allow('', null),
  
  annualIncome: Joi.number().allow('', null).messages({
    'number.base': 'Annual income must be a number'
  }),
  
  sourceOfFunds: Joi.string().allow('', null),
  
  customerType: Joi.string().valid('individual', 'business', 'trust').required().messages({
    'string.empty': 'Customer type is required',
    'any.required': 'Customer type is required',
    'any.only': 'Customer type must be one of: individual, business, trust'
  }),
  
  relatedPersonName: Joi.string().allow('', null),
  relatedPersonKycNumber: Joi.string().allow('', null),
  relatedPersonRelation: Joi.string().allow('', null),
  
  address: Joi.string().required().messages({
    'string.empty': 'Address is required',
    'any.required': 'Address is required'
  }),
  
  isForeignClient: Joi.boolean().required().messages({
    'boolean.base': 'Foreign client status must be true or false',
    'any.required': 'Foreign client status is required'
  })
});

// KYC Registration controller
async function kycRegister(req, res, next) {
  try {
    console.log("KYC Registration - Request Body:", req.body);
    console.log("KYC Registration - Files:", req.files);
    console.log("KYC Registration - File:", req.file);

    // First verify if the user exists
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if KYC already exists for this user
    const existingKyc = await kyc.findOne({ user: req.body.user });
    if (existingKyc) {
      return res.status(400).json({ 
        success: false, 
        message: "KYC details already exist for this user" 
      });
    }

    // Convert string "true"/"false" to boolean
    const isForeignClient = req.body.isForeignClient === "true" || req.body.isForeignClient === true;

    // Create KYC data object
    const kycData = {
      user: req.body.user,
      aadhaarNumber: req.body.aadhaarNumber || null,
      panNumber: req.body.panNumber || null,
      passportNumber: req.body.passportNumber || null,
      voterIdNumber: req.body.voterIdNumber || null,
      drivingLicenseNumber: req.body.drivingLicenseNumber || null,
      occupation: req.body.occupation || null,
      annualIncome: req.body.annualIncome ? Number(req.body.annualIncome) : null,
      sourceOfFunds: req.body.sourceOfFunds || null,
      customerType: req.body.customerType,
      relatedPersonName: req.body.relatedPersonName || null,
      relatedPersonKycNumber: req.body.relatedPersonKycNumber || null,
      relatedPersonRelation: req.body.relatedPersonRelation || null,
      address: req.body.address,
      isForeignClient: isForeignClient
    };

    // Validate with Joi
    const { error } = kycValidationSchema.validate(kycData);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // Handle file upload - Check both req.file and req.files
    let photoUrlData = null;
    
    if (req.file) {
      // Single file upload (using multer's single())
      photoUrlData = {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      };
    } else if (req.files && req.files.photoUpload && req.files.photoUpload.length > 0) {
      // Multiple files or field-based upload
      const uploadedFile = req.files.photoUpload[0];
      photoUrlData = {
        originalName: uploadedFile.originalname,
        mimeType: uploadedFile.mimetype,
        size: uploadedFile.size,
        path: uploadedFile.path,
      };
    }

    // Structure the data according to your model
    const kycModelData = {
      user: kycData.user,
      aadhaarNumber: kycData.aadhaarNumber,
      panNumber: kycData.panNumber,
      passportNumber: kycData.passportNumber,
      voterIdNumber: kycData.voterIdNumber,
      drivingLicenseNumber: kycData.drivingLicenseNumber,
      occupation: kycData.occupation,
      annualIncome: kycData.annualIncome,
      sourceOfFunds: kycData.sourceOfFunds,
      customerType: kycData.customerType,
      relatedPerson: {
        name: kycData.relatedPersonName,
        kycNumber: kycData.relatedPersonKycNumber,
        relation: kycData.relatedPersonRelation
      },
      address: kycData.address,
      isForeignClient: kycData.isForeignClient
    };

    // Only add photoUrl if file was uploaded
    if (photoUrlData) {
      kycModelData.photoUrl = photoUrlData;
    }

    console.log("KYC Model Data to save:", kycModelData);

    // Save the KYC data
    const newKyc = await kyc.create(kycModelData);

    return res.status(201).json({
      success: true,
      message: "KYC details registered successfully",
      data: newKyc
    });
  } catch (error) {
    console.error("KYC Registration Error:", error);
    console.error("Error Stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "An error occurred while registering KYC details",
      error: error.message
    });
  }
}

async function getAllKycs(req, res) {
  try {
    const kycsList = await kyc.find().populate('user', 'name email').exec();
    return res.status(200).json({ status: "Success", data: kycsList });
  } catch (error) {
    console.error("Get All KYCs Error:", error);
    return res.status(500).json({ status: "Failed", message: "Internal server error" });
  }
}

async function getSingleKycUser(req, res) {
  try {
    const userId = req.params.user;

    const kycUserData = await kyc.findOne({ "user": userId }).populate('user', 'name email').exec();

    if (!kycUserData) {
      return res.status(404).json({ status: "Failed", message: "KYC data not found for this user" });
    }

    return res.status(200).json({ status: "Success", data: kycUserData });

  } catch (error) {
    console.error("Get Single KYC User Error:", error);
    return res.status(500).json({ status: "Failed", message: "Internal server error" });
  }
}

module.exports = { kycRegister, getAllKycs, getSingleKycUser };