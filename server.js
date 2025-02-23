const express = require('express');
const mysql = require('mysql2');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'mydatabase',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// GET /api/people - Retrieve all people
app.get('/api/people', (req, res) => {
    pool.query('SELECT * FROM people', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.status(200).json(results);
    });
});

// POST /api/people - Create a new person
app.post('/api/people', (req, res) => {
    const { name, age } = req.body;
    if (!name || !age) {
        return res.status(400).json({ error: 'Name and age are required' });
    }

    pool.query('INSERT INTO people (name, age) VALUES (?, ?)', [name, age], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.status(201).json({ id: results.insertId, name, age });
    });
});

// DELETE /api/people/:id - Delete a person by ID
app.delete('/api/people/:id', (req, res) => {
    const id = req.params.id;

    pool.query('DELETE FROM people WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Person not found' });
        }
        return res.status(204).send(); // 204 No Content
    });
});

// Start the server
app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});