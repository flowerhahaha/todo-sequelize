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

// router: get detail page
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    .then(todo => {
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
app.post('/users/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'All fields are required.' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'The password confirmation does not match' })
  }
  if (errors.length) {
    return res.render('register', { errors, name, email, password })
  }
  try {
    // check if the email already exists
    const user = await User.findOne({ where: { email } })
    if (user) {
      errors.push({ message: 'User already exists' })
      return res.render('register', { errors, name, email, password })
    }
    // else store the user register information
    await User.create({ name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) })
    // req.flash('success_msg', 'Register successfully! Please login to your account')
    res.redirect('/users/login')
  } catch (e) {
    console.log(e)
    // next(e)
  }
})

// router: logout
app.get('/users/logout', (req, res) => {
  res.send('logout')
})

// start and listen on the express server
app.listen(3000, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})