document.addEventListener('DOMContentLoaded', () => {
  const darkToggle = document.getElementById('darkToggle')

  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark')
  }

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark')
      if (document.body.classList.contains('dark')) {
        localStorage.setItem('darkMode', 'enabled')
      } else {
        localStorage.removeItem('darkMode')
      }
    })
  }

  document.querySelectorAll('.delete-form').forEach(form => {
    form.addEventListener('submit', e => {
      if (!confirm('Are you sure you want to delete this note?')) {
        e.preventDefault()
      }
    })
  })

  const searchInput = document.getElementById('search')
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const val = searchInput.value.toLowerCase()
      document.querySelectorAll('.note-entry').forEach(entry => {
        const match = entry.innerText.toLowerCase().includes(val)
        entry.style.display = match ? '' : 'none'
      })
    })
  }
})
