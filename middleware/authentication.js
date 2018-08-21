const db = require("../model/user");
const AccessToken = require("../model/access-token");
const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

module.exports.requiredToken = (req, res, next) => {
    let token = req.headers.access_token;
    db.User.findById(token, (err, obj) => {
        if (err) {
            res.status(500).json({ error: 1, message: "server internal problem" });
        } else {
            if (obj == null) {
                res.status(400).json({ error: 1, message: "there is no object that matched with access_token" });
            } else {
                req.obj = obj;
                next();
            }
        }
    });
}


module.exports.validateToken = (req, res, next) => {
    let token = req.headers.token;
    AccessToken.findOne({ access_token: token, expiry: { $gte: (new Date()).getTime() } }, (err, obj) => {

        if (err) {
            res.status(500).json({ error: 1, message: "server internal problem" });
        } else {
            if (obj == null) {
                res.status(400).json({ error: 1, message: "your token is expired" });
            } else {
                req.obj = obj;
                next();
            }

        }

    });
}


module.exports.dataValidation = (req, res, next) => {
    req.checkBody('city').notEmpty().withMessage("required city").len(2, 10).withMessage("city length must be in 2 to 10 character");
    req.checkBody('state').notEmpty().withMessage("required state").len(2, 10);
    req.checkBody("phone_no").notEmpty().withMessage("phone number can't be empty").len(10).withMessage("");
    req.checkBody('pin_code').notEmpty().withMessage("please type your pin code");
    req.checkBody("address").notEmpty().withMessage("please type your address");
    if (req.validationErrors();) {
        res.status(400).json({ error: 1, data: body, errors: errors, msg: "bakwas" });
    } else {
        next();
    }
}