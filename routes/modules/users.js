const router = require('express').Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { User } = require('../../models')

// router: get login page
router.get('/login', (req, res) => {
  res.render('login')
})

// router: post login information
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// router: get register page
router.get('/register', (req, res) => {
  res.render('register')
})

// router: post register information
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    // check if the register info is valid
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: 'All fields are required.' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: 'The password confirmation does not match.' })
    }
    if (errors.length) {
      return res.render('register', { errors, name, email, password })
    }
    // check if the email already exists
    const user = await User.findOne({ where: { email } })
    if (user) {
      errors.push({ message: 'User already exists' })
      return res.render('register', { errors, name, email, password })
    }
    // else store the user register information
    await User.create({ name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) })
    req.flash('success_msg', 'Register successfully! Please login to your account.')
    res.redirect('/users/login')
  } catch (e) {
    console.log(e)
    next(e)
  }
})

// router: logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err)
    req.flash('success_msg', 'You have successfully logged out.')
    res.redirect('/users/login')
  })
})

module.exports = router