const pg = require('pg');
const { Client } = pg;

const client = new pg.Client(
  process.env.DATABSAE_URL || 'postgres://localhost/sticky_notes_db'
);

client.connect();

const sync = async () => {
  const SQL = `
  DROP TABLE IF EXISTS notes;

  CREATE TABLE notes(
    id SERIAL PRIMARY KEY,
    note VARCHAR DEFAULT 'note goes here',
    color VARCHAR DEFAULT 'yellow'
    );

  INSERT INTO notes (note, color)
  VALUES ('my first note', 'aquamarine');
  `;
  await client.query(SQL);
};

const readNotes = async () => {
  const SQL = `
  SELECT * FROM notes`;
  const response = await client.query(SQL);
  return response.rows;
};

const createNote = async note => {
  const SQL = `
  INSERT INTO notes (note, color) VALUES ($1, $2) returning *`;
  const response = await client.query(SQL, [note.note, note.color]);
  return response.rows[0];
};

const deleteNote = async id => {
  console.log('delete note in data layer is being called');
  const SQL = `
  DELETE FROM notes WHERE (id)=$1 returning *`;
  const response = await client.query(SQL, [id]);
  console.log(response.rows[0]);
  return response.rows[0];
};

module.exports = {
  sync,
  readNotes,
  createNote,
  deleteNote,
};
