const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use("/assets",express.static("assets"));
const port = 3000;

// Create MySQL database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'francesco',
    password: 'some_pass',
    database: 'shop'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/jome.html');
});
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Handle login form submission
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Query the database to check if the username and password are valid
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error executing query: ' + error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        
        // If a user with the given username and password exists, redirect to dashboard
        if (results.length > 0) {
            res.redirect('/dashboard');
        } else {
            // If authentication fails, redirect back to the login page with an error message
            res.redirect('/?error=1');
        }
    });
});

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
});

// Serve member HTML file
app.get('/member', (req, res) => {
    res.sendFile(__dirname + '/member.html');
});

// Serve timetable HTML file
app.get('/timetable', (req, res) => {
    res.sendFile(__dirname + '/timetable.html');
});

app.post('/addMember', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;

    // Insert the new member into the database
    const query = `INSERT INTO members (name, email) VALUES ('${name}', '${email}')`;
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error executing query: ' + error.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        
        res.status(201).send('Member added successfully');
    });
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
