const express = require('express');
const path = require('path');
const hbs = require('hbs');
const pageRoutes = require('./routes/pageRoutes');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

hbs.registerHelper('formatPrice', (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', pageRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});