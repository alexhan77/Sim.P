/****************
 * NODE MODULES
 ****************/
// Add in environment 
require('dotenv').config()
//fillout barebones statement 

let express = require('express')
let flash = require('connect-flash')
let layouts = require('express-ejs-layouts')
let session = require('express-session')
let cloudinary = require('cloudinary')
let multer = require('multer')
let upload = multer({dest: './uploads/'})
let methodOverride = require('method-override')

//Create an express instance
let app = express();

// Include passport (via the passport config file)
let passport = require('./config/passportConfig')

/**********************
 * SETTINGS / MIDDLEWARE
 **********************/

//set template lang to ejs 
app.set('view engine', 'ejs')

//tell express to use the layout modules
app.use(layouts)

//set up static folder
app.use(express.static('static'))

// decrypt the variables coming in via POST routes (from forms)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride("_method"))
// Set up sessions 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

// Set up connect-flash for the flash alert messages (depends on session, order matters here)
app.use(flash())

// Set up passport (depends on session; must come after it)
app.use(passport.initialize())
app.use(passport.session())

// Custom middleware - make certain variables available to EJS pages through locals
app.use((req, res, next) => {
    res.locals.alerts = req.flash()
    res.locals.user = req.user
    next()
})
//setting up multer and upload
//Im almost certain this sholld go in the controllers for logistics along with lines 12 and 13
app.post('/', upload.single('myFile'), (req, res) => {
    res.send(req.file)
})

/*****************************
 * ROUTES
 *****************************/

//Controllers
app.use('/auth', require('./controllers/auth'))
app.use('/profile', require('./controllers/profile'))
app.use('/feed', require('./controllers/feed'))
app.use('/faves', require('./controllers/faves'))

//create a home route
app.get('/', (req, res) => {
    res.render('home')
})

 //create a wild card route (catch-all)
app.get('*', (req, res) => {
    res.render('error')
})

/******************
 * LISTEN
 ******************/

//Pick a port to listen on 
app.listen(process.env.PORT || 3000)