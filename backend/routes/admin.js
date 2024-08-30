// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Adjust the path to your database connection
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken'); // Middleware to authenticate token

// Add an election
router.post('/add-election', authenticateToken, async (req, res) => {
    if (!req.user.is_admin) return res.status(403).send('Forbidden');

    const { name, duration } = req.body;
    try {
        await db.query('INSERT INTO elections (name, duration) VALUES (?, ?)', [name, duration]);
        res.send('Election added successfully');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Add a candidate
router.post('/add-candidate', authenticateToken, async (req, res) => {
    if (!req.user.is_admin) return res.status(403).send('Forbidden');

    const { name, age, class_name, election_id } = req.body;
    try {
        await db.query('INSERT INTO candidates (name, age, class_name, election_id) VALUES (?, ?, ?, ?)', [name, age, class_name, election_id]);
        res.send('Candidate added successfully');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
