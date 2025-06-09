const express = require('express')
const session = require('express-session')
const passport = require('passport')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()
console.log('Client ID:', process.env.GOOGLE_CLIENT_ID)

require('./config/passport')

const app = express()

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB')
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err)
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'html'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('./routes/auth'))
app.use('/', require('./routes/notes'))
app.use('/', require('./routes/api'))

app.get('/', (req, res) => {
  res.render('login', { user: req.user })
})

app.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard', { user: req.user })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}


if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Visit http://localhost:${PORT} to see the app`)
  })
}

module.exports = app
