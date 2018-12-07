const Datastore = require('nedb')
const db = {};

db.prices = new Datastore({ filename: './prices', autoload: true });
db.prices.loadDatabase()
module.exports.db=db