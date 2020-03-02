const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db');
const path = require('path');

app.use(express.json());

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res, next) =>
  res.sendFile(path.join(__dirname + '/index.html'))
);

app.get('/api/notes', (req, res, next) => {
  db.readNotes()
    .then(notes => res.send(notes))
    .catch(next);
});

app.post('/api/notes', (req, res, next) => {
  db.createNote(req.body)
    .then(note => res.send(note))
    .catch(next);
});

app.delete('/api/notes/:id', (req, res, next) => {
  db.deleteNote(req.params.id)
    .then(response => res.send(response))
    .catch(next);
});

db.sync().then(() => {
  app.listen(port, () => console.log(`listening on port ${port}...`));
});
