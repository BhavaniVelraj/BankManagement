// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../../bank/src/components/LoginPage";
import KycUpdatePage from "../../bank/src/components/KycUpdatePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/kyc" element={<KycUpdatePage />} />
        {/* Add other routes like dashboard here */}
      </Routes>
    </Router>
  );
}

export default App;
