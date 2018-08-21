var express = require('express');
var router = express.Router();
const db = require("../model/user");
const AccessToken = require("../model/access-token");
let md5 = require('md5');
const authentication = require("../middleware/authentication");
const AddressCollection = require("../model/address");

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
                let id = obj[0]._id;
                let miliSecond = 60 * 60 * 1000;
                let token = md5(new Date());
                let expiry_time = new Date().getTime() + miliSecond;
                let timeToken = new AccessToken({ user_id: id, access_token: token, expiry: expiry_time });

                timeToken.save((err, obj) => {

                    if (err) {
                        res.status(500).json({ error: 1, message: "error during saving the token" });
                    } else {
                        res.status(200).json({ status: 1, message: "everything is ok user saved and we have created our token", token: token });
                    }
                });

            } else {
                res.status(500).json({ error: 1, message: "there is no user whose credentials matched in a data base" });
            }
        }
    });
});

router.get("/get", authentication.validateToken, (req, res, next) => {
    res.status(200).json({ status: 1, data: req.obj, message: "successfully operation" });
});

router.put("/delete", authentication.validateToken, (req, res, next) => {
    let id = req.obj._id;
    db.User.findByIdAndRemove(id, function(err, obj) {
        if (err) {
            res.status(500).json({ error: 1, message: "error during deleting the element" });
        } else {
            res.status(200).json({ status: 1, data: obj, message: "deletion successfully" });
        }
    });
});

router.get("/list/:page", (req, res) => {
    let page = req.params.page;
    let limit = 10;

    db.User.find().skip(page * limit).limit(limit).exec((err, items) => {
        if (err) {
            res.status(500).json({ error: 1, message: "server internal problem" });
        } else {
            res.status(200).json({ status: 1, data: items, message: "operation successfull" });
        }
    });
});


module.exports = router;