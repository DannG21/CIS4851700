const express = require('express');
const router = express.Router();
const data = require('../data.json');

router.get('/', (req, res) => {
    res.json(data);
});

router.get('/regex/:id([a-zA-Z0-9]+)', (req, res) => {
    const id = req.params.id;
    const item = data.find(d => d.id === parseInt(id));
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: "Item not found" });
    }
});

router.get('/:id/details', (req, res) => {
    const id = req.params.id;
    const item = data.find(d => d.id === parseInt(id));
    if (item) {
        res.json({ id: item.id, name: item.name, details: item.details });
    } else {
        res.status(404).json({ error: "Details not found" });
    }
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const item = data.find(d => d.id === parseInt(id));
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: "Item not found" });
    }
});

router.get('*', (req, res) => {
    res.status(404).json({ error: "Wildcard: No matching route" });
});

module.exports = router;