const router = require('express').Router();
const auth = require('../middleware/auth');
const Goal = require('../models/goal');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { habitId } = req.query;
    const list = habitId
      ? await Goal.listByHabit(habitId)
      : await Goal.listByUser(req.user.id);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const goal = await Goal.getById(req.user.id, req.params.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.user.id };
    const newGoal = await Goal.create(payload);
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Goal.update(req.params.id, req.user.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Goal not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const patched = await Goal.patch(req.params.id, req.user.id, req.body);
    if (!patched) return res.status(404).json({ error: 'Goal not found' });
    res.json(patched);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const success = await Goal.remove(req.params.id, req.user.id);
    if (!success) return res.status(404).json({ error: 'Goal not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
