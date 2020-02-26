const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vacations'
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connected to DB!');
});

function checkUserExists(req, res, next) {
    const {username} = req.body;
    let q = `SELECT * FROM users`
    connection.query(q, (err, results) => {
        if (err) {
            throw err;
        }
        const found = results.find(user => user.username === username)
        if (found) {
            req.user = found;
        }
        next();
    });
}

//get all users, its for my tests
router.get('/', (req, res) => {
    let q = `SELECT * FROM users`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

router.get('/:username', (req, res) => {
    let q = `SELECT id, firstname, lastname, username, isAdmin FROM users
    where username = '${req.params.username}'`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

router.post('/register', checkUserExists, (req, res) => {
    const {firstname, lastname, username, password} = req.body;
    if (!req.user) {//if user already exists, go to else, status 400
        if (firstname && lastname && username && password) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            console.log(hash);
            let q = `INSERT INTO Users (firstname, lastname, username, password, isAdmin)
VALUES ("${firstname}", "${lastname}", "${username}", "${hash}", false)`
            connection.query(q, (err, results) => {
                if (err) throw err;
                // res.json(results);
                jwt.sign({username, isAdmin: false}, "blah", {expiresIn: "10m"}, (err, token) => {
                    if (err) {
                        throw err
                    }
                    res.json({token})
                })
            });
        } else {
            res.status(400).send('need more info in order to register');
        }
    } else {
        res.status(400).send('user is already exists');
    }
})

router.post('/login', checkUserExists, (req, res) => {
    const {username, password} = req.body;
    if (req.user) {
        if (bcrypt.compareSync(password, req.user.password)) {
            jwt.sign({username, isAdmin: req.user.isAdmin}, "blah", {expiresIn: "10m"}, (err, token) => {
                if (err) {
                    throw err
                }
                res.json({token})
            })
        } else {
            res.status(401).send('incorrect password')
        }
    } else {
        res.status(400).send('user is not exists');
    }
})

module.exports = router;
