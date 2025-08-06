// src/page/SessionExpired.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TokenExpired = () => {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gray-100">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Session Expired</h1>
      <p className="text-gray-700 mb-6">Your token has expired. Please log in again.</p>
      <Link
        to="/login"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go to Login
      </Link>
    </div>
  );
};

export default TokenExpired;
