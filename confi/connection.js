const MongoClient = require('mongodb').MongoClient;

const state = {
    db: null,
};

module.exports.connect = function (done) {
    const url = 'mongodb+srv://jithin97972:jithin1234@cluster0.ldzzlzo.mongodb.net/test';
    const dbname = 'project';

    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) {
            console.error('Error connecting to MongoDB:', err);
            return done(err);
        }

        state.db = client.db(dbname);
        console.log('Connected to MongoDB');
        done();
    });
};

module.exports.get = function () {
    return state.db;
};
