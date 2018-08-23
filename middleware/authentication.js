const db = require("../model/user");
const AccessToken = require("../model/access-token");
const jwt = require("jsonwebtoken");
const key = "imgroot";

module.exports.validateToken = (req, res, next) => {
    let token = req.headers.token;

    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            res.status(400).json({ error: 1, message: err.message });
        } else {
            db.User.findById(decoded.id, (err, obj) => {
                if (err) {
                    res.status(400).json({ error: 1, message: "there is problem in finding the object in validate token method" });
                } else {
                    req.id = decoded.id;
                    next();
                }
            });
        }
    });
}