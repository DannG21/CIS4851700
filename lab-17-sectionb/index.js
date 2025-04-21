require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Mayor = require('./models/mayor');
const City = require('./models/city');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get('/hello', (req, res) => {
  res.send('Hello, Section B!');
});

mongoose.connect('mongodb://localhost/Data1', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.post('/mayors', async (req, res) => {
  try {
    const { firstname, lastname, birthdate, political_party, terms_served } = req.body;
    const mayor = new Mayor({ firstname, lastname, birthdate, political_party, terms_served });
    const saved = await mayor.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/mayors', async (req, res) => {
  try {
    const mayors = await Mayor.find();
    res.json(mayors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/mayors/:id', async (req, res) => {
  try {
    const mayor = await Mayor.findById(req.params.id);
    if (!mayor) return res.status(404).json({ error: 'Mayor not found' });
    res.json(mayor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/mayors/:id', async (req, res) => {
  try {
    const updated = await Mayor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Mayor not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/mayors/:id', async (req, res) => {
  try {
    const deleted = await Mayor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Mayor not found' });
    res.json({ message: 'Mayor deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/cities', async (req, res) => {
  try {
    const { name, years } = req.body;
    const city = new City({ name, years });
    const saved = await city.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/cities', async (req, res) => {
  try {
    const cities = await City.find().populate('years.mayor');
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/cities/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id).populate('years.mayor');
    if (!city) return res.status(404).json({ error: 'City not found' });
    res.json(city);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/cities/:id', async (req, res) => {
  try {
    const updated = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'City not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/cities/:id', async (req, res) => {
  try {
    const deleted = await City.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'City not found' });
    res.json({ message: 'City deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/cities/:cityId/years', async (req, res) => {
  try {
    const city = await City.findById(req.params.cityId);
    if (!city) return res.status(404).json({ error: 'City not found' });
    city.years.push(req.body);
    await city.save();
    res.status(201).json(city);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/cities/:cityId/years', async (req, res) => {
  try {
    const city = await City.findById(req.params.cityId, 'years').populate('years.mayor');
    if (!city) return res.status(404).json({ error: 'City not found' });
    res.json(city.years);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));