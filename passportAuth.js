const passport = require('passport')
const bcrypt = require('bcryptjs')

const LocalStrategy = require('passport-local').Strategy

const User = require('./models/User')

function passportAuth() {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {
        User.findOne({ email }).select('-collections -items -createdAt -updatedAt -_v').exec((err, user) => {
            console.log(user)
            if (err) return done(err, false)
            if (!user) return done(null, false)
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) return done(null, false)
                if (!result) return done(null, false)
                return done(null, user)
            })
        })
    }
    ))

    passport.serializeUser((user, callback) => {
        callback(null, user.id)
    })
    passport.deserializeUser((id, callback) => {
        User.findOne({ _id: id }).select('-password').exec((err, user) => {
            callback(err, user)
        })
    })
}

function authenticate(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        console.log(user)
        if (err) return next(err)
        if (!user) return res.json({ error: 'No user with this credentials' })
        req.logIn(user, function (err) {
            if (err) return next(err)
            return res.json(user)
        });
    })(req, res, next)
}

module.exports = {
    authenticate,
    passportAuth
}