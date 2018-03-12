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