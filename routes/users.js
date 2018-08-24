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
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
})

passport.deserializeUser(function(id, done) {
    db.User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        db.User.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.password != md5(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));


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

router.post("/login", passport.authenticate('local', { failureRedirect: 'unsucces' }), (req, res) => {
    res.redirect('succes')
});

router.get("/get/:id", async(req, res) => {
    if (req.isAuthenticated()) {
        if (req.user._id == req.params.id) {
            let result = await data_provider.dataProvider(req.params.id);
            if (result instanceof Error) {
                res.status(400).json({ error: 1, message: "error", data: result });
            } else {
                res.status(200).json({ status: 1, message: "data retrived", data: result });
            }
        } else {
            res.status(400).json({ error: 1, message: "check your id" });
        }
    } else {
        req.status(400).json({ error: 1, message: "your session is not authenticated" });
    }

});

router.put("/delete", (req, res, next) => {
    if (req.isAuthenticated()) {
        db.User.findByIdAndRemove(req.user._id, function(err, obj) {
            if (err) {
                res.status(500).json({ error: 1, message: "error during deleting the element" });
            } else {
                res.status(200).json({ status: 1, data: obj, message: "deletion successfully" });
            }
        });
    } else {
        res.status(400).json({ error: 1, message: "your session is not authenticated" });
    }

});

router.get("/list/:page", (req, res) => {
    if (req.isAuthenticated()) {
        let page = req.params.page;
        let limit = 10;
        db.User.find().skip(page * limit).limit(limit).exec((err, items) => {
            if (err) {
                res.status(500).json({ error: 1, message: "server internal problem" });
            } else {
                res.status(200).json({ status: 1, data: items, message: "operation successfull" });
            }
        });
    } else {
        res.status(400).json({ error: 1, message: "your session is not authenticated" });
    }

});

router.post("/address", async(req, res) => {
    if (req.isAuthenticated()) {
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
    }
});

router.get('/succes', (req, res) => {
    console.log(req.user._id);
    res.status(200).json({ status: 1, message: "successfull login" });
});
router.get('/unsucces', (req, res) => {
    res.status(400).json({ error: 1, message: "unsucessfull login" });
});
module.exports = router;