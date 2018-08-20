const db = require("../model/user");
const AccessToken = require("../model/access-token");
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
    AccessToken.find({ access_token: token }, (err, obj) => {

        if (err) {
            res.status(500).json({ error: 1, message: "server internal problem" });
        } else {
            let time = (new Date()).getTime();
            if (time <= obj[0].expiry); {
                req.obj = obj[0];
                next();
            }
        }
    });
}