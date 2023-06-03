// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 8080;
const app = express();


app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));
app.use(cookieParser());

// Separated Routes for each Resource
const eventsRoutes = require('./routes/events');
const loginRoutes = require('./routes/login');
const userEventsRoutes = require('./routes/user-events');

// Mount all resource routes
app.use('/api/events', eventsRoutes);
app.use('/login', loginRoutes)
app.use('/api/user-events', userEventsRoutes);

// Home page
app.get('/', (req, res) => {
  res.render('index');
  console.log('Cookies: ', req.cookies);
});

//logout here
app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  // res.status(200).send("logged-out");
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
