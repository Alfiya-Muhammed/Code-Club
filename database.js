const sqlite3 = require('sqlite3').verbose();

// Create or open the SQLite database
let db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Database connected.');
        createUsersTable();  // After connecting, create the users table
    }
});

// Function to create the Users table (if it doesn't exist)
function createUsersTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            username TEXT NOT NULL UNIQUE, 
            password TEXT NOT NULL
        )
    `;
    db.run(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Users table created or already exists.');
            // After creating the table, insert test users if the table is empty
            insertTestUsers();
        }
    });
}

// Function to insert test users (only if the table is empty)
function insertTestUsers() {
    const checkQuery = 'SELECT COUNT(*) AS count FROM users';
    db.get(checkQuery, [], (err, row) => {
        if (err) {
            console.error('Error checking users table:', err.message);
        } else if (row.count === 0) {
            // Insert test users if no users exist
            insertUser('admin', 'password123');
            insertUser('user1', 'testpassword');
            insertUser('john_doe', 'johnpassword');
        }
    });
}

// Function to insert a new user
function insertUser(username, password) {
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    stmt.run(username, password, (err) => {
        if (err) {
            console.error('Error inserting user:', err.message);
        } else {
            console.log(`User ${username} inserted`);
        }
    });
    stmt.finalize();
}

// Function to check login credentials
function checkLogin(username, password, callback) {
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error('Error checking login:', err.message);
            callback(false);
        } else {
            callback(row !== undefined);  // If a matching row is found, login is successful
        }
    });
}

module.exports = { insertUser, checkLogin };
