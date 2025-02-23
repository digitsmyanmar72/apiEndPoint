const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory data store
let people = [
    { id: 1, name: "nay", age: 42 }
];

// GET /api/people - Retrieve all people
app.get('/api/people', function(req, res) {
    return res.status(200).json(people);
});

// POST /api/people - Create a new person
app.post('/api/people', function(req, res) {
    const newPerson = req.body;
    if (!newPerson.name || !newPerson.age) {
        return res.status(400).json({ error: "Name and age are required" });
    }

    // Generate a new ID (for simplicity, just increment the last ID)
    newPerson.id = people.length > 0 ? people[people.length - 1].id + 1 : 1;
    people.push(newPerson);

    return res.status(201).json(newPerson);
});

// DELETE /api/people/:id - Delete a person by ID
app.delete('/api/people/:id', function(req, res) {
    const id = parseInt(req.params.id);
    const index = people.findIndex(person => person.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Person not found" });
    }

    people.splice(index, 1);
    return res.status(204).send(); // 204 No Content
});

app.listen(8080, function() {
    console.log('Server is running on http://localhost:8080');
});