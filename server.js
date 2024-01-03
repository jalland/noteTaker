const express = require('express');
const path = require('path')
const fs = require('fs');
const notesData = require('./db/db.json');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');
const PORT = 3001;

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});


app.get('/api/notes', (req, res) => res.json(notesData));

// POST request to add a note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text ) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note
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
  const idToDelete = req.params.id.toLowerCase();

  for (let i = 0; i < notesData.length; i++) {
    console.log(notesData[i])
    if (idToDelete === notesData[i].note_id.toLowerCase()) {
      const indexToDelete = i
      // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note
        const deletedNote = notesData[indexToDelete]
        console.log("DELETED NOTE SHOULD BE:")
        console.log(deletedNote)
        parsedNotes.pop(deletedNote);

        // Write updated notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully deleted notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: deletedNote,
    };

    console.log(response);
    res.status(201).json(response);
    }
  }

  
  
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Note Taker app listening at http://localhost:${PORT}`);
});