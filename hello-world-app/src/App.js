// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Dashboard from './Dashboard';
import NotFound from './NotFound';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', background: '#eee' }}>
        <Link to="/"        style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/about"   style={{ marginRight: '1rem' }}>About</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/about"   element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*"        element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;