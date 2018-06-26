const $ = require('jquery');
const {ipcRenderer} = require('electron');

let CoinListFeature = function(item) {
  $item = $(item);
  let coin_info = {
    name: $item.attr('coin_name'),
    type: $item.attr('coin_symbol')
  };
  
  $item.click(() => {
    console.log(coin_info);

    ipcRenderer.send('get-user-coin', coin_info);
  });
};


module.exports = CoinListFeature;