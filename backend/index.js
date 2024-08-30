const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rahul-123',
    database: 'voting_app'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});

// JWT secret key
const jwtSecret = 'your_jwt_secret';

// Helper function to authenticate users
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.sendStatus(401);

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// User Registration
app.post('/api/register', async (req, res) => {
    const { name, number, dob, class: userClass, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const voter_id = 'VOTE-' + Math.floor(Math.random() * 1000000);

    db.query('INSERT INTO users (name, number, dob, class, voter_id, password_hash) VALUES (?, ?, ?, ?, ?, ?)', 
    [name, number, dob, userClass, voter_id, password_hash], 
    (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'User registration failed' });
        }
        res.status(201).send({ voter_id });
    });
});

// User Login
app.post('/api/login', (req, res) => {
    const { voter_id, password } = req.body;

    db.query('SELECT * FROM users WHERE voter_id = ?', [voter_id], async (err, result) => {
        if (err || result.length === 0) {
            return res.status(400).send({ message: 'Invalid Voter ID' });
        }

        const user = result[0];

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).send({ message: 'Invalid password' });

        const token = jwt.sign({ id: user.id, voter_id: user.voter_id }, jwtSecret, { expiresIn: '1h' });
        res.send({ token });
    });
});

// Get all elections
app.get('/api/elections', authenticateToken, (req, res) => {
    db.query('SELECT * FROM elections WHERE NOW() BETWEEN start_date AND end_date', (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Failed to fetch elections' });
        }
        res.send(results);
    });
});

// Get candidates for a specific election
app.get('/api/elections/:id/candidates', authenticateToken, (req, res) => {
    const election_id = req.params.id;
    db.query('SELECT * FROM candidates WHERE election_id = ?', [election_id], (err, results) => {
        if (err) {
            return res.status(500).send({ message: 'Failed to fetch candidates' });
        }
        res.send(results);
    });
});

// Vote for a candidate
app.post('/api/vote', authenticateToken, (req, res) => {
    const { candidate_id, election_id } = req.body;
    const user_id = req.user.id;

    // Check if the user has already voted
    db.query('SELECT * FROM votes WHERE user_id = ? AND election_id = ?', [user_id, election_id], (err, result) => {
        if (err || result.length > 0) {
            return res.status(400).send({ message: 'You have already voted in this election' });
        }

        db.query('INSERT INTO votes (user_id, candidate_id, election_id) VALUES (?, ?, ?)', 
        [user_id, candidate_id, election_id], 
        (err, result) => {
            if (err) {
                return res.status(500).send({ message: 'Voting failed' });
            }
            res.send({ message: 'Vote cast successfully' });
        });
    });
});

// Get election results
app.get('/api/elections/:id/results', authenticateToken, (req, res) => {
    const election_id = req.params.id;
    db.query(
        'SELECT candidates.name, COUNT(votes.id) as vote_count FROM candidates LEFT JOIN votes ON candidates.id = votes.candidate_id WHERE candidates.election_id = ? GROUP BY candidates.id',
        [election_id],
        (err, results) => {
            if (err) {
                return res.status(500).send({ message: 'Failed to fetch results' });
            }
            res.send(results);
        }
    );
});



