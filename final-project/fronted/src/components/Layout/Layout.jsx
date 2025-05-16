import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;