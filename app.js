const axios = require('axios')
const cheerio = require('cheerio')
const schedule = require('node-schedule');
const tajMobileList = 'http: //www.tajtehran.com/alistx.php'



const start = async()=>{
const tajMobileHTML = await axios.get(tajMobileHTML)
  .catch(e=>console.log(e,'taj list axios err'))
const $
if(tajMobileHTML.length>0) $ = cheerio.load(tajMobileHTML)
else console.log(tajMobileHTML)
// $('td').
}
start()