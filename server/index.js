const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// --- 1. Middlewares ---
app.use(helmet()); 
app.use(cors());   
app.use(express.json()); 
app.use(cookieParser()); 
app.use(morgan('dev'));  

// --- 2. Routes ---
app.get('/', (req, res) => {
    res.json({
        status: "success",
        message: "Server bina database ke mast chal raha hai! 🚀"
    });
});

// Ek aur test route
app.get('/test', (req, res) => {
    res.send("Test route working fine! ✅");
});

// --- 3. Server Start ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  
    console.log(`⚡ server is running successfully`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
   
});