const router = require('express').Router()
const db = require('../models')
router.use(require('express').static('static'))

router.get('/', (req, res) => {
    db.faves.findAll({
        include: [db.feed,db.user],

    })
    .then(favPics => {
        // console.log(user.id)
        res.render('faves/results', { favPics })
    })
    .catch(err => {
        console.log('Error', err)
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

router.delete('/results/:id', (req, res)=> {
    console.log('Yo', req.params.id)
    db.faves.destroy({
        where: {id: req.params.id}
    })
    .then(() => {
        res.redirect('/faves')
    })
    .catch(err=> {
        console.log('Error in delete', err)
        res.render('error')
    })
})

module.exports = router