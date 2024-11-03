// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/NavBar';
import BankLandingPage from './Components/BankLandingPage';
import FeedbackForm from './Components/FeedbackForm';
import Feedback from './Components/Feedback';
import BankPage from './Components/BankPage';
import  Login  from './Components/Login';
import ManagerPage from './Components/ManagerPage';
function App() {
  return (
    <Router>
      {/* Navbar appears at the top on all pages */}
      <Navbar />
      <Routes>
        <Route path="/" element={<BankLandingPage />} />
        <Route
        path="/:bankName/feedbackform"
        element={<FeedbackForm open={true} onClose={() => {/* logic to close modal */}} />} // Ensure you pass open and onClose
      />
        <Route path="/form" element={<Feedback open={true} onClose={() => {/* logic to close modal */}} /> }
        />
        <Route path="/:bankName" element={<BankPage />} />
        <Route path="/:Manager/:bankName" element={<ManagerPage />} />
        <Route path="/login" Component={Login} />
      </Routes>
    </Router>
  );
}

export default App;
