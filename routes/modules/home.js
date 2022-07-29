const router = require('express').Router()
const { Todo } = require('../../models')

// router: get homepage
router.get('/', (req, res) => {
  Todo.findAll({
    raw: true,
    nest: true
  })
    .then((todos) => { return res.render('index', { todos }) })
    .catch((error) => { return res.status(422).json(error) })
})

module.exports = router