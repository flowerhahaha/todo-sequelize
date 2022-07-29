const router = require('express').Router()
const { Todo } = require('../../models')

// get new page
router.get('/new', (req, res) => {
  res.render('new')
})

// post a new todo
router.post('/', (req, res) => {
  const UserId = req.user.id
  const name = req.body.name
  Todo.create({ name, UserId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// get detail page
router.get('/:id', (req, res) => {
  const id = req.params.id
  Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// get edit todo page
router.get('/:id/edit', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  Todo.findOne({ where: { id, UserId } })
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// put edited todo
router.put('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body
  Todo.findOne({ where: { id, UserId } })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})

module.exports = router