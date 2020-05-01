let router = require('express').Router()
let db = require('../models')
router.use(require('express').static('static'))

router.get('/post', (req, res) => {
    res.render('feed/post')
})

// Route visits the feed 
router.get('/', (req, res) => {
    db.feed.findAll({
        include: [db.user],

    })
        .then(feed => {
            console.log(feed.users)
            res.render('feed/index', { feed })
        })
})

router.post('/post', (req, res) => {
    console.log(req.body)
    db.feed.create(req.body)
        .then(func => {
            res.redirect('/feed')
        })

})


module.exports = router