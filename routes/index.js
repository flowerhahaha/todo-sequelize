const router = require('express').Router()

const home = require('./modules/home')
const todos = require('./modules/todos')
const users = require('./modules/users')

router.use('/todos', todos)
router.use('/users', users)
router.use('/', home)

// error handling: 404 not found
router.get('*', (req, res) => {
  const errMessage = 'The requested URL was not found on this server.'
  res.status(404).render('error', { errMessage })
})

// error handling: catch error from server side
router.use((err, req, res, next) => {
  const errMessage = 'Sorry! Server is broken. We will fix it soon.'
  console.log(err)
  res.status(500).render('error', { errMessage })
})

module.exports = router