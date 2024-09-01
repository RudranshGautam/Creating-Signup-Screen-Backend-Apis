const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3000;

// Middleware to parse JSON data from requests
app.use(bodyParser.json());

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up a MySQL connection using environment variables
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rudransh@1',
    database: 'ss' // Updated database name
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database...');
});

// Route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle the sign-up form submission
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;

    // Check if the email already exists in the database
    const checkEmailSql = 'SELECT * FROM s WHERE email = ?'; // Updated table name
    db.query(checkEmailSql, [email], (err, result) => {
        if (err) {
            console.error('Error checking email in MySQL:', err);
            res.status(500).send('An error occurred while checking the email. Please try again.');
            return;
        }

        if (result.length > 0) {
            // Email already exists, send a response indicating this
            res.status(400).send('User with this email already exists. Please use a different email.');
        } else {
            // Email does not exist, proceed with the insertion
            const insertUserSql = 'INSERT INTO s (name, email, password) VALUES (?, ?, ?)'; // Updated table name
            db.query(insertUserSql, [name, email, password], (err, result) => {
                if (err) {
                    console.error('Error inserting data into MySQL:', err);
                    res.status(500).send('An error occurred while signing up. Please try again.');
                    return;
                }
                res.send('User signed up successfully!');
            });
        }
    });
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
