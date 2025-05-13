// server/src/routes/entries.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const Entry = require('../models/entry');

router.use(auth);

router.get('/', async (req, res) => {
  try {

    const { habitId } = req.query;
    const list = habitId
      ? await Entry.listByHabit(habitId)
      : await Entry.listByUser(req.user.id);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const entry = await Entry.getById(req.user.id, req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.user.id };
    const newEntry = await Entry.create(payload);
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Entry.update(req.params.id, req.user.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Entry not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const patched = await Entry.patch(req.params.id, req.user.id, req.body);
    if (!patched) return res.status(404).json({ error: 'Entry not found' });
    res.json(patched);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const success = await Entry.remove(req.params.id, req.user.id);
    if (!success) return res.status(404).json({ error: 'Entry not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;