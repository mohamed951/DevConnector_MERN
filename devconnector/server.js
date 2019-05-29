const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

//Routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

//middlewares
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(db, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log("Database Connected")
    })
    .catch((err) => {
        console.log(`Database Error ${err}`)
    })


// Passport middleware
app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server Run")
})