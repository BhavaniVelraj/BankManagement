// // controllers/userKycController.js
// const database = require("../../database/database");
// const RequestKyc = database.requestKycs;
// const Kyc = database.kycs;
// const User = database.users;

// // Create a new KYC request
// async function createKycRequest(req, res) {
//   try {
//     const { user, comment } = req.body;

//     // Validate required fields
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID is required"
//       });
//     }

//     // Check if user exists
//     const existingUser = await User.findById(user);
//     if (!existingUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     // Check if there's already a pending request for this user
//     const existingRequest = await RequestKyc.findOne({
//       user: user,
//       status: "pending"
//     });

//     if (existingRequest) {
//       return res.status(400).json({
//         success: false,
//         message: "A pending KYC request already exists for this user"
//       });
//     }

//     // Create new KYC request
//     const newKycRequest = new RequestKyc({
//       user: user,
//       comment: comment || "",
//       status: "pending"
//     });

//     const savedRequest = await newKycRequest.save();

//     res.status(201).json({
//       success: true,
//       message: "KYC request created successfully",
//       data: savedRequest
//     });

//   } catch (err) {
//     console.error("Error creating KYC request:", err);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message
//     });
//   }
// }

// // Get all KYC requests with optional filtering and pagination
// async function getAllKycRequests(req, res) {
//   try {
//     const { 
//       status, 
//       user, 
//       page = 1, 
//       limit = 10, 
//       sortBy = 'createdAt', 
//       sortOrder = 'desc' 
//     } = req.query;

//     // Build filter object
//     const filter = {};
//     if (status) filter.status = status;
//     if (user) filter.user = user;

//     // Calculate pagination
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const sortOptions = {};
//     sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

//     // Get requests with pagination and population
//     const requests = await RequestKyc.find(filter)
//       .populate('user', 'name email') // Populate user details (adjust fields as needed)
//       .populate('assignedBy', 'name email') // Populate assigned by details
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(parseInt(limit));

//     // Get total count for pagination
//     const totalRequests = await RequestKyc.countDocuments(filter);
//     const totalPages = Math.ceil(totalRequests / parseInt(limit));

//     res.status(200).json({
//       success: true,
//       message: "KYC requests retrieved successfully",
//       data: {
//         requests,
//         pagination: {
//           currentPage: parseInt(page),
//           totalPages,
//           totalRequests,
//           hasNextPage: parseInt(page) < totalPages,
//           hasPrevPage: parseInt(page) > 1
//         }
//       }
//     });

//   } catch (err) {
//     console.error("Error fetching KYC requests:", err);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message
//     });
//   }
// }

// // Get KYC request by ID
// async function getKycRequestById(req, res) {
//   try {
//     const { id } = req.params;

//     const request = await RequestKyc.findById(id)
//       .populate('user', 'name email')
//       .populate('assignedBy', 'name email');

//     if (!request) {
//       return res.status(404).json({
//         success: false,
//         message: "KYC request not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "KYC request retrieved successfully",
//       data: request
//     });

//   } catch (err) {
//     console.error("Error fetching KYC request:", err);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message
//     });
//   }
// }

// // Update KYC request status (approve/reject)
// async function updateKycRequestStatus(req, res) {
//   try {
//     const { id } = req.params;
//     const { status, comment, assignedBy } = req.body;

//     // Validate status
//     if (status && !['pending', 'approved', 'rejected'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status. Must be 'pending', 'approved', or 'rejected'"
//       });
//     }

//     const updateData = {};
//     if (status) updateData.status = status;
//     if (comment) updateData.comment = comment;
//     if (assignedBy) updateData.assignedBy = assignedBy;

//     const updatedRequest = await RequestKyc.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     ).populate('user', 'name email')
//      .populate('assignedBy', 'name email');

//     if (!updatedRequest) {
//       return res.status(404).json({
//         success: false,
//         message: "KYC request not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "KYC request updated successfully",
//       data: updatedRequest
//     });

//   } catch (err) {
//     console.error("Error updating KYC request:", err);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message
//     });
//   }
// }

// // Get KYC requests by user ID
// async function getUserKycRequests(req, res) {
//   try {
//     const { userId } = req.params;

//     const requests = await RequestKyc.find({ user: userId })
//       .populate('assignedBy', 'name email')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       message: "User KYC requests retrieved successfully",
//       data: requests
//     });

//   } catch (err) {
//     console.error("Error fetching user KYC requests:", err);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message
//     });
//   }
// }

