const shapeshift = require('shapeshift.io');


class Shapeshift {
  constructor(){
    this.availableCoins = [];
    this.unavaiableCoins = [];
  }

  getCoins(){
    return new Promise((resolve, reject) => {
      shapeshift.coins(function(err, coinData) {
        if(err) reject(err);
        resolve(coinData);
      });
    });
  }
}

module.exports = Shapeshift;