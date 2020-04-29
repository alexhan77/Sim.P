const router = require('express').Router()
const db = require('../models')

router.get('/', (req, res) => {
    db.faves.findAll()
    .then(favPics => {
        res.render('faves/results', { favPics })
    })
    .catch(err => {
        console.log('Error')
        res.send('uh oh!')
    })
})

router.post('/results', (req, res) => {
    console.log('YOOOOOOOOO!!!', req.body)
    db.faves.create(req.body)
    .then(newFav => {
        console.log('Success!')
        // res.send(req.body.title)
        res.redirect('/faves')
    })
    .catch(err => {
        console.log('Error:', err)
        res.send('Uh oh!')
    })
})

module.exports = router