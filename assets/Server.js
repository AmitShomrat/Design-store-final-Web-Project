const express = require('express');
const mongojs = require("mongojs");
const db = mongojs('mongodb+srv://Student:webdev2024student@cluster0.uqyflra.mongodb.net/webdev2024');
const app = express();
const port = 2000;

// Middleware to handle CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Serve static files from the "assets" and "public" directories
app.use(express.static('assets'));
app.use(express.static('public')); // Ensure your HTML, CSS, and JS files are in the 'public' directory

// Start the server
const PORT = process.env.PORT || 2000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

