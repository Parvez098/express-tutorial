const db = require("../model/user");
const AccessToken = require("../model/access-token");
const jwt = require("jsonwebtoken");
const key = "imgroot";
module.exports.requiredToken = (req, res, next) => {
    let token = req.headers.access_token;
    db.User.findById(token, (err, obj) => {
        if (err) {
            res.status(500).json({ error: 1, message: "your token is expired you need to login again" });
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

    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            res.status(400).json({ error: 1, message: "internal problem in token" });
        } else {
            req.id = decoded.id;
            next();
        }
    })

}

module.exports.validateId = (req, res, next) => {
    if (req.id == req.params.id) {
        next();
    } else {
        res.status(400).json({ error: 1, message: "authentication problem with id" });
    }
}