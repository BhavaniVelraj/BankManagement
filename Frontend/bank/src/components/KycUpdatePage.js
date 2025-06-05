// // src/KycUpdatePage.js
// import React, { useState } from "react";
// import axios from "axios";

// function KycUpdatePage() {
//   const [formData, setFormData] = useState({
//     aadhaarNumber: "",
//     panNumber: "",
//     passportNumber: "",
//     voterIdNumber: "",
//     drivingLicenseNumber: "",
//     occupation: "",
//     annualIncome: "",
//     sourceOfFunds: "",
//     customerType: "individual",
//     relatedPersonName: "",
//     relatedPersonKycNumber: "",
//     relatedPersonRelation: "",
//     address: "",
//     isForeignClient: false,
//     comment: "",
//   });
  
//   const [photoFile, setPhotoFile] = useState(null);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [kycSubmitted, setKycSubmitted] = useState(false);
//   const [requestSubmitted, setRequestSubmitted] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const val = type === "checkbox" ? checked : value;
//     setFormData({ ...formData, [name]: val });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         setMessage("Please select an image file only.");
//         return;
//       }
      
//       // Validate file size (5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         setMessage("File size must be less than 5MB.");
//         return;
//       }
      
//       setPhotoFile(file);
//       setMessage(""); // Clear any previous error messages
//     }
//   };

//   const validateForm = () => {
//     // Check required fields
//     if (!formData.address.trim()) {
//       setMessage("Address is required.");
//       return false;
//     }
    
//     if (!formData.customerType) {
//       setMessage("Customer type is required.");
//       return false;
//     }
    
//     // Validate Aadhaar number if provided
//     if (formData.aadhaarNumber && !/^\d{12}$/.test(formData.aadhaarNumber)) {
//       setMessage("Aadhaar number must be exactly 12 digits.");
//       return false;
//     }
    
//     // Validate PAN number if provided
//     if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
//       setMessage("PAN number must be in valid format (e.g., ABCDE1234F).");
//       return false;
//     }
    
//     // Validate passport for foreign clients
//     if (formData.isForeignClient && !formData.passportNumber.trim()) {
//       setMessage("Passport number is required for foreign clients.");
//       return false;
//     }
    
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     setLoading(true);
//     setMessage("");

//     try {
//       const userId = localStorage.getItem("userId");
      
//       if (!userId) {
//         setMessage("User ID not found. Please login again.");
//         setLoading(false);
//         return;
//       }

//       // Step 1: Submit KYC details
//       const data = new FormData();
//       data.append("user", userId);
      
//       // Append all form data
//       Object.keys(formData).forEach((key) => {
//         if (key !== 'comment') { // Don't include comment in KYC data
//           data.append(key, formData[key]);
//         }
//       });
      
//       // Append photo if selected
//       if (photoFile) {
//         data.append("photoUpload", photoFile);
//       }

//       console.log("Submitting KYC data...");
      
//       // Send to /kyc/register
//       const kycResponse = await axios.post("http://localhost:8000/kyc/register", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       console.log("KYC Response:", kycResponse.data);
//       setKycSubmitted(true);
//       setMessage("KYC details submitted successfully!");

//       // Step 2: Create KYC request to bank
//       console.log("Creating KYC request...");
      
//       const requestResponse = await axios.post("http://localhost:8000/kycRequest/createRequest", {
//         user: userId,
//         comment: formData.comment || "KYC verification request submitted",
//       });

//       console.log("Request Response:", requestResponse.data);
//       setRequestSubmitted(true);
//       setMessage("KYC details submitted and request sent to bank successfully!");

//     } catch (err) {
//       console.error("Error:", err);
      
//       if (err.response) {
//         // Server responded with error status
//         const errorMessage = err.response.data?.message || "Error submitting KYC form.";
//         setMessage(errorMessage);
        
