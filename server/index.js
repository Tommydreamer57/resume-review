const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const Auth0Strategy = require('auth0');
require('dotenv').config();

const app = express();

const PORT = 8070;
const { URI, DBNAME } = process.env;

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

MongoClient.connect(URI, function (err, client) {
    assert.equal(null, err);
    console.log(`${DBNAME} connected to server`);

    db = client.db(DBNAME);
    console.log("DB: ");
    console.log(db);
    console.log("CLIENT: ");
    console.log(client);

    app.listen(PORT, () => console.log(`Resume Review listening on port ${PORT}`));
    // client.close();
});

// AUTH0 CONNECTION

app.use(new Auth0Strategy({

}, function () {
    
}))

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
