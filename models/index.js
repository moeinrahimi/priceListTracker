const Datastore = require('nedb')
const db = {};

db.prices = new Datastore({ filename: './models/prices.db', autoload: true });
db.prices.loadDatabase()
module.exports.db=db