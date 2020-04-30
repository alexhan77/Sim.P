let router = require('express').Router()
let moment = require('moment')
let adminLogin = require('../middleware/adminLogin')
let userLogin = require('../middleware/userLogin')
let db = require('../models')

// Custom middleware that is ONLY applied to the routes in this file!
router.use(userLogin)

// GET /profile/user - a normal profile for the plebs
// NOTE: Protect this route from users who are not logged in
router.get('/user', (req, res) => {
    console.log('user page')
    res.render('profile/user', { moment })
})

// GET /profile/guest/userID - viewing a user's profile as a guest
router.get('/guest/:id', (req, res) => {
    db.user.findByPk(req.params.id)
    .then(userProfile => {
        res.render('profile/guest', { moment, userProfile })
    })
    .catch(err => {
        res.render('error', err)
    })
})

// GET /profile/admin - a special profile admins
// NOTE: Protect this route from users who are not logged in AND users who are NOT admins
router.get('/admin', adminLogin, (req, res) => {
    db.user.findAll()
    .then(user => {
        res.render('profile/admin', { moment, users })
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })
})

// PUT ROUTES -editting the profile page
router.put('/:id', (req, res) => {
    console.log('REQUEST BODY', req.body)
    db.user.update(
        req.body,
        { where: { id: req.params.id } }
    )
    .then(() => {
        res.redirect('/user/' + req.params.id)
    })
    .catch(err => {
        console.log(err)
        res.render('error')
    })
})

module.exports  = router