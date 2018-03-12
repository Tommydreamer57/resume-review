const COLL = 'resume-review-memberships';

module.exports = {
    getAll(req, res) {
        const db = req.app.get('db');
        db.collection(COLL).find().toArray((err, results) => {
            if (err) res.status(500).json(`failure to get memberships`);
            else res.status(200).send(results);
        });
    },
    getOne(req, res) {
        const db = req.app.get('db');
        let search = {}
        if (req.params.iid) search.iid = req.params.iid
        if (req.params.oid) search.oid = req.params.oid
        db.collection(COLL).find(search).toArray((err, results) => {
            if (err) res.status(500).send(`failure to get memberships of user ${req.params.iid}`);
            else res.status(200).send(results);
        });
    },
    addOne(req, res) {
        const db = req.app.get('db');
        db.collection(COLL).save(req.body).then(() => {
            res.status(200).json(`added user ${req.body.iid} to organisation ${req.body.oid}`);
        });
    },
    deleteAll(req, res) {
        const db = req.app.get('db');
        db.collection(COLL).remove({}).then(() => {
            res.status(200).json(`deleted all memberships`);
        });
    },
    deleteOne(req, res) {
        const db = req.app.get('db');
        db.collection(COLL).remove({ _id: req.params.id }).then(() => {
            res.status(200).json(`deleted membership ${req.body.id}`);
        });
    }
}