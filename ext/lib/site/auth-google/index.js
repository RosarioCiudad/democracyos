const passport = require('passport')
const express = require('express')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('lib/models').User
const utils = require('lib/utils')
const config = require('lib/config')
const jwt = require('lib/jwt')
/*const removeRoute = require('./remove-route')*/

const app = module.exports = express()

function assignProfile (user, profile, accessToken, fn) {
  try {
    user.set('profiles.twitter', profile._json)
    user.set('emailValidated', true)

    if (profile._json.given_name) {
      user.set('firstName', profile._json.given_name)
    }

    if (profile._json.amily_name) {
      user.set('lastName', profile._json.amily_name)
    }

    if (profile._json.email) {
      user.set('email', profile._json.email)
    }

    user.save(fn)
  } catch (err) {
    console.error(err)
    return fn(new Error('Error al guardar usuario de Google.'), user)
  }
}

const callbackURL = utils.buildUrl(config, {
  pathname: '/auth/google/confirm/authorize'
})

const strategy = new GoogleStrategy({
  clientID: "451817293155-ten4jn5acprgpimtgukg6rmbira67kcc.apps.googleusercontent.com",
  clientSecret: "mYTTqf6E-Jk0jPm8VdNQEVhR",
  callbackURL: callbackURL,
  profileFields: ['id', 'displayName', 'first_name', 'last_name', 'email'],
  enableProof: false
}, function (accessToken, refreshToken, profile, done) {
  /*console.log(profile)
  done(null, new User({
    emailValidated: true,
    firstName: profile._json.first_name,
    lastName: profile._json.last_name,
  }))*/
 User.findByProvider({ provider: 'google', id: profile.id }, function (err, user) {
      if (err) return done(err)

      var email = profile._json.email

      if (!user) {
        if (email) {
          User.findByEmail(email, function (err, userWithEmail) {
            if (err) return done(err)

            if (userWithEmail) {
              assignProfile(userWithEmail, profile, accessToken, done)
            } else {
              assignProfile(new User(), profile, accessToken, done)
            }
          })
        } else {
          assignProfile(new User(), profile, accessToken, done)
        }

        return
      }

      if (user.email !== email) {
        user.set('email', email)
      }

      if (user.profiles.twitter.deauthorized) {
        user.set('profiles.twitter.deauthorized')
      }

      user.isModified() ? user.save(done) : done(null, user)
    })
})

strategy.name = 'google'

passport.use(strategy)

app.get('/auth/google/confirm',
  passport.authenticate('google', {
    scope: ['email','profile'],
    failureRedirect: '/signin'
  })
)

app.get('/auth/google/confirm/authorize',
  passport.authenticate('google', {scope: ['email','profile'], failureRedirect: '/signin' }),
  function (req, res, next) {
    res.locals.initialState.authGoogleConfirmUser = {
      displayName: req.user.displayName,
      avatar: req.user.picture
    }
    /*next()*/
    jwt.setUserOnCookie(req.user, res)
    return res.redirect('/presupuesto')
  },
  require('lib/site/layout')

)
