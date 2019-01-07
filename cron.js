const axios = require('axios')
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { db } = require('./models');
const moment = require('moment')
const discord = require('./helpers/discord')
var table = require('text-table');


const urlsToInspect = [
  'https://emalls.ir/%D9%85%D8%B4%D8%AE%D8%B5%D8%A7%D8%AA_AMD-RYZEN-5-2600-3-4GHz-19MB-BOX-CPU~id~1413987',
  // 'https://emalls.ir/%D9%85%D8%B4%D8%AE%D8%B5%D8%A7%D8%AA_RAM-GSkill-Aegis-8GB-DDR4-3000MHz-CL16~id~1282391',
  'https://emalls.ir/%D9%85%D8%B4%D8%AE%D8%B5%D8%A7%D8%AA_Samsung-860-Evo-SSD-Drive-500GB~id~1191119~s~860',
  'https://emalls.ir/%D9%85%D8%B4%D8%AE%D8%B5%D8%A7%D8%AA_EVGA-GTX-1070-FTW-GAMING-ACX-3-0-8GB-GDDR5X-Desktop-Graphic-Card~id~363644',
  'https://emalls.ir/%D9%85%D8%B4%D8%AE%D8%B5%D8%A7%D8%AA_MSI-GAMING-GTX-1070-TI-8GB-GDDR5-256bit-GRAPHICS-CARD~id~990251',
  'https://emalls.ir/%D9%85%D8%B4%D8%AE%D8%B5%D8%A7%D8%AA_MSI-GeForce-GTX-1080-GAMING-X-8GB-Graphics-Card~id~363576',
  'https://emalls.ir/%D9%85%D8%B4%D8%AE%D8%B5%D8%A7%D8%AA_AMD-Ryzen-7-1700-CPU~id~685548'
]


const start = async () => {
  console.log('start counter started');
  try {
    for (let i = 0; i < urlsToInspect.length; i++) {
      const url = urlsToInspect[i];
      const result = await axios.get(url)
        .catch(e => console.log(e, 'err axios'))
      let html = result.data
      const dom = new JSDOM(html)
      let shops = dom.window.document.querySelectorAll('.shop-row')
      let product = dom.window.document.querySelector('.product-title > h1.detailitemtitle').textContent;
      // console.log(product)
      let products = []
      let now = moment().format('YYYY-MM-DD HH:mm')
      let yesterday = moment().add(-1, 'day').format('YYYY-MM-DD HH:mm')
      for (let b = 0; b < shops.length; b++) {
        const elm = shops[b];
        try {
          let isHighlighted = elm.style.backgroundColor
          if (!isHighlighted) { continue }
          let price = elm.querySelector('.shop-price-wrapper > .inline-block > .shop-price').textContent
          let lastUpdatedHour = elm.querySelector('.shop-price-wrapper > .inline-block > span').textContent;
          let shopName = elm.querySelector('.shop-logo-wrapper > .shopnamespan> a').textContent;
          // console.log(shopName, 'shop name')
          price = price.replace(/,/g, '')
          products.push({
            price,
            shopName,
            lastUpdatedHour,
            createdAt : now,
            product
          });
        } catch (error) {
          console.log(error)
        }
      }
      let least = products.sort((min, b) => {
        return min.price - b.price
      })
      let data = least[0]
      db.prices.insert({ ...data, url }, (e, result) => {
        if (e) console.log(e, '')
        db.prices.find({ price: { $lt: result.price },createdAt:{$gte:yesterday}} , (err, lowestPriceRow) => {
        if (err) console.log(err)
        if (lowestPriceRow.length == 0 ) {
          var t = table([
            [result.price, result.product, result.shopName, result.lastUpdatedHour, result.url]
          ]);
          // console.log(t)

          discord.sendMessage(t)
          console.log('new lowet price', result.price);
        }

      })

      })
    }
  } catch (error) {
    console.log(error, 'catch')
  }


}



// start()
let timer = 3600000 ; // 1 hours
setInterval(start, timer)
console.log('cron file loaded')