const express = require("express");
const path = require("path");

const app = express();
const PORT = 3001;

// Middleware to parse JSON (for future enhancements)
app.use(express.json());

// Serve the static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// API endpoint to handle location submissions (example use case)
app.post("/api/location", (req, res) => {
    const { location } = req.body;
    console.log(`Location submitted: ${location}`);
    res.status(200).json({ message: `Location ${location} received.` });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