//         // If KYC was submitted but request failed
//         if (kycSubmitted && !requestSubmitted) {
//           setMessage("KYC details saved, but failed to send request to bank. You can try again later.");
//         }
//       } else if (err.request) {
//         // Network error
//         setMessage("Network error. Please check your connection and try again.");
//       } else {
//         // Other error
//         setMessage("An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       aadhaarNumber: "",
//       panNumber: "",
//       passportNumber: "",
//       voterIdNumber: "",
//       drivingLicenseNumber: "",
//       occupation: "",
//       annualIncome: "",
//       sourceOfFunds: "",
//       customerType: "individual",
//       relatedPersonName: "",
//       relatedPersonKycNumber: "",
//       relatedPersonRelation: "",
//       address: "",
//       isForeignClient: false,
//       comment: "",
//     });
//     setPhotoFile(null);
//     setMessage("");
//     setKycSubmitted(false);
//     setRequestSubmitted(false);
//   };

//   return (
//     <div style={styles.container}>
//       <h2>KYC Update Form</h2>
      
//       {(kycSubmitted && requestSubmitted) ? (
//         <div style={styles.successContainer}>
//           <h3>✅ KYC Submitted Successfully!</h3>
//           <p>Your KYC details have been submitted and request sent to the bank for verification.</p>
//           <button onClick={resetForm} style={styles.button}>
//             Submit Another KYC
//           </button>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <div style={styles.section}>
//             <h3>Identity Documents</h3>
//             <input 
//               name="aadhaarNumber" 
//               placeholder="Aadhaar Number (12 digits)" 
//               value={formData.aadhaarNumber} 
//               onChange={handleChange}
//               maxLength="12"
//             />
//             <input 
//               name="panNumber" 
//               placeholder="PAN Number (e.g., ABCDE1234F)" 
//               value={formData.panNumber} 
//               onChange={handleChange}
//               style={{ textTransform: 'uppercase' }}
//               maxLength="10"
//             />
//             <input 
//               name="passportNumber" 
//               placeholder="Passport Number" 
//               value={formData.passportNumber} 
//               onChange={handleChange}
//             />
//             <input 
//               name="voterIdNumber" 
//               placeholder="Voter ID Number" 
//               value={formData.voterIdNumber} 
//               onChange={handleChange}
//             />
//             <input 
//               name="drivingLicenseNumber" 
//               placeholder="Driving License Number" 
//               value={formData.drivingLicenseNumber} 
//               onChange={handleChange}
//             />
//           </div>

//           <div style={styles.section}>
//             <h3>Personal Information</h3>
//             <input 
//               name="occupation" 
//               placeholder="Occupation" 
//               value={formData.occupation} 
//               onChange={handleChange}
//             />
//             <input 
//               name="annualIncome" 
//               type="number" 
//               placeholder="Annual Income" 
//               value={formData.annualIncome} 
//               onChange={handleChange}
//               min="0"
//             />
//             <input 
//               name="sourceOfFunds" 
//               placeholder="Source of Funds" 
//               value={formData.sourceOfFunds} 
//               onChange={handleChange}
//             />
            
//             <select name="customerType" value={formData.customerType} onChange={handleChange} required>
//               <option value="individual">Individual</option>
//               <option value="business">Business</option>
//               <option value="trust">Trust</option>
//             </select>

//             <textarea 
//               name="address" 
//               placeholder="Complete Address *" 
//               value={formData.address} 
//               onChange={handleChange}
//               required
//               rows="3"
//             />
//           </div>

//           <div style={styles.section}>
//             <h3>Related Person (Optional)</h3>
//             <input 
//               name="relatedPersonName" 
//               placeholder="Related Person Name" 
//               value={formData.relatedPersonName} 
//               onChange={handleChange}
//             />
//             <input 
//               name="relatedPersonKycNumber" 
//               placeholder="Related Person KYC Number" 
//               value={formData.relatedPersonKycNumber} 
//               onChange={handleChange}
//             />
//             <input 
//               name="relatedPersonRelation" 
//               placeholder="Relation with Person" 
//               value={formData.relatedPersonRelation} 
//               onChange={handleChange}
//             />
//           </div>

