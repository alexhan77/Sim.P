// Node Modules/Variables
let router = require('express').Router()
let db = require('../models')
let passport = require('../config/passportConfig')

// Routes 
// GET /auth/login - this is a page that renders the login form
router.get('/login', (req, res) => {
    res.render('auth/login')
})

// POST /auth/login - this is a place for the logn form to post to 
router.post('/login', passport.authenticate('local', {
    successFlash: 'Successful Login - Welcome Back User!',
    successRedirect: '/profile/user',
    failureFlash: 'Invalid Credentials',
    failureRedirect: '/auth/login'
}))

// GET /auth/signup - this is a page that renders the signup form
router.get('/signup', (req, res) => {
    res.render('auth/signup', { data: {} })
})

// POST /auth/signup
router.post('/signup', (req, res, next) => {
    
    if (req.body.password != req.body.password_verify) {
        // Send a message on why things didn't work
        req.flash('error', 'Passwords do not match')

        //Put the user back on to the signUp form to try again
        res.render('auth/signup', { data: req.body, alerts: req.flash() })
    }
    else {
        // Passwords matched, now we'll find/create by the user's email
        db.user.findOrCreate({
            where: { email: req.body.email },
            defaults: req.body
        })
        .then(([user, wasCreated]) => {
            if (wasCreated) {
                // Good -this was expected, they are a properly new user
                // AUTO-LOGIN with passport
                passport.authenticate('local', {
                    successFlash: 'Successful Login - Welcome Back!',
                    successRedirect: '/profile/user',
                    failureFlash: 'Invalid Credentials',
                    failureRedirect: '/auth/login'
                })(req, res, next)
            }
            else {
                // Bad -This person actually already had an account under that email (redirect to login page)
                req.flash('error', 'Account already exists!')
                res.redirect('auth/login')
            }
        })
        .catch(err => {
            // Print the whole error to the terminal
            console.log('Error creating a user', err)

            // Check for Sequelize Validation errors (TODO: and make flash messages for them)
            if (err.errors) {
                err.errors.forEach(e => {
                    if (e.type == 'Validation error') {
                        req.flash('error', e.message)
                    }
                })
                // Put the user back onto the signup form to try again
                res.render('auth/signup', { data: req.body, alerts: req.flash() })
            }
            else {
                // Genereic message for any other issue
                req.flash('error', 'Server error')
            }

            // Redirect back to sign up
            res.redirect('/auth/signup')
        })
    }
})

router.get ('/logout', (req, res) => {
    // Remove user data from the session
    req.logout()

    // Tell them they've logged out and redirects to another page (the home page)
    req.flash('success', 'Bye Bye! U simp 🤡')
    res.redirect('/')
})

// Export (allow me to include this in another page)
module.exports = router