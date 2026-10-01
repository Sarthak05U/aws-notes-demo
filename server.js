const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// SQLite DB setup
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run("CREATE TABLE notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)");
});

app.use(express.urlencoded({ extended: true }));

// Frontend UI (Single Page App rendered from Express)
app.get('/', (req, res) => {
  db.all("SELECT * FROM notes", [], (err, rows) => {
    const listItems = rows.map(r => `<li>${r.text}</li>`).join('');
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>AWS Cloud Assignment App</title></head>
      <body style="font-family: sans-serif; padding: 40px; background: #f4f4f9;">
        <h2>☁️ Live Full-Stack App on AWS EC2</h2>
        <form action="/add" method="POST">
          <input type="text" name="note" placeholder="Enter note..." required style="padding: 8px;" />
          <button type="submit" style="padding: 8px 16px;">Add Note</button>
        </form>
        <h3>Submitted Data:</h3>
        <ul>${listItems || '<li>No notes yet.</li>'}</ul>
      </body>
      </html>
    `);
  });
});

app.post('/add', (req, res) => {
  db.run("INSERT INTO notes (text) VALUES (?)", [req.body.note], () => {
    res.redirect('/');
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`App running on port ${PORT}`);
});