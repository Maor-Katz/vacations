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

const onlyAdmin = (req, res, next) => {
    const token = req.header("token")
    if (token) {
        jwt.verify(token, "blah", (err, decoded) => {
            if (err) {
                res.sendStatus(401)
            } else {
                if (decoded.isAdmin) {
                    req.user = decoded
                    next();
                } else {
                    res.status(401).send("user is not admin!")
                }
            }
        })
    } else {
        res.status(401).send('required token')
    }
}

const onlyUsers = (req, res, next) => {
    const token = req.header("token")
    if (token) {
        jwt.verify(token, "blah", (err, decoded) => {
            if (err) {
                res.sendStatus(401)
            } else {
                req.user = decoded
                next();
            }
        })
    } else {
        res.status(401).send('required token')
    }
}

router.get('/', onlyUsers, (req, res) => {
    let q = `SELECT * FROM vacation`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

router.get('/:id', onlyUsers, (req, res) => {
    let q = `Select users.id as user_id, users.username, vacation.destination, vacation.description,
 vacation.id as vac_id, vacation.dates, vacation.price, vacation.img_url
from users
inner join follow 
on users.id = follow.user_id
inner join vacation
on vacation.id = follow.vacation_id
where users.id = ${req.params.id}`
    connection.query(q, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
})

router.post('/api', onlyUsers, (req, res) => {
    const {description, dates} = req.body
    if (dates && description) {
        let q = `SELECT * FROM vacations.vacation
where description like "%${description}%"
and dates like "${dates}"`
        connection.query(q, (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } else {
        res.status(400).send("Not enough info")
    }
})

router.post('/add', onlyAdmin, (req, res) => {
    const {description, dates, destination, img_url, price} = req.body
    if (dates && description && destination && img_url && price) {
        let q = `INSERT INTO Vacation (description, destination, img_url, dates, price, followers)
VALUES ("${description}", "${destination}", "${img_url}", "${dates}", ${price}, 0)`
        connection.query(q, (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } else {
        res.status(400).send("Not enough info")
    }
})

router.post('/edit/:id', onlyAdmin, (req, res) => {
    const {description, dates, destination, img_url, price} = req.body
    if (dates && description && destination && img_url && price) {
        let q = `UPDATE vacation
SET description = '${description}', destination = '${destination}', img_url = '${img_url}', dates='${dates}', price = ${price}
WHERE id=${req.params.id};`
        connection.query(q, (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } else {
        res.status(400).send("Not enough info")
    }
})

router.delete('/vacation/:id', onlyUsers, (req, res) => {
    if (req.params.id) {
        let q1 = `DELETE FROM vacation
WHERE id=${req.params.id}`
        connection.query(q1, (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } else {
        res.status(400).send('need  vacation id')
    }
})

router.delete('/follow/:id', onlyUsers, (req, res) => {
    if (req.params.id) {
        let q1 = `DELETE FROM follow
WHERE vacation_id=${req.params.id}`
        connection.query(q1, (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } else {
        res.status(400).send('need  vacation id')
    }
})

router.post('/follow', onlyUsers, (req, res) => {
    const {user_id, vacation_id} = req.body
    if (user_id && vacation_id) {
        let q = `INSERT INTO Follow (user_id, vacation_id)
VALUES (${user_id}, ${vacation_id})`
        let q1 = `UPDATE vacation
SET followers = followers + 1
WHERE id=${vacation_id}`
        connection.query(q, (err, results) => {
            if (err) throw err;
            // res.json(results);
        });
        connection.query(q1, (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } else {
        res.status(400).send('need more information')
    }
})

router.delete('/follow', onlyUsers, (req, res) => {
    const {user_id, vacation_id} = req.body
    if (user_id && vacation_id) {
        let q = `DELETE FROM follow WHERE user_id = ${user_id}
and vacation_id = ${vacation_id}`
        let q1 = `UPDATE vacation
SET followers = followers - 1
WHERE id=${vacation_id}`
        connection.query(q, (err, results) => {
            if (err) throw err;
        });
        connection.query(q1, (err, results) => {
            if (err) throw err;
            res.json(results);
        });
    } else {
        res.status(400).send('need more information')
    }
})
module.exports = router;
