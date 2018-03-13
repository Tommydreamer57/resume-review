const COLL = 'resume-review-individuals';

module.exports = {
    getAll(req, res) {
        const db = req.app.get('db');
        db.collection(COLL).find().toArray((err, results) => {
            if (err) res.status(500).json(`failure finding individuals`);
            else res.status(200).send(results);
        });
    },
    getOne(req, res) {
        const db = req.app.get('db');
        db.collection(COLL).find({ _id: req.params.id }).toArray((err, user) => {
            res.status(200).send(user);
        });
    },
    updateOne(req, res) {
        const db = req.app.get('db');
        delete req.body._id
        delete req.body._json
        delete req.body.provider
        db.collection(COLL).update({ _id: req.params.id }, { $set: req.body }).then(() => {
            res.status(200).json(`updated user ${req.params.id}`);
        });
    },
    deleteAll(req, res) {
        const db = req.app.get('db');
        db.collection(COLL).remove({}).then(() => {
            res.status(200).json('deleted all users');
        });
    },
    deleteOne(req, res) {
        const db = req.app.get('db');
        db.collection(COLL).remove({ _id: req.params.id }).then(() => {
            res.status(200).json(`deleted user ${req.params.id}`);
        });
    }
}