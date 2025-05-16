const Habit = require('../models/Habit');
const Record = require('../models/Record');
const { validationResult } = require('express-validator');

exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.findByUserId(req.user.id);
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching habits' });
  }
};

exports.getHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    if (habit.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(habit);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching habit' });
  }
};

exports.createHabit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, frequency, target_count } = req.body;
    const habit = await Habit.create({
      user_id: req.user.id,
      title,
      description,
      frequency,
      target_count
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ error: 'Error creating habit' });
  }
};

exports.updateHabit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    if (habit.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { title, description, frequency, target_count } = req.body;
    const updatedHabit = await Habit.update(req.params.id, {
      title,
      description,
      frequency,
      target_count
    });

    res.json(updatedHabit);
  } catch (error) {
    res.status(500).json({ error: 'Error updating habit' });
  }
};

exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    if (habit.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Habit.delete(req.params.id);
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting habit' });
  }
};

exports.logHabitCompletion = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    if (habit.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { notes } = req.body;
    const log = await Habit.logCompletion(req.params.id, notes);
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: 'Error logging habit completion' });
  }
};

exports.getHabitStats = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    if (habit.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const days = parseInt(req.query.days) || 30;
    const stats = await Habit.getCompletionStats(req.params.id, days);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching habit stats' });
  }
};