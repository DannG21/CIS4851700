import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Home */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          HabitHero
        </Link>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            My Habits
          </Link>
          <Link
            to="/new"
            className="px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
          >
            + New Habit
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}
