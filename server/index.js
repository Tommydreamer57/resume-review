const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
require('dotenv').config();

// CONTROLLERS

const ic = require('./controllers/individuals');
const oc = require('./controllers/organisations');
const mc = require('./controllers/memberships');

// APP

const app = express();

// TOP LEVEL MIDDLEWARE

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(`${__dirname}/../dist`));
app.use(express.static(`${__dirname}/../dist/index.html`));

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

// MONGODB CONNECTION

// COLLECTION
const COLL = 'resume-review-individuals';
let db;

// CONNECTION
MongoClient.connect(URI, function (err, client) {
    assert.equal(null, err);
    db = client.db(DBNAME);
    app.set('db', db);
    console.log(`${DBNAME} connected to server`);
    app.listen(PORT, () => console.log(`Resume Review listening on port ${PORT}`));
});

// SESSION

app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true
}));

// AUTH0

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
    domain: AUTH_DOMAIN,
    clientID: AUTH_CLIENT_ID,
    clientSecret: AUTH_CLIENT_SECRET,
    callbackURL: CALLBACK_URL
}, function (accessToken, refreshToken, extraParams, profile, done) {
    db.collection(COLL).find({ id: profile.id }).toArray((err, results) => {
        // console.log(results);
        if (!results.length) {
            console.log("ADDING");
            db.collection(COLL).save(profile).then(() => {
                return done(null, profile.id);
            });
        }
        else {
            console.log(`FOUND USER ${profile.id}`);
            return done(null, profile.id);
        }
    });
}));

// AUTH0 ENDPOINTS

app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: SUCCESS_REDIRECT,
    failureRedirect: FAILURE_REDIRECT
}));

app.get('/auth/me', (req, res) => {
    if (!req.user) {
        // send default user for now
        let id = 'google-oauth2|100221677757660654495';
        db.collection(COLL).find({ id }).toArray((err, results) => {
            console.log(`added user ${results[0].id} to req`)
            res.status(200).send(results[0]);
        });
    }
    // if (req.user) {
    else {
        console.log(`found user ${req.user.id}`);
        res.status(200).send(req.user);
    }
    // else {
        // console.log(`could not find ${req.user}`);
        // res.status(401).json('please log in');
    // }
});

passport.serializeUser(function (id, done) {
    console.log(`serialized user ${id}`);
    return done(null, id);
});
passport.deserializeUser(function (id, done) {
    console.log(`deserialized user ${id}`);
    db.collection(COLL).find({ id }).toArray((err, results) => {
        console.log(`found deserialized user ${results[0].id}`)
        return done(null, results[0]);
    });
});

// MY ENDPOINTS HERE

// INDIVIDUALS
app.get('/api/individuals', ic.getAll);
app.get('/api/individuals/:id', ic.getOne);
app.put('/api/individuals/:id', ic.updateOne);
app.delete('/api/individuals', ic.deleteAll);
app.delete('/api/individuals/:id', ic.deleteOne);
// ORGANISATIONS
app.get('/api/organisations', oc.getAll);
app.get('/api/organisations/:id', oc.getOne);
app.post('/api/organisations', oc.addOne);
app.put('/api/organisations/:id', oc.updateOne);
app.delete('/api/organisations', oc.deleteAll);
app.delete('/api/organisations/:id', oc.deleteOne);
// MEMBERSHIP
app.get('/api/memberships', mc.getAll);
app.get('/api/memberships/:iid/:oid', mc.getOne);
app.post('/api/memberships', mc.addOne);
app.delete('/api/memberships/', mc.deleteAll);
app.delete('/api/memberships/:id', mc.deleteOne);

// SEND FILES
// const path = require('path');
// app.get('*', (req, res) => {
//     res.sendFile(path.join(`${__dirname}/../dist/index.html`));
// });