// module.exports = {
//   createKycRequest,
//   getAllKycRequests,
//   getKycRequestById,
//   updateKycRequestStatus,
//   getUserKycRequests
// };
const database = require("../../database/database");
const RequestKyc = database.requestKycs;
const Kyc = database.kycs;
const User = database.users;

// Create a new KYC request after KYC details are filled
async function createKycRequest(req, res) {
  try {
    const { user, comment } = req.body;

    console.log("Creating KYC Request - Request Body:", req.body);

    // Validate required fields
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Check if user exists
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if KYC details exist for this user
    const existingKyc = await Kyc.findOne({ user: user });
    if (!existingKyc) {
      return res.status(400).json({
        success: false,
        message: "Please fill KYC details first before creating a request"
      });
    }

    // Check if there's already a pending request for this user
    const existingRequest = await RequestKyc.findOne({
      user: user,
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "A pending KYC request already exists for this user"
      });
    }

    // Create new KYC request
    const newKycRequest = new RequestKyc({
      user: user,
      comment: comment || "KYC verification request",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedRequest = await newKycRequest.save();

    // Populate the saved request with user details
    const populatedRequest = await RequestKyc.findById(savedRequest._id)
      .populate('user', 'name email phone')
      .exec();

    res.status(201).json({
      success: true,
      message: "KYC request created successfully",
      data: populatedRequest
    });

  } catch (err) {
    console.error("Error creating KYC request:", err);
    console.error("Error Stack:", err.stack);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
}

// Get all KYC requests with optional filtering and pagination
async function getAllKycRequests(req, res) {
  try {
    const { 
      status, 
      user, 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (user) filter.user = user;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get requests with pagination and population
    const requests = await RequestKyc.find(filter)
      .populate('user', 'name email phone')
      .populate('assignedBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalRequests = await RequestKyc.countDocuments(filter);
    const totalPages = Math.ceil(totalRequests / parseInt(limit));

    res.status(200).json({
      success: true,
      message: "KYC requests retrieved successfully",
      data: {
        requests,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRequests,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (err) {
    console.error("Error fetching KYC requests:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
}

// Get KYC request by ID with full details
async function getKycRequestById(req, res) {
  try {
    const { id } = req.params;

    const request = await RequestKyc.findById(id)
      .populate('user', 'name email phone')
      .populate('assignedBy', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "KYC request not found"
      });
    }

    // Also get the KYC details for this user
    const kycDetails = await Kyc.findOne({ user: request.user._id });

    res.status(200).json({
      success: true,
      message: "KYC request retrieved successfully",
      data: {
        request,
        kycDetails
      }
    });

  } catch (err) {
    console.error("Error fetching KYC request:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
}

// Update KYC request status (approve/reject)
async function updateKycRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, comment, assignedBy } = req.body;

    // Validate status
    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'pending', 'approved', or 'rejected'"
      });
    }

    const updateData = {
      updatedAt: new Date()
    };
    
    if (status) updateData.status = status;
    if (comment) updateData.comment = comment;
    if (assignedBy) updateData.assignedBy = assignedBy;

    const updatedRequest = await RequestKyc.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone')
     .populate('assignedBy', 'name email');

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "KYC request not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "KYC request updated successfully",
      data: updatedRequest
    });

  } catch (err) {
    console.error("Error updating KYC request:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
}

// Get KYC requests by user ID with KYC details
async function getUserKycRequests(req, res) {
  try {
    const { userId } = req.params;

    // Get user's KYC requests
    const requests = await RequestKyc.find({ user: userId })
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    // Get user's KYC details
    const kycDetails = await Kyc.findOne({ user: userId });

    res.status(200).json({
      success: true,
      message: "User KYC requests retrieved successfully",
      data: {
        requests,
        kycDetails
      }
    });

  } catch (err) {
    console.error("Error fetching user KYC requests:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
}

// Get complete KYC information (details + requests) for a user
async function getCompleteKycInfo(req, res) {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Get KYC details
    const kycDetails = await Kyc.findOne({ user: userId });
    
    // Get KYC requests
    const kycRequests = await RequestKyc.find({ user: userId })
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Complete KYC information retrieved successfully",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        kycDetails,
        kycRequests,
        hasKycDetails: !!kycDetails,
        hasPendingRequests: kycRequests.some(req => req.status === 'pending')
      }
    });

  } catch (err) {
    console.error("Error fetching complete KYC info:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
}

module.exports = {
  createKycRequest,
  getAllKycRequests,
  getKycRequestById,
  updateKycRequestStatus,
  getUserKycRequests,
  getCompleteKycInfo
};