const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Redirect root to main landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main_index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
