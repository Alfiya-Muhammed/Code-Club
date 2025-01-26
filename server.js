const express = require("express");
const path = require("path");
const { checkLogin } = require("./database");

const app = express();
const PORT = 3001;

// Middleware to parse JSON
app.use(express.json());

// Serve the static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// API endpoint to handle location submissions
app.post("/api/location", (req, res) => {
    const { location } = req.body;
    console.log(`Location submitted: ${location}`);
    res.status(200).json({ message: `Location ${location} received.` });
});

// API endpoint for login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    // Check login credentials using the database
    checkLogin(username, password, (isAuthenticated) => {
        if (isAuthenticated) {
            res.json({ success: true, message: "Login successful." });
        } else {
            res.status(401).json({ success: false, message: "Invalid username or password." });
        }
    });
});

// API endpoint to handle emergency vehicle notifications
app.post("/api/emergency", (req, res) => {
    const { location } = req.body;

    if (!location) {
        return res.status(400).json({ success: false, message: "Location is required for emergency notification." });
    }

    console.log(`Emergency vehicle reported at: ${location}`);

    // Logic to notify the Traffic Light Simulator can go here
    // For now, just simulate by sending a response to the client
    res.status(200).json({ success: true, message: `Emergency at "${location}" notified to the simulator.` });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
