const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const loadCandidates = () => {
    try {
        return JSON.parse(fs.readFileSync('candidates.json', 'utf8'));
    } catch (error) {
        return [];
    }
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
        <form action="/add-candidate" method="POST" onsubmit="return validateForm()">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
          
          <label for="party">Party:</label>
          <input type="text" id="party" name="party" required>

          <label for="platform">Platform:</label>
          <input type="text" id="platform" name="platform" required>

          <label for="slogan">Slogan:</label>
          <input type="text" id="slogan" name="slogan" required>

          <input type="submit" value="Submit">
          <p class="error" id="error-msg"></p>
        </form>

        <script>
          function validateForm() {
            let name = document.getElementById("name").value;
            let party = document.getElementById("party").value;
            let platform = document.getElementById("platform").value;
            let slogan = document.getElementById("slogan").value;
            
            if (!name || !party || !platform || !slogan) {
              document.getElementById("error-msg").innerText = "All fields are required!";
              return false;
            }
            return true;
          }
        </script>
      </body>
      </html>
    `);
});

app.post('/add-candidate', (req, res) => {
    let candidates = loadCandidates();

    const { name, party, platform, slogan } = req.body;

    if (!name || !party || !platform || !slogan) {
        return res.status(400).send("All fields are required. Please go back and fill the form.");
    }

    const newCandidate = {
        id: candidates.length + 1,
        name,
        party,
        platform,
        slogan
    };

    candidates.push(newCandidate);
    fs.writeFileSync('candidates.json', JSON.stringify(candidates, null, 2));

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
            border: 1px solid #ccc;
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
        <br><br>
        <a href="/add-candidate">Add Another Candidate</a>
      </body>
      </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});