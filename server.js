require('dotenv').config()
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const passport = require('passport')
require('./dbConnect')()

require('./passportAuth').passportAuth()

const app = express()

// middleware
app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(passport.initialize())
app.use(passport.session())

// routes
app.use('/users', require('./routes/users.js'))
app.use('/items', require('./routes/items.js'))
app.use('/tags', require('./routes/tags.js'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))