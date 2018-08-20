var express = require('express');
var router = express.Router();
const db = require("../model/user");
let md5 = require('md5');
/* GET users listing. */

router.post('/register', (req, res) => {
    db.User.find({ $or: [{ username: req.body.username }, { email: req.body.email }] }, (err, obj) => {
        if (err) {
            res.status(400).send(err);
        } else {
            if (obj[0] != null) {
                res.status(400).json({error:1, message: "already exist user please provide unique username or email "});
            } else {
                if (req.body.password === req.body.confirmPassword) {
                    req.body.password = md5(req.body.password);
                    let obj = new db.User({ username: req.body.username, password: req.body.password, email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName });
                    obj.save((err, obj) => {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            res.json({status: 1, data: obj,message: "user successfully registered"});
                        }
                    });
                } else {
                    res.status(400).json({error:1, message: "please check your password"});
                }
            }
        }
    });
});
module.exports = router;