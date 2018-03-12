const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
require('dotenv').config();

// APP

const app = express();

// CONSTANTS

const PORT = 8070;
const {
    URI,
    DBNAME,
    SECRET,
    AUTH_DOMAIN,
    AUTH_CLIENT_ID,
    AUTH_CLIENT_SECRET,
    CALLBACK_URL,
    SUCCESS_REDIRECT,
    FAILURE_REDIRECT
} = process.env;

// TOP LEVEL MIDDLEWARE

app.use(bodyParser.json());

// MONGODB CONNECTION

// DATABASE
let db;
// COLLECTIONS
const coll = {
    organisations: 'resume-organisations',
    users: 'resume-users',
    memberships: 'resume-memberships',
    resumes: 'resume-resumes',
    comments: 'resume-comments'
};
// CONNECTION
MongoClient.connect(URI, function (err, client) {
    assert.equal(null, err);
    console.log(`${DBNAME} connected to server`);

    db = client.db(DBNAME);
    // console.log("DB: ");
    // console.log(db);
    // console.log("CLIENT: ");
    // console.log(client);

    app.listen(PORT, () => console.log(`Resume Review listening on port ${PORT}`));
    // client.close();
});

// SESSION

app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true
}))

// AUTH0 CONNECTION

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
    domain: AUTH_DOMAIN,
    clientID: AUTH_CLIENT_ID,
    clientSecret: AUTH_CLIENT_SECRET,
    callbackURL: CALLBACK_URL
}, function (accessToken, refreshToken, extraParams, profile, done) {
    db.collection(coll.users).find({ id: profile.id }).toArray((err, results) => {
        console.log(results);
        if (!results.length) {
            console.log("ADDING")
            db.collection(coll.users).save(profile).then(console.log)
        }
        else {
            console.log("FOUND")
            return done(null, profile.id);
        }
        // console.log(profile);
    });
}));

// AUTH0 ENDPOINTS

app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: SUCCESS_REDIRECT,
    failureRedirect: FAILURE_REDIRECT
}));

passport.serializeUser(function (id, done) {
    return done(null, id);
});
passport.deserializeUser(function (id, done) {
    return done(null, id)
})

// MY ENDPOINTS HERE

app.post('/individual', (req, res) => {
    db.collection(coll.users).save(req.body, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json(`failure adding ${req.body.name} to db`);
        }
        else {
            console.log(`saved ${req.body.name} to db`);
            res.status(200).send(req.body);
        }
    });
});
app.get('/individual', (req, res) => {
    db.collection(coll.users).find().toArray((err, results) => {
        console.log(err);
        console.log(results);
        if (err) {
            console.log(err);
            res.status(500).json(`failure finding ${req.body.name}`);
        }
        else {
            console.log(results);
            res.status(200).send(results);
        }
    });
});
app.get('/individual/:name', (req, res) => {
    db.collection(coll.users).find({ name: req.params.name }).toArray((err, user) => {
        res.status(200).send(user)
    });
});
