var CoinMarketCap = require("node-coinmarketcap");
var coinmarketcap = new CoinMarketCap();


module.exports = { 
    getBtcPrice: function(){
        return new Promise((resolve, reject) => {
            coinmarketcap.get("bitcoin", coin => {
                resolve (coin.price_usd);
            });
        });
    },
}