//           <div style={styles.section}>
//             <h3>Additional Information</h3>
//             <label style={styles.checkboxLabel}>
//               <input
//                 type="checkbox"
//                 name="isForeignClient"
//                 checked={formData.isForeignClient}
//                 onChange={handleChange}
//               />
//               <span>Foreign Client</span>
//             </label>

//             <div style={styles.fileUpload}>
//               <label>Upload Photo (Max 5MB, Images only):</label>
//               <input 
//                 type="file" 
//                 name="photoUpload" 
//                 onChange={handleFileChange}
//                 accept="image/*"
//               />
//               {photoFile && <span style={styles.fileName}>Selected: {photoFile.name}</span>}
//             </div>

//             <textarea
//               name="comment"
//               placeholder="Additional comments for bank request"
//               value={formData.comment}
//               onChange={handleChange}
//               rows="3"
//             />
//           </div>

//           <button 
//             type="submit" 
//             style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : "Submit KYC & Send Request to Bank"}
//           </button>
//         </form>
//       )}
      
//       {message && (
//         <div style={{
//           ...styles.message,
//           ...(message.includes("successfully") ? styles.successMessage : styles.errorMessage)
//         }}>
//           {message}
//         </div>
//       )}
//     </div>
//   );
// }

// const styles = {
//   container: {
//     maxWidth: "800px",
//     margin: "20px auto",
//     padding: "20px",
//     border: "1px solid #ddd",
//     borderRadius: "10px",
//     backgroundColor: "#f9f9f9",
//     fontFamily: "Arial, sans-serif"
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "20px"
//   },
//   section: {
//     padding: "15px",
//     border: "1px solid #e0e0e0",
//     borderRadius: "8px",
//     backgroundColor: "#fff"
//   },
//   button: {
//     padding: "12px 20px",
//     backgroundColor: "#007bff",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     fontSize: "16px",
//     fontWeight: "bold"
//   },
//   buttonDisabled: {
//     backgroundColor: "#6c757d",
//     cursor: "not-allowed"
//   },
//   message: {
//     padding: "10px",
//     marginTop: "15px",
//     borderRadius: "5px",
//     textAlign: "center"
//   },
//   successMessage: {
//     backgroundColor: "#d4edda",
//     color: "#155724",
//     border: "1px solid #c3e6cb"
//   },
//   errorMessage: {
//     backgroundColor: "#f8d7da",
//     color: "#721c24",
//     border: "1px solid #f5c6cb"
//   },
//   successContainer: {
//     textAlign: "center",
//     padding: "30px",
//     backgroundColor: "#d4edda",
//     borderRadius: "10px",
//     color: "#155724"
//   },
//   checkboxLabel: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px"
//   },
//   fileUpload: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "5px"
//   },
//   fileName: {
//     fontSize: "12px",
//     color: "#666"
//   }
// };

// export default KycUpdatePage;
// src/KycUpdatePage.js
import React, { useState } from "react";
import axios from "axios";

