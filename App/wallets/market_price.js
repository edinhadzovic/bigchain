var CoinMarketCap = require("node-coinmarketcap");
var coinmarketcap = new CoinMarketCap();


module.exports = { 
    getBtcPrice: function(){
        return new Promise((resolve, reject) => {
            coinmarketcap.get("bitcoin", coin => {
                let price = this.roundToTwo(coin.price_usd);
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
    roundToTwo: function (num) {  
        return +(Math.round(num + "e+2")  + "e-2");
    },
}