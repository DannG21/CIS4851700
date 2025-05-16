import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Dashboard from './Dashboard';
import NotFound from './NotFound';
import './styles.css';

function App() {
  return (
    <Router>
      <nav>
        <NavLink to="/" end>Home</NavLink> |
        <NavLink to="/about">About</NavLink> |
        <NavLink to="/dashboard">Dashboard</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
