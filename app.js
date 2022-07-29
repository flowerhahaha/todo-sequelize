// packages and variables
const express = require('express')
const methodOverride = require('method-override')
const exphbs = require('express-handlebars')
const bcrypt = require('bcryptjs')
const app = express()
const PORT = 3000
const { Todo, User } = require('./models')

// template engine: handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// middleware: static files, body-parser, method-override, session
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// router: get homepage
app.get('/', (req, res) => {
  Todo.findAll({
    raw: true,
    nest: true
  })
    .then((todos) => { return res.render('index', { todos }) })
    .catch((error) => { return res.status(422).json(error) })
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => {
      console.log(todo.toJSON())
      console.log(todo)
      console.log(typeof todo.toJSON())
      res.render('detail', { todo: todo.toJSON() })
    })
    .catch(error => console.log(error))
})

// router: get login page
app.get('/users/login', (req, res) => {
  res.render('login')
})

// router: post login information
app.post('/users/login', (req, res) => {
  res.send('login')
})

// router: get register page
app.get('/users/register', (req, res) => {
  res.render('register')
})

// router: post register information
app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.create({ name, email, password })
    .then(user => {
      console.log(user)
      res.redirect('/')
    })
})

// router: logout
app.get('/users/logout', (req, res) => {
  res.send('logout')
})

// start and listen on the express server
app.listen(3000, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})