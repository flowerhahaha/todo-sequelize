const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { User } = require('../models')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  // login with email and password
  passport.use(new LocalStrategy(
    { 
      usernameField: 'email',
      passReqToCallback: true
    }, 
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } })
        // if the email doesn't exist, return false and redirect to login page
        if (!user) {
          return done(null, false, req.flash('warning_msg', 'Incorrect username or password.'))
        }
        // if the password is incorrect, return false and redirect to login page
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          return done(null, false, req.flash('warning_msg', 'Incorrect username or password.'))
        }
        // else return user and redirect to home page
        return done(null, user)
      } catch (err) {
        done(err, false)
      }
    }
  ))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        user = user.toJSON()
        done(null, user)
      })
      .catch(err => done(err, null))
  })
}