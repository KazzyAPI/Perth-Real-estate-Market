const cheerio = require('cheerio')
const fs = require('fs')
const request = require('request');
const { setInterval } = require('timers/promises');
const keys = [
    "suburb",
    "mean-Price",
    "twelve-month-growth",
    "random"
]
let arr = [];
async function getSuburbPrices() {
    console.log('Fetching new prices!')
    const uri = `https://reiwa.com.au/the-wa-market/perth-suburbs-price-data/`
    let data = `Suburb,Mean Price, Mean Increase\n`
    request.get(uri, async (err,res ,body) => {
        let $ = cheerio.load(body);

        const selector = '#ctl00_uxContentHolder_dzMainTop_uxColumnDisplay_ctl00_uxControlColumn_ctl00_uxWidgetHost_uxWidgetHost_widget_ctl00_PriceGrowthList > tbody > tr'

        $(selector).each((index, e) => {
          
            let counter = 0;
            let obj = {}
            $(e).children().each((ie, iee) => {
                if($(iee).text().trim() !== '') {
                    obj[keys[counter]] = $(iee).text().trim().replace(/,/g, '');
                    counter++
                    //data += `${$(iee).text().trim()},`    
                    
                }
                //console.log($(iee).text().trim());
            })
            //data+=`\n`
            //console.log(obj)
            if(index !== 0) {
                arr.push(obj)

            }
        })

        let d = "Suburb,Mean Price,12 Month Growth\n"
        arr.forEach(property => {
            if(property['mean-Price'] !== '$0')
            d+=`${property.suburb},${property['mean-Price']},${property['twelve-month-growth']}\n`
        })

        fs.writeFileSync('datas.csv', d);
        console.log('Updated new file!')

        setTimeout(() => {
            getSuburbPrices()
        }, 100000)
    })
}

getSuburbPrices()

