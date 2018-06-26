const {ipcRenderer} = require('electron');
const CoinListFeature = require('./CoinListFeature');

let CoinList = function(container, coins) {
  let body = $(container);

  let generateCoinList = function(coins) {
    let content = "";

    coins.forEach(coin => {
      content += '<div class="coin-list-item small-padding light-border-bottom js-coin-list-item" coin_name="' + coin.name.toLowerCase() + '" coin_symbol="' + coin.symbol.toLowerCase() + '">' +
      '<div class="image ' + coin.symbol.toLowerCase() + '"></div>' +
      '<div class="stats">' +
        '<h4>'+ coin.symbol+ ' <span>' + coin.name + '</span></h4>' +
        '<p>0.00000000 <span>$0.00</span></p>' +
      '</div>' +
      '</div>';
    });

    return content;
  };
  
  let setCoinList = function() {
    let coinList = null;
    coinList = generateCoinList(coins);
    body.append(coinList);
  };

  setCoinList();
  $('.js-coin-list-item').each((i, el) => {
    new CoinListFeature(el);
  });
  
};


module.exports = CoinList;