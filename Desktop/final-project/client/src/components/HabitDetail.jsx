// client/src/components/HabitDetail.jsx
import React, { useState, useEffect } from 'react';
import ProgressChart from './ProgressChart';

export default function HabitDetail({ habit, onClose }) {
  const [entries, setEntries] = useState([]);
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [entryValue, setEntryValue] = useState(1);
  const [notes, setNotes] = useState('');
  const token = localStorage.getItem('token');

  // 1️⃣ Load entries & goals when habit changes
  useEffect(() => {
    async function loadData() {
      const [eRes, gRes] = await Promise.all([
        fetch(`/api/entries?habitId=${habit.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/goals?habitId=${habit.id}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (eRes.ok) setEntries(await eRes.json());
      if (gRes.ok) setGoals(await gRes.json());
    }
    loadData();
  }, [habit, token]);

  // 2️⃣ Submit a new entry
  async function handleAddEntry(e) {
    e.preventDefault();
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        habit_id: habit.id,
        entry_date: new Date().toISOString().slice(0,10),
        completed: entryValue >= habit.goal,
        notes
      })
    });
    if (res.ok) {
      const entry = await res.json();
      setEntries(es => [entry, ...es]);
      setShowForm(false);
      setEntryValue(1);
      setNotes('');
    } else {
      console.error('Add entry failed');
    }
  }

  return (
    <div className="…overlay…">
      <div className="…modal…">
        <button onClick={onClose}>✕</button>
        <h2>{habit.name}</h2>
        <ProgressChart habit={habit} entries={entries} />

        {/* Show list of entries */}
        {entries.slice(0,5).map(e => (
          <div key={e.id} className="entry-card">
            <span>{e.entry_date}</span>
            <span>{e.completed ? '✅' : '❌'}</span>
          </div>
        ))}

        {/* Add new entry */}
        {!showForm
          ? <button onClick={() => setShowForm(true)}>Log activity</button>
          : (
            <form onSubmit={handleAddEntry}>
              <input
                type="number"
                value={entryValue}
                onChange={e => setEntryValue(e.target.value)}
                min="1"
                max={habit.goal*2}
                required
              />
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </form>
          )
        }
      </div>
    </div>
  );
}