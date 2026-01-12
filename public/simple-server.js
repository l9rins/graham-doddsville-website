const express = require('express');
const path = require('path');
const app = express();
const PORT = 8000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Start server
app.listen(PORT, () => {
    console.log(`Simple server running on http://localhost:${PORT}`);
});