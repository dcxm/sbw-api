const router = require('express').Router()
const bcrypt = require('bcryptjs')

const authorize = require('../middleware/authorize')
const { authenticate } = require('../passportAuth')

const User = require('../models/User')

router.get('/', authorize, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id }).select('-password -items').exec()
        if (user) return res.status(200).json(user)
        return res.status(404).json({ error: 'User not found' })
    } catch (err) {
        if (err) return res.json({ error: err })
    }
})

router.post('/login', (req, res, next) => {
    if (req.user) {
        res.json({ error: 'User already logged in' })
    } else authenticate(req, res, next)
})

router.post('/signup', (req, res) => {
    if (!req.user) {
        const saveUser = (hashedPassword) => {
            new User({
                email: req.body.email,
                password: hashedPassword
            }).save((err, createdUser) => {
                if (err) console.log(err)
                res.status(200).json(createdUser)
            })
        }
        User.findOne({ email: req.body.email }, async (err, user) => {
            if (user) return res.status(403).json({ error: 'There is already a user with this email address' })
            try {
                const hash = await bcrypt.hash(req.body.password, 10)
                if (!hash) return res.status(400).json({ error: 'Please provide both an email and a password' })
                saveUser(hash)
            } catch (err) {
                if (err) return res.status(500).json({ error: 'Data could not be saved, please try again' })
            }
        })
    } else {
        res.json({ error: 'Already logged in' })
    }
})

module.exports = router