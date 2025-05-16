//Student Name: Daniel Aparicio

const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

let candidates = JSON.parse(fs.readFileSync('candidates.json', 'utf8'));

app.get('/', (req, res) => {
    res.send('Welcome to the Fictitious Political Candidates Server');
});

app.get('/search', (req, res) => {
    const { party, platform, page } = req.query;
    let filteredCandidates = candidates;

    if (party) {
        filteredCandidates = filteredCandidates.filter(c => c.party === party);
    }
    if (platform) {
        filteredCandidates = filteredCandidates.filter(c => c.platform.toLowerCase().includes(platform.toLowerCase()));
    }

    if (page) {
        const pageNum = parseInt(page);
        if (isNaN(pageNum) || pageNum < 1) {
            return res.status(400).json({ message: 'Invalid page number' });
        }
        const pageSize = 2;
        const startIndex = (pageNum - 1) * pageSize;
        const pagedCandidates = filteredCandidates.slice(startIndex, startIndex + pageSize);
        if (pagedCandidates.length > 0) {
            return res.json(pagedCandidates);
        } else {
            return res.status(404).json({ message: 'No candidates found on this page' });
        }
    }

    if (filteredCandidates.length > 0) {
        res.json(filteredCandidates);
    } else {
        res.status(404).json({ message: 'No candidates found' });
    }
});

app.post('/filter', (req, res) => {
    const { platform, slogan } = req.body;
    let filteredCandidates = candidates;

    if (platform) {
        filteredCandidates = filteredCandidates.filter(c => c.platform.toLowerCase().includes(platform.toLowerCase()));
    }
    if (slogan) {
        filteredCandidates = filteredCandidates.filter(c => c.slogan.toLowerCase().includes(slogan.toLowerCase()));
    }

    if (filteredCandidates.length > 0) {
        res.json(filteredCandidates);
    } else {
        res.status(404).json({ message: 'No candidates found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});