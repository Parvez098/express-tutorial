var express = require('express');
var router = express.Router();
const db = require("../model/user");
const AccessToken = require("../model/access-token");
let md5 = require('md5');
const authentication = require("../middleware/authentication");
const AddressCollection = require("../model/address");
const DataValidation = require("../Data_validation/validation");
const data_provider = require("../data_provider/provider");
const jwt = require("jsonwebtoken");
const key = "imgroot";

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
    let username = req.body.username;
    let password = req.body.password;
    db.User.find({ username: username, password: md5(password) }, (err, obj) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (obj[0] != null) {

                const token = jwt.sign({ id: obj[0]._id }, key, { expiresIn: '1h' });
                res.status(200).json({ status: 1, message: "everything is ok and we ave created our token", token: token });
            } else {
                res.status(500).json({ error: 1, message: "there is no user whose credentials matched in a data base" });
            }
        }
    });
});

router.get("/get/:id", [authentication.validateToken, authentication.validateId], async(req, res) => {
    let result = await data_provider.dataProvider(req.params.id);
    if (result instanceof Error) {
        res.status(400).json({ error: 1, message: "error", data: result });
    } else {
        res.status(200).json({ status: 1, message: "data retrived", data: result });
    }
});

router.put("/delete", authentication.validateToken, (req, res, next) => {
    let id = req.id;
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

router.post("/address", authentication.validateToken, async(req, res) => {

    let result = await DataValidation.dataValidation(req.checkBody, req.validationErrors, req.body);
    if (result instanceof Error) {
        result = result.message;
        res.status(400).json({ error: 1, message: "exception occure", data: result });
    } else {
        result['user_id'] = req.id;
        let obj = new AddressCollection(result);
        obj.save((err, obj) => {
            if (err) {
                res.status(500).json({ error: 1, message: "server internal problem" });
            } else {
                res.status(200).json({ status: 1, message: "ok", date: obj });
            }
        });

    }
});




router.get("/example", (req, res) => {
    res.json({ token: jwt.sign({ name: "parvez" }, 'EXAMPLE') });
});


router.get("/tokencheck", (req, res) => {
    console.log(req.headers.name);
});


module.exports = router;