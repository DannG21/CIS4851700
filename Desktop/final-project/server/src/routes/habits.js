// server/src/routes/habits.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const Habit = require('../models/habit');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const list = await Habit.listByUser(req.user.id);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const habit = await Habit.getById(req.user.id, req.params.id);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newHabit = await Habit.create({
      user_id: req.user.id,
      name: req.body.name,
      description: req.body.description
    });
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Habit.update(
      req.params.id,
      req.user.id,
      { name: req.body.name, description: req.body.description }
    );
    if (!updated) return res.status(404).json({ error: 'Habit not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const patched = await Habit.patch(req.params.id, req.user.id, req.body);
    if (!patched) return res.status(404).json({ error: 'Habit not found' });
    res.json(patched);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const success = await Habit.remove(req.params.id, req.user.id);
    if (!success) return res.status(404).json({ error: 'Habit not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;