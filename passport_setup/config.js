const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../model/user");
const md5 = require('md5');

passport.serializeUser((user,done)=>{
	done(null,user);
});
passport.deserializeUser((user,done)=>{
	done(null,user);
});

passport.use(new LocalStrategy((username, password, done) => {
    db.User.findOne({ username: username, password:md5(password) }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    });
}));