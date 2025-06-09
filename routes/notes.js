const express = require('express')
const Note = require('../models/Note')

const router = express.Router()

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/')
}

router.get('/notes', isLoggedIn, async (req, res) => {
  const { category, sort, error } = req.query
  const filter = { owner: req.user.id }

  if (category) filter.category = category

  let sortOption = {}
  if (sort === 'titleAsc') sortOption = { title: 1 }
  else if (sort === 'titleDesc') sortOption = { title: -1 }
  else if (sort === 'categoryAsc') sortOption = { category: 1 }
  else if (sort === 'categoryDesc') sortOption = { category: -1 }

  const notes = await Note.find(filter).sort(sortOption)
  const allNotes = await Note.find({ owner: req.user.id })
  const categories = [...new Set(allNotes.map(n => n.category).filter(Boolean))]

  res.render('notes', {
    user: req.user,
    notes,
    selectedCategory: category || '',
    sort: sort || '',
    categories,
    error: error || '' // ✅ guarantees error is always defined
  })
})

router.post('/notes', isLoggedIn, async (req, res) => {
  const { title, content, category } = req.body

  if (!title.trim() || !content.trim()) {
    return res.redirect('/notes?error=Title and content are required.')
  }

  await Note.create({
    title: title.trim(),
    content: content.trim(),
    category: category.trim(),
    owner: req.user.id
  })

  res.redirect('/notes')
})

router.get('/notes/:id/edit', isLoggedIn, async (req, res) => {
  const note = await Note.findById(req.params.id)
  if (!note || note.owner.toString() !== req.user.id) return res.redirect('/notes')
  res.render('edit', { note })
})

router.post('/notes/update/:id', isLoggedIn, async (req, res) => {
  const { title, content, category } = req.body

  if (!title.trim() || !content.trim()) {
    return res.redirect(`/notes/${req.params.id}/edit?error=Title and content are required.`)
  }

  await Note.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    {
      title: title.trim(),
      content: content.trim(),
      category: category.trim()
    }
  )

  res.redirect('/notes')
})

router.post('/notes/delete/:id', isLoggedIn, async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, owner: req.user.id })
  res.redirect('/notes')
})

module.exports = router
