const express = require('express');
const path = require('path')
const fs = require('fs');
const notesData = require('./db/db.json');
const uuid = require('./helpers/uuid');
const { triggerAsyncId } = require('async_hooks');
const PORT = process.env.PORT || 3001;
//const PORT = 3001;

const app = express();

app.use(express.static('public'));
app.use(express.json());

// GET request for homepage
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// GET request for notes data from JSON file
app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './db/db.json'));
});


// POST request to add a note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment
  const { title, text } = req.body;

  if (title && text ) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    // Read in existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);

        // Append new note to JSON object
        parsedNotes.push(newNote);

        // Write updated notes back to the file 
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

//Delete request to delete a note
app.delete('/api/notes/:id',(req,res) => {
  console.info(`${req.method} request received to delete a note`);
  const idToDelete = req.params.id;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } 
      try {
        const parsedNotes = JSON.parse(data);
        //Filter out the note to delete based on its id
        const newArray = parsedNotes.filter(note => note.id !== idToDelete);

      // Write updated notes back to the file
      fs.writeFile(
        './db/db.json',
        JSON.stringify(newArray, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully deleted note!')
      );
      const response = {
        status: 'success',
        body: newArray,
      };
  
      console.log(response);
      res.status(201).json(response);

      } catch (error) {
        console.error(error);
      }
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Note Taker app listening at http://localhost:${PORT}`);
});