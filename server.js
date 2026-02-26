const express = require('express');
const history = require('connect-history-api-fallback');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// 1. Middleware to enforce HTTPS
app.use((req, res, next) => {
  // Check if the request is secure (HTTPS) or if it's being forwarded as HTTPS (common in cloud hosting)
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    next();
  } else {
    // If running in localhost/development, we might not want to force HTTPS
    if (req.hostname === 'localhost' || req.hostname === '127.0.0.1') {
      return next();
    }
    // Redirect HTTP to HTTPS
    res.redirect(`https://${req.headers.host}${req.url}`);
  }
});

// 2. Support for SPA (Single Page Application) history mode
// This ensures that refreshing a page like /dashboard doesn't return 404
app.use(history());

// 3. Serve static files from the 'dist' or 'build' directory
// Adjust 'dist' to match your actual build output folder name
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(port, () => {
  console.log(`Frontend server started on port ${port}`);
  console.log(`Enforcing HTTPS on non-local connections`);
});