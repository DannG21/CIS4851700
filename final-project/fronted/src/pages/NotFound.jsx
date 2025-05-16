import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <h2 className="text-2xl text-gray-700 mb-8">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;