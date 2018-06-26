const {ipcRenderer} = require('electron');

let CoinList = function(container, coins) {
  let body = $(container);

  let generateCoinList = function(coins) {
    let content = "";

    coins.forEach(coin => {
      content += '<div class="coin-list-item small-padding light-border-bottom">' +
      '<div class="image ' + coin.symbol.toLowerCase() + '"></div>' +
      '<div class="stats">' +
        '<h4>'+ coin.symbol+ ' <span>' + coin.name + '</span></h4>' +
        '<p>0.00000718 <span>$0.04</span></p>' +
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
};


module.exports = CoinList;