const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const loadCandidates = () => {
    try {
        return JSON.parse(fs.readFileSync('candidates.json', 'utf8'));
    } catch (error) {
        return [];
    }
};

const saveCandidates = (candidates) => {
    fs.writeFileSync('candidates.json', JSON.stringify(candidates, null, 2));
};

app.get('/add-candidate', (req, res) => {
    res.send(`
      <html>
      <head>
        <title>Add New Candidate</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; }
          form { display: inline-block; text-align: left; }
          label, input { display: block; margin: 5px 0; }
          .error { color: red; }
        </style>
      </head>
      <body>
        <h1>Add a New Political Candidate</h1>
        <form action="/add-candidate" method="POST">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
          
          <label for="party">Party:</label>
          <input type="text" id="party" name="party" required>

          <label for="platform">Platform:</label>
          <input type="text" id="platform" name="platform" required>

          <label for="slogan">Slogan:</label>
          <input type="text" id="slogan" name="slogan" required>

          <input type="submit" value="Submit">
        </form>
      </body>
      </html>
    `);
});

app.post('/add-candidate', (req, res) => {
    let candidates = loadCandidates();
    const { name, party, platform, slogan } = req.body;

    if (!name || !party || !platform || !slogan) {
        return res.status(400).send(`
            <html>
                <body>
                    <h1>400 Bad Request</h1>
                    <p>All fields (name, party, platform, and slogan) must be filled out.</p>
                    <a href="/add-candidate">Go back to the form</a>
                </body>
            </html>
        `);
    }

    const newCandidate = {
        id: candidates.length + 1,
        name,
        party,
        platform,
        slogan
    };

    candidates.push(newCandidate);
    saveCandidates(candidates);

    res.redirect('/candidates');
});

app.get('/candidates', (req, res) => {
    let candidates = loadCandidates();

    let candidatesHtml = candidates.map(candidate => `
      <div class="candidate-box">
        <h2>${candidate.name}</h2>
        <p><strong>Party:</strong> ${candidate.party}</p>
        <p><strong>Platform:</strong> ${candidate.platform}</p>
        <p><strong>Slogan:</strong> ${candidate.slogan}</p>
        <a href="/candidate/${candidate.id}">View Details</a>
      </div>
    `).join('');

    res.send(`
      <html>
      <head>
        <title>Candidate List</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; }
          .candidate-box {
            display: inline-block;
            width: 300px;
            border: 1px solid gray;
            padding: 15px;
            margin: 10px;
            background-color: white;
            border-radius: 5px;
            text-align: left;
          }
          .candidate-box h2 { margin: 0 0 10px; font-size: 20px; }
        </style>
      </head>
      <body>
        <h1>All Political Candidates</h1>
        ${candidatesHtml}
      </body>
      </html>
    `);
});

app.get('/candidate/:id', (req, res) => {
    let candidates = loadCandidates();
    const candidateId = parseInt(req.params.id);

    if (isNaN(candidateId)) {
        return res.status(400).send(`
            <html>
                <body>
                    <h1>400 Bad Request</h1>
                    <p>Invalid candidate ID. Please use a valid numeric ID.</p>
                    <a href="/candidates">Go back to the candidate list</a>
                </body>
            </html>
        `);
    }

    const candidate = candidates.find(c => c.id === candidateId);

    if (!candidate) {
        return res.status(404).send(`
            <html>
                <body>
                    <h1>404 Not Found</h1>
                    <p>Candidate with ID ${candidateId} was not found.</p>
                    <a href="/candidates">Go back to the candidate list</a>
                </body>
            </html>
        `);
    }

    res.send(`
        <html>
            <body>
                <h1>Candidate Details</h1>
                <h2>${candidate.name}</h2>
                <p><strong>Party:</strong> ${candidate.party}</p>
                <p><strong>Platform:</strong> ${candidate.platform}</p>
                <p><strong>Slogan:</strong> ${candidate.slogan}</p>
                <a href="/candidates">Go back to the candidate list</a>
            </body>
        </html>
    `);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`
        <html>
            <body>
                <h1>500 Internal Server Error</h1>
                <p>Something went wrong on the server.</p>
                <a href="/candidates">Go back to the candidate list</a>
            </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});