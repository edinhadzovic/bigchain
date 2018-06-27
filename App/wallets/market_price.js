var CoinMarketCap = require("node-coinmarketcap");
var coinmarketcap = new CoinMarketCap();


module.exports = { 
    getTop100: function(){
        return new Promise((resolve, reject) => {
            coinmarketcap.multi(coins => {
                let data = coins.getTop(100);
                resolve(data);
            });
        });
    },
    getBtcPrice: function(){
        return new Promise((resolve, reject) => {
            coinmarketcap.get("bitcoin", coin => {
                let price = this.roundToTwo(coin.price_usd);
                console.log(price);
                resolve (price);
            });
        });
    },
    getLtcPrice: function(){
        return new Promise((resolve, reject) => {
            coinmarketcap.get("litecoin", coin => {
                let price = this.roundToTwo(coin.price_usd);
                resolve (price);
            });
        });
    },
    getBchPrice: function(){
        return new Promise((resolve, reject) => {
            coinmarketcap.get("bitcoin-cash", coin => {
                let price = this.roundToTwo(coin.price_usd);
                resolve (price);
            });
        });
    },
    getEthPrice: function(){
        return new Promise((resolve, reject) => {
            coinmarketcap.get("ethereum", coin => {
                let price = this.roundToTwo(coin.price_usd);
                resolve (price);
            });
        });
    },
    getDgbPrice: function(){
        return new Promise((resolve, reject) => {
            coinmarketcap.get("digibyte", coin => {
                let price = this.roundToTwo(coin.price_usd);
                resolve (price);
            });
        });
    },
    roundToTwo: function (num) {  
        return +(Math.round(num + "e+2")  + "e-2");
    },
}