const express = require('express')
const session = require('express-session')
const passport = require('passport')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
var bodyParser = require('body-parser')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const isAuth = require('./middlewares/isAuth')


const app = express()

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// .env config
dotenv.config() 

// DB Config
const db = process.env.MONGO_URI   

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }) 
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser());

// Static directory
app.use(express.static('public'))

// Middleware to parse JSON bodies
app.use(express.json());

app.set('view engine', 'ejs')

// Define a custom token to log the request body
morgan.token('body', (req) => {
    return JSON.stringify(req.body) || '-';
});

morgan.token('response-body', (req, res) => {
  return res.body || '-';
});

morgan.format('custom', ':date[iso] :method :url :status :response-time ms :total-time ms - :res[content-length] :body :remote-addr :user-agent')
app.use(morgan('custom'))

// Routes
app.use('/tracking', require('./routes/trackings'))
app.use('/auth', require('./routes/auth'))
app.use('/notifications', require('./routes/notifications'))
app.use('/payments', require('./routes/payments'))

app.get('/protected', isAuth, (req, res) => {
  // console.log(req.user)
  res.send(`Bonjour ${req.user.displayName}`)
});

app.get('/logout', (req, res) => {

  req.logout(function(err) {
      if (err) { return next(err); }
      req.session.destroy()
      res.send('Goodbye!')
  });
})

app.disable('x-powered-by');
// Set custom headers
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
});

const PORT = process.env.PORT || 8000

app.listen(PORT, console.log(`Server started on port ${PORT} `)) 