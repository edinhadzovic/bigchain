const {ipcRenderer} = require('electron');
const CoinListFeature = require('./CoinListFeature');

let CoinList = function(container, coins, current_standing) {
  let body = $(container);

  console.log('dvadeset kurcina',current_standing);
  let generateCoinList = function(coins) {
    let content = "";

    coins.forEach(coin => {
      let x;
      let y;

      if (coin.symbol.toLowerCase() == 'btc'){
        x = current_standing.btc.standing;
        y = current_standing.btc.usd;
      }
      else if (coin.symbol.toLowerCase() == 'eth'){
        x = current_standing.eth.standing;
        y = current_standing.eth.usd;
      }
      else if (coin.symbol.toLowerCase() == 'ltc'){
        x = current_standing.ltc.standing;
        y = current_standing.ltc.usd;
      }
      else if (coin.symbol.toLowerCase() == 'bch'){
        x = current_standing.bch.standing;
        y = current_standing.bch.usd;
      }
      else {
        x = 0;
        y = 0;
      }
      content += '<div class="coin-list-item small-padding light-border-bottom js-coin-list-item" coin_name="' + coin.name.toLowerCase() + '" coin_type="' + coin.symbol.toLowerCase() + '">' +
      '<div class="image ' + coin.symbol.toLowerCase() + '"></div>' +
      '<div class="stats">' +
        '<h4>'+ coin.symbol+ ' <span>' + coin.name + '</span></h4>' +
        '<p>'+ x + ' <span>' + y + '$' +  '</span></p>' +
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