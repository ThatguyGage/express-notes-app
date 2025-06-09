const express = require('express')
const Note = require('../models/Note')

const router = express.Router()

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.status(401).json({ message: 'Unauthorized' })
}

// GET /api/notes - Return user's notes as JSON
router.get('/api/notes', isLoggedIn, async (req, res) => {
  const notes = await Note.find({ owner: req.user.id })
  res.json(notes)
})

// POST /api/notes - Create a note via API
router.post('/api/notes', isLoggedIn, async (req, res) => {
  const { title, content, category } = req.body
  const note = await Note.create({
    title,
    content,
    category,
    owner: req.user.id
  })
  res.status(201).json(note)
})

module.exports = router
