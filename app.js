
const {db} = require('./models');
const json2csv = require('json2csv').parse;
const { join } = require('path');
var express = require('express');
var app = express();
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs')
const Json2csvTransform = require('json2csv').Transform;
const moment = require('moment')
async function getCsv(req, res, next) {
    const prices = await db.prices.getAllData()    
    const fields = [
     'price',
     'lastUpdatedHour',
     'shopName',
     'product',
     'counter'
    ]
    const opts = {fields}
    // const csv =json2csv(prices,opts)
      let now = moment().format('YYYY-MM-DD-hh-mm-ss').toString()
      let path = `./public/csv/${now}.csv`

   let outputPath = `./public/csv/${now}-parsed.csv`
    
   const transformOpts = { highWaterMark: 16384, encoding: 'utf-8' };
   fs.appendFileSync(path, JSON.stringify(prices));
   const input = fs.createReadStream(path, { encoding: 'utf8' });
   const output = fs.createWriteStream(outputPath, { encoding: 'utf8' });
   const json2csv = new Json2csvTransform(opts, transformOpts);
   const processor = input.pipe(json2csv).pipe(output);
   processor.on('finish', line => res.download(outputPath)) // console.log(res)
}
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.get('/report', getCsv)
app.listen(80,
    "0.0.0.0",
    function() {
        console.log('nodejs server started on', 80);
    });

  require('./cron')