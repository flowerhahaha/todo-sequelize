const router = require('express').Router()
const { Todo } = require('../../models')

// router: get detail page
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => {
      res.render('detail', { todo: todo.toJSON() })
    })
    .catch(error => console.log(error))
})

module.exports = router