const mongoose = require('mongoose');


// mongoose.connect('mongodb://localhost:27017/noderest', { useNewUrlParser: true });
const dbName = process.env.NODE_ENV === 'prod' ? 'noderest' : 'noderest_test';

console.log('database name: ' + dbName);
console.log('NODE_ENV: ' + process.env.NODE_ENV);

var mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
    mongoUrl = 'mongodb://localhost:27017';
};

mongoUrl += '/' + dbName;

console.log('MONGO_URL: ' + mongoUrl);

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
});

mongoose.Promise = global.Promise;

module.exports = mongoose;