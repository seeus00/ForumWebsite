require('dotenv').config()

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cookies = require('cookie-parser');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cookies());
app.use(cors());

app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/login'));

app.use('/', (req, res) => {
    res.send("EXPRESS ROOT");
});

// app.listen(PORT, "192.168.4.56", () => {
//     console.log("SERVER IS RUNNING ON PORT 3001");
// });

app.listen(PORT, () => {
    console.log("SERVER IS RUNNING ON PORT 3001");
});