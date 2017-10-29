let mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect( Process.env.MONGO_URI || db.mlab, {
    useMongoClient: true,
});

module.exports = { mongoose };