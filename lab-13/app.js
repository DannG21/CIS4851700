const express = require('express');
const app = express();
const path = require('path');
const dataRoutes = require('./routes/dataRoutes');

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/data', dataRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});