const COLL = 'resume-review-organisations';

module.exports = {
    getAll(req, res) {
        const db = req.app.get('db');
        db.collection(COLL).find().toArray((err, results) => {
            if (err) res.status(500).json(`failure to get collections`);
            else res.status(200).send(results);
        });
    },
    getOne(req, res) {
        const db = req.app.get('db');
        db.collection(COLL).find({ _id: req.params.id }).toArray((err, results) => {
            if (err) res.status(500).send(`failure to get collection ${req.params.id}`);
            else res.status(200).send(results);
        });
    },
    addOne(req, res) {
        const db = req.app.get('db');
        db.collection(COLL).save(req.body).then(() => {
            res.status(200).json(`added ${req.body.name} to collections`)
        });
    },
    updateOne(req, res) {

    },
    deleteAll(req, res) {
        const db = req.app.get('db');
        db.collection(COLL).remove({}).then(() => {
            res.status(200).json(`deleted all organisations`);
        });
    },
    deleteOne(req, res) {
        const db = req.app.get('db');
        db.collection(COLL).remove({ _id: req.params.id }).then(() => {
            res.status(200).json(`deleted organisation ${req.body.id}`);
        });
    }
}