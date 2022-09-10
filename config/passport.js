const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
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

  // login with facebook
  passport.use(new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['email', 'displayName']
    }, 
    async (accessToken, refreshToken, profile, done) => {
      const { name, email } = profile._json
      try {
        // if the user doesn't exist, generate a random password and store the user data first
        let user = await User.findOne({ where: { email } })
        if (!user) {
          const randomPassword = Math.random().toString(36).slice(-8)
          user = await User.create({ name, email, password: bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(10), null) })
        }
        // log in to the homepage
        return done(null, user)
      } catch (err) {
        return done(err, false)
      }
    }
  ))
  // passport.use(new FacebookStrategy({
  //   clientID: process.env.FACEBOOK_ID,
  //   clientSecret: process.env.FACEBOOK_SECRET,
  //   callbackURL: process.env.FACEBOOK_CALLBACK,
  //   profileFields: ['email', 'displayName']
  // },
  // (accessToken, refreshToken, profile, done) => {
  //   const { name, email } = profile._json
  //   User.findOne({ where: { email } })
  //     .then(user => {
  //       if (user) return done(null, user)

  //       const randomPassword = Math.random().toString(36).slice(-8)
  //       bcrypt
  //         .genSalt(10)
  //         .then(salt => bcrypt.hash(randomPassword, salt))
  //         .then(hash => User.create({
  //           name,
  //           email,
  //           password: hash
  //         }))
  //         .then(user => done(null, user))
  //         .catch(err => done(err, false))
  //     })
  //   }
  // ))

  // store user id in session while login
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // store user data in req object if the user already logged in
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        user = user.toJSON()
        done(null, user)
      })
      .catch(err => done(err, null))
  })
}