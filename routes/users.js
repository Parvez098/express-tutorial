var express = require('express');
var router = express.Router();
const db = require("../model/user");
let md5 = require('md5');
const authentication = require("../middleware/authentication");
/* GET users listing. */

router.post('/register', (req, res) => {
    db.User.find({ $or: [{ username: req.body.username }, { email: req.body.email }] }, (err, obj) => {
        if (err) {
            res.status(400).send(err);
        } else {
            if (obj[0] != null) {
                res.status(400).json({ error: 1, message: "already exist user please provide unique username or email " });
            } else {
                if (req.body.password === req.body.confirmPassword) {
                    req.body.password = md5(req.body.password);
                    let obj = new db.User({ username: req.body.username, password: req.body.password, email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName });
                    obj.save((err, obj) => {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            res.json({ status: 1, data: obj, message: "user successfully registered" });
                        }
                    });
                } else {
                    res.status(400).json({ error: 1, message: "please check your password" });
                }
            }
        }
    });
});
router.post("/login", (req, res) => {
    db.User.find({ username: req.body.username, password: md5(req.body.password) }, (err, obj) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (obj[0] != null) {
                res.json({ status: 1, data: obj[0], message: "user found", access_token: obj[0]._id });
            } else {
                res.status(500).json({ error: 1, message: "there is no user whose credentials matched in a data base" });
            }
        }
    });
});


router.get("/get", authentication.requiredToken, (req, res, next) => {
    res.status(200).json({ status: 1, data: req.obj, message: "successfully operation" });
})
module.exports = router;