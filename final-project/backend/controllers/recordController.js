const Record = require('../models/Record');
const Habit = require('../models/Habit');
const Streak = require('../models/Streak');
const db = require('../config/database');

exports.getRecords = async (req, res) => {
  try {
    // Check if habit belongs to user
    const habitResult = await db.query(
      'SELECT user_id FROM habits WHERE id = $1',
      [req.params.habitId]
    );

    if (habitResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Habit not found' });
    }

    if (habitResult.rows[0].user_id !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const records = await Record.findByHabitId(req.params.habitId);
    res.json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

exports.getRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ msg: 'Record not found' });
    }

    // Check if habit belongs to user
    const habitResult = await db.query(
      'SELECT user_id FROM habits WHERE id = $1',
      [record.habit_id]
    );

    if (habitResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Habit not found' });
    }

    if (habitResult.rows[0].user_id !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(record);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

exports.createRecord = async (req, res) => {
  const { habit_id, notes } = req.body;

  try {
    // Check if habit belongs to user
    const habitResult = await db.query(
      'SELECT user_id FROM habits WHERE id = $1',
      [habit_id]
    );

    if (habitResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Habit not found' });
    }

    if (habitResult.rows[0].user_id !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const record = await Record.create({
      habit_id,
      notes: notes || ''
    });

    res.json(record);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ msg: 'Record not found' });
    }

    // Check if habit belongs to user
    const habitResult = await db.query(
      'SELECT user_id FROM habits WHERE id = $1',
      [record.habit_id]
    );

    if (habitResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Habit not found' });
    }

    if (habitResult.rows[0].user_id !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const updatedRecord = await Record.update(req.params.id, req.body);
    res.json(updatedRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ msg: 'Record not found' });
    }

    // Check if habit belongs to user
    const habitResult = await db.query(
      'SELECT user_id FROM habits WHERE id = $1',
      [record.habit_id]
    );

    if (habitResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Habit not found' });
    }

    if (habitResult.rows[0].user_id !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Record.delete(req.params.id);
    res.json({ msg: 'Record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

exports.getRecordsForDateRange = async (req, res) => {
  const { habitId, startDate, endDate } = req.query;

  try {
    // Check if habit belongs to user
    const habitResult = await db.query(
      'SELECT user_id FROM habits WHERE id = $1',
      [habitId]
    );

    if (habitResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Habit not found' });
    }

    if (habitResult.rows[0].user_id !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const records = await Record.findByDateRange(habitId, startDate, endDate);
    res.json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};

const updateStreaks = async (habitId) => {
  try {
    const records = await Record.find({ habit: habitId }).sort({ date: 1 });
    
    if (records.length === 0) return;
    
    let currentStreak = 0;
    let maxStreak = 0;
    let streakStart = null;
    let inStreak = false;
    
    for (let i = 0; i < records.length; i++) {
      if (records[i].completed) {
        if (!inStreak) {
          inStreak = true;
          streakStart = records[i].date;
          currentStreak = 1;
        } else {
          currentStreak++;
        }
        
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      } else {
        inStreak = false;
        currentStreak = 0;
      }
    }
    
    let streak = await Streak.findOne({ habit: habitId });
    
    if (streak) {
      streak.currentStreak = currentStreak;
      streak.maxStreak = maxStreak;
      streak.streakStart = streakStart;
      streak.lastUpdated = Date.now();
      await streak.save();
    } else {
      const newStreak = new Streak({
        habit: habitId,
        currentStreak,
        maxStreak,
        streakStart,
        lastUpdated: Date.now()
      });
      await newStreak.save();
    }
  } catch (err) {
    console.error('Error updating streaks:', err.message);
  }
};