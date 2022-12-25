const express = require('express');
const bycrypt = require('bcrypt');
const { randomUUID } = require('crypto');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const { checkAuth } = require('../middlewares/checkAuth');

const router = express.Router();

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Caseyisawizard06",
    database: "login"
});

router.get('/profile', checkAuth, (req, res) => {
    db.query("SELECT id, username FROM users WHERE id = (?)", [req.user.id], async (err, result) => {
        return res.status(200).json(result[0]);
    });
});

router.post('/register', (req, res) => {
    try {
        if (!req.body.password || !req.body.username) {
            return res.status(403).json("ERROR: Payload doesn't contain a valid username or password!");
        }

        if (req.body.username.length > 38) {
            return res.status(500).json("ERROR: Username is longer than 38 characters!");
        }

        if (req.body.username.password > 40) {
            return res.status(500).json("ERROR: Password is longer than 40 characters!");
        }

        const illegalChars = '[|&;$%@"<>()+,]';
        for (let i = 0; i < illegalChars.length; i++) {
            if (req.body.username.includes(illegalChars.charAt(i)) || req.body.password.includes(illegalChars.charAt(i))) {
                return res.status(500).json("ERROR: Username or password contains illegal characters!"); 
            }
        }

        db.query("SELECT username FROM users WHERE username = (?)", [req.body.username], (err, result) => {
            if (result.length) {
                return res.status(401).json("ERROR: USER ALREADY EXISTS!");
            }else {
                const salt = bycrypt.genSaltSync(10);
                const hashedPassword = bycrypt.hashSync(req.body.password, salt);

                db.query("INSERT INTO users (id, username, password) VALUES (?,?,?)", 
                    [randomUUID(), req.body.username, hashedPassword], (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json(err);
                        }else {
                            res.status(201).json("User was successfully registered!");
                        }
                    });
            }
        });

    }catch (err) {
        res.status(500).json(err.message);
    }
});

router.post('/login', (req, res) => {
    try {
        if (!req.body.password || !req.body.username) {
            res.status(403).json("ERROR: Payload doesn't contain a valid username or password!");
            return;
        }

        db.query("SELECT id, username, password FROM users WHERE username = (?)", [req.body.username], async (err, result) => {
            if (result.length) {
                const user = result[0];
                const isPasswordCorrect = await bycrypt.compare(req.body.password, user.password);
                if (!isPasswordCorrect) {
                    res.status(400).json("ERROR: PASSWORD OR USERNAME WAS INCORRECT");
                }

                const payload = {
                    id: user.id
                };

                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
                res.cookie('access_token', token, {
                    httpOnly: true
                }).status(200).json({
                    username: user.username
                });

            }else {
                res.status(404).json("ERROR: USER DOESN'T EXIST!");
            }
        });

    }catch (err) {
        res.status(500).json(err.message);
    }
});


module.exports = router;

