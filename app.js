// packages and variables
const express = require('express')
const methodOverride = require('method-override')
const exphbs = require('express-handlebars')
const bcrypt = require('bcryptjs')
const app = express()
const PORT = 3000

// template engine: handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// middleware: static files, body-parser, method-override, session
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// router: get homepage
app.get('/', (req, res) => {
  res.render('index')
})

// start and listen on the express server
app.listen(3000, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})