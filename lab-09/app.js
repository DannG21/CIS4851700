/*
  How does a GET request differ from a POST request in terms of where data is sent (query string vs. body)?
 - A GET request includes data in the URL itself — usually as query parameters after a question mark (? key=value). 
That means it is displayed in the URL and is typically used to retrieve resources or filter results. 
Unlike a POST request, which sends data in the body of a request (is not visible in a URL).

What are the advantages of using body data for sending complex or larger data?
 - Using body data to send complex or larger amounts of information offers several advantages. 
Unlike query strings, which are limited in length and visible in the URL, the request body can accommodate extensive - 
structured data such as JSON or XML without affecting the URL’s cleanliness or being exposed in browser history and logs. 
This separation ensures that sensitive or voluminous data remains secure and well-organized, allowing for hierarchical or nested information to be transmitted efficiently. 
Furthermore, using the body for data enables better adherence to RESTful principles, where the URL identifies the resource and the body carries the detailed instructions or data.

How does Postman simplify the process of sending HTTP requests compared to curl?
 - With Postman, you can easily select the HTTP method, add headers, query parameters, and request bodies using intuitive forms, and then instantly view formatted responses. 
This visual approach not only reduces the likelihood of syntax errors but also provides additional features such as collections, environments, and automated testing that streamline API development and debugging. 
In contrast, curl requires manually assembling commands in the terminal, which can be more error-prone and less accessible for those not familiar with command-line interfaces.

*/


const express = require('express');
const app = express();

app.use(express.json());

const fortunes = [
  "You will have a great day!",
  "If you don't have time to do it right the first time, what makes you think you'll have time to redo it?",
  "A surprise is waiting for you around the corner.",
  "You cannot act on what you haven't imagined.",
  "Good fortune is coming your way.",
  "Practice does not make perfect. Perfect practice makes perfect.",
  "Your hard work will soon pay off.",
  "Don't comment bad code, rewrite it.",
  "You can have anything you want, but not everything you want.",
  "The best time to plant a tree is 20 years ago. The second best time is now.",
  "When life gives you lemons, you can only make lemonade if life also gives you a lot of sugar.",
  "An exciting opportunity lies ahead.",
  "When you die and your life flashes before your eyes, you are going to have to sit through several ads.",
  "The wish is the father of the thought.",
  "Loneliness isn't the absence of people but the absence of meaning."
];

app.get(['/fortunes', '/fortunes/:id'], (req, res) => {
  let id = req.params.id || req.query.id;

  if (id !== undefined) {
    id = parseInt(id);
    if (isNaN(id) || id < 0 || id >= fortunes.length) {
      return res.status(400).json({ error: "Invalid fortune ID" });
    }
    return res.json({ fortune: fortunes[id] });
  }

  const randomIndex = Math.floor(Math.random() * fortunes.length);
  return res.json({ fortune: fortunes[randomIndex] });
});

app.post('/submit', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }
  res.json({ success: true, response: `Thanks, ${name}! Your message was: "${message}"` });
});

app.post('/fortunes', (req, res) => {
  const { fortune } = req.body;
  if (!fortune) {
    return res.status(400).json({ error: 'A fortune is required' });
  }
  fortunes.push(fortune);
  res.json({ success: true, message: "Fortune added", fortuneIndex: fortunes.length - 1 });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});