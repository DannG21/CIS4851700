const express = require('express');
const multer = require('multer');
const path = require('path');
const asciify = require('asciify-image');
const fs = require('fs');
const stripAnsi = require('strip-ansi');

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Image to ASCII Converter</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <h1>Upload Image(s) for ASCII Conversion</h1>
      <form action="/ascii" method="POST" enctype="multipart/form-data">
        <label>Select images: </label>
        <input type="file" name="images" accept="image/*" multiple required><br>
        <label>Width: </label>
        <input type="number" name="width" value="50" min="10" max="200"><br>
        <label>Height: </label>
        <input type="number" name="height" value="50" min="10" max="200"><br>
        <button type="submit">Convert to ASCII</button>
      </form>
    </body>
    </html>
  `);
});

app.post('/ascii', upload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <h1>Error</h1>
        <p>No files uploaded. Please go back and select at least one image.</p>
        <a href="/">Back to upload form</a>
      </body>
      </html>
    `);
  }
  
  const width = req.body.width || 50;
  const height = req.body.height || 50;
  const options = { fit: 'box', width: parseInt(width), height: parseInt(height) };

  let asciiResults = '';

  for (const file of req.files) {
    const filePath = file.path;
    try {
      let asciiArt = await asciify(filePath, options);
      asciiArt = stripAnsi(asciiArt);
      asciiResults += `<h2>${file.originalname}</h2><pre>${asciiArt}</pre><hr>`;
    } catch (err) {
      console.error(`Error processing file ${file.originalname}:`, err);
      asciiResults += `<p>Error processing file <strong>${file.originalname}</strong>: ${err.message}</p><hr>`;
    } finally {
      await fs.promises.unlink(filePath);
    }
  }

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ASCII Art Results</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <h1>ASCII Art Results</h1>
      ${asciiResults}
      <a href="/">Upload another image</a>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/*

How does Express handle routes like / and /ascii?
- Express handles routes by using a routing system built on middleware functions. 
When you define a route like / or /ascii using methods such as app.get() or app.post(), you're telling Express to execute a specific--
callback function when a request with that HTTP method and URL comes in.

What role does multer play in handling file uploads?
- Multer is an Express middleware that simplifies handling file uploads by processing multipart/form-data requests.
This middleware abstracts much of the complexity involved in handling file uploads, letting you focus on processing the files after they've been safely received and stored.

How does the asciify-image package work to convert images into text?
- The asciify-image package takes an image file and converts it into ASCII representation by performing several steps under the hood. This automated process allows users to transform images into an artistic, text based format with minimal configuration. 
The package handles the details of image loading, resizing, conversion, and mapping, so you simply provide the image file and the desired options to get your ASCII art output.

*/