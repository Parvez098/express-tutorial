const db = require("../model/user");

module.exports = function() {

    return (req, res, next) => {
        db.User.findById(req.headers.access_token, (err, obj) => {
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
}