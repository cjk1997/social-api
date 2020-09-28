const express = require('express');
const Router = express.Router();
const {
    getUser,
    registerUser,
} = require('../../data/users');

const salt = process.env.SALT;
const privateKey = process.env.PRIVATE_KEY;

Router.post('/login', async function(req, res) {
    try {
        const body = req.body;
        const user = await getUser('email', body.email);
        if (user.length === 0) {
            res.status(401).send("Login Failed");
            console.log("That user does not exist.");
        } else if (user.length > 1) {
            res.status(500).send("Login Failed");
            console.log("That user exists more than once.");
        } else {
            bcrypt.compare(body.password, user[0].password, function(err, result) {
                if (err) throw(err);
                if (!result) {
                    res.status(401).send("Login Failed");
                    console.log("Password is incorrect.")
                } else {
                    jwt.sign({ _id: user[0]._id },
                        privateKey,
                        { algorithm: 'HS512' },
                        function(err, token) {
                            if (err) throw(err);
                            res.set('authentication', token);
                            delete user[0].password;
                            res.set('Access-Control-Expose-Headers', 'authentication, admin, user');
                            if (body.email === 'admin@admin.com') {
                                res.set('admin', 'admin');
                            };
                            res.send(user[0]);
                        }
                    );
                };
            });
        };
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.post('/register', async function(req, res) {
    try {
        const saltRounds = +salt;
        const body = req.body;
        const password = body.password;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) throw(err);
            bcrypt.hash(password, salt, async function(err, hash) {
                if (err) throw(err);
                body.password = hash;
                const user = await registerUser(req.body);
                jwt.sign({ _id: user._id },
                    privateKey,
                    { algorithm: 'HS512' },
                    function(err, token) {
                        if (err) throw(err);
                        console.log(body.email, token);
                        res.set('authentication', token);
                        delete user.password;
                        res.set('Access-Control-Expose-Headers', 'authentication, admin, user');
                        res.send(user);
                    }
                );
            });
        });
    } catch {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

module.exports = Router;