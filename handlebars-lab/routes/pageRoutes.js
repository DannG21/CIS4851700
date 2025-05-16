const express = require('express');
const router = express.Router();
const data = require('../data.json');

router.get('/', (req, res) => {
    res.render('home', {
        title: 'Home Page',
        welcomeMessage: 'Welcome to the Handlebars Lab!',
        people: data.people,
        showImage: true
    });
});

router.get('/about', (req, res) => {
    res.render('home', {
        title: 'About Us',
        welcomeMessage: 'Learn more about us!',
        people: [],
        showImage: false
    });
});

router.get('/items', (req, res) => {
    res.render('home', {
        title: 'Item List',
        items: data.items,
        showImage: false
    });
});

router.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = data.items.find(i => i.id === id);
    if (item) {
        res.render('home', {
            title: `Item ${id}`,
            item,
            showImage: false
        });
    } else {
        res.status(404).render('home', {
            title: 'Item Not Found',
            errorMessage: 'Sorry, that item does not exist.',
            showImage: false
        });
    }
});

router.get('*', (req, res) => {
    res.status(404).render('home', {
        title: '404 - Page Not Found',
        errorMessage: 'The page you are looking for does not exist.',
        showImage: false
    });
});

module.exports = router;