function KycUpdatePage() {
  const [formData, setFormData] = useState({
    aadhaarNumber: "",
    panNumber: "",
    passportNumber: "",
    voterIdNumber: "",
    drivingLicenseNumber: "",
    occupation: "",
    annualIncome: "",
    sourceOfFunds: "",
    customerType: "individual",
    relatedPersonName: "",
    relatedPersonKycNumber: "",
    relatedPersonRelation: "",
    address: "",
    isForeignClient: false,
    comment: "",
  });
  
  const [photoFile, setPhotoFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [kycSubmitted, setKycSubmitted] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage("Please select an image file only.");
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("File size must be less than 5MB.");
        return;
      }
      
      setPhotoFile(file);
      setMessage(""); // Clear any previous error messages
    }
  };

  const validateForm = () => {
    // Check required fields
    if (!formData.address.trim()) {
      setMessage("Address is required.");
      return false;
    }
    
    if (!formData.customerType) {
      setMessage("Customer type is required.");
      return false;
    }
    
    // Validate Aadhaar number if provided
    if (formData.aadhaarNumber && !/^\d{12}$/.test(formData.aadhaarNumber)) {
      setMessage("Aadhaar number must be exactly 12 digits.");
      return false;
    }
    
    // Validate PAN number if provided
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      setMessage("PAN number must be in valid format (e.g., ABCDE1234F).");
      return false;
    }
    
    // Validate passport for foreign clients
    if (formData.isForeignClient && !formData.passportNumber.trim()) {
      setMessage("Passport number is required for foreign clients.");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage("");

    try {
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        setMessage("User ID not found. Please login again.");
        setLoading(false);
        return;
      }

      // Step 1: Submit KYC details
      const data = new FormData();
      data.append("user", userId);
      
      // Append all form data
      Object.keys(formData).forEach((key) => {
        if (key !== 'comment') { // Don't include comment in KYC data
          data.append(key, formData[key]);
        }
      });
      
      // Append photo if selected
      if (photoFile) {
        data.append("photoUpload", photoFile);
      }

      console.log("Submitting KYC data...");
      
      // Send to /kyc/register
      const kycResponse = await axios.post("http://localhost:8000/kyc/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("KYC Response:", kycResponse.data);
      setKycSubmitted(true);
      setMessage("KYC details submitted successfully!");

      // Step 2: Create KYC request to bank
      console.log("Creating KYC request...");
      
      // Updated URL to match your route structure
      const requestResponse = await axios.post("http://localhost:8000/kycrequest/createRequest", {
        user: userId,
        comment: formData.comment || "KYC verification request submitted",
      });

      console.log("Request Response:", requestResponse.data);
      setRequestSubmitted(true);
      setMessage("KYC details submitted and request sent to bank successfully!");

    } catch (err) {
      console.error("Error:", err);
      
      if (err.response) {
        // Server responded with error status
        const errorMessage = err.response.data?.message || "Error submitting KYC form.";
        setMessage(errorMessage);
        
        // If KYC was submitted but request failed
        if (kycSubmitted && !requestSubmitted) {
          setMessage("KYC details saved, but failed to send request to bank. You can try again later.");
        }
      } else if (err.request) {
        // Network error
        setMessage("Network error. Please check your connection and try again.");
      } else {
        // Other error
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      aadhaarNumber: "",
      panNumber: "",
      passportNumber: "",
      voterIdNumber: "",
      drivingLicenseNumber: "",
      occupation: "",
      annualIncome: "",
      sourceOfFunds: "",
      customerType: "individual",
      relatedPersonName: "",
      relatedPersonKycNumber: "",
      relatedPersonRelation: "",
      address: "",
      isForeignClient: false,
      comment: "",
    });
    setPhotoFile(null);
    setMessage("");
    setKycSubmitted(false);
    setRequestSubmitted(false);
  };

  return (
    <div style={styles.container}>
      <h2>KYC Update Form</h2>
      
      {(kycSubmitted && requestSubmitted) ? (
        <div style={styles.successContainer}>
          <h3>✅ KYC Submitted Successfully!</h3>
          <p>Your KYC details have been submitted and request sent to the bank for verification.</p>
          <button onClick={resetForm} style={styles.button}>
            Submit Another KYC
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.section}>
            <h3>Identity Documents</h3>
            <input 
              name="aadhaarNumber" 
              placeholder="Aadhaar Number (12 digits)" 
              value={formData.aadhaarNumber} 
              onChange={handleChange}
              maxLength="12"
            />
            <input 
              name="panNumber" 
              placeholder="PAN Number (e.g., ABCDE1234F)" 
              value={formData.panNumber} 
              onChange={handleChange}
              style={{ textTransform: 'uppercase' }}
              maxLength="10"
            />
            <input 
              name="passportNumber" 
              placeholder="Passport Number" 
              value={formData.passportNumber} 
              onChange={handleChange}
            />
            <input 
              name="voterIdNumber" 
              placeholder="Voter ID Number" 
              value={formData.voterIdNumber} 
              onChange={handleChange}
            />
            <input 
              name="drivingLicenseNumber" 
              placeholder="Driving License Number" 
              value={formData.drivingLicenseNumber} 
              onChange={handleChange}
            />
          </div>

          <div style={styles.section}>
            <h3>Personal Information</h3>
            <input 
              name="occupation" 
              placeholder="Occupation" 
              value={formData.occupation} 
              onChange={handleChange}
            />
            <input 
              name="annualIncome" 
              type="number" 
              placeholder="Annual Income" 
              value={formData.annualIncome} 
              onChange={handleChange}
              min="0"
            />
            <input 
              name="sourceOfFunds" 
              placeholder="Source of Funds" 
              value={formData.sourceOfFunds} 
              onChange={handleChange}
            />
            
            <select name="customerType" value={formData.customerType} onChange={handleChange} required>
              <option value="individual">Individual</option>
              <option value="business">Business</option>
              <option value="trust">Trust</option>
            </select>

            <textarea 
              name="address" 
              placeholder="Complete Address *" 
              value={formData.address} 
              onChange={handleChange}
              required
              rows="3"
            />
          </div>

          <div style={styles.section}>
            <h3>Related Person (Optional)</h3>
            <input 
              name="relatedPersonName" 
              placeholder="Related Person Name" 
              value={formData.relatedPersonName} 
              onChange={handleChange}
            />
            <input 
              name="relatedPersonKycNumber" 
              placeholder="Related Person KYC Number" 
              value={formData.relatedPersonKycNumber} 
              onChange={handleChange}
            />
            <input 
              name="relatedPersonRelation" 
              placeholder="Relation with Person" 
              value={formData.relatedPersonRelation} 
              onChange={handleChange}
            />
          </div>

          <div style={styles.section}>
            <h3>Additional Information</h3>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isForeignClient"
                checked={formData.isForeignClient}
                onChange={handleChange}
              />
              <span>Foreign Client</span>
            </label>

            <div style={styles.fileUpload}>
              <label>Upload Photo (Max 5MB, Images only):</label>
              <input 
                type="file" 
                name="photoUpload" 
                onChange={handleFileChange}
                accept="image/*"
              />
              {photoFile && <span style={styles.fileName}>Selected: {photoFile.name}</span>}
            </div>

            <textarea
              name="comment"
              placeholder="Additional comments for bank request"
              value={formData.comment}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button 
            type="submit" 
            style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit KYC & Send Request to Bank"}
          </button>
        </form>
      )}
      
      {message && (
        <div style={{
          ...styles.message,
          ...(message.includes("successfully") ? styles.successMessage : styles.errorMessage)
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    fontFamily: "Arial, sans-serif"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  section: {
    padding: "15px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    backgroundColor: "#fff"
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold"
  },
  buttonDisabled: {
    backgroundColor: "#6c757d",
    cursor: "not-allowed"
  },
  message: {
    padding: "10px",
    marginTop: "15px",
    borderRadius: "5px",
    textAlign: "center"
  },
  successMessage: {
    backgroundColor: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb"
  },
  errorMessage: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb"
  },
  successContainer: {
    textAlign: "center",
    padding: "30px",
    backgroundColor: "#d4edda",
    borderRadius: "10px",
    color: "#155724"
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  fileUpload: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  fileName: {
    fontSize: "12px",
    color: "#666"
  }
};

export default KycUpdatePage;