const $ = require('jquery');
const {ipcRenderer} = require('electron');
const { SendWindow } = require('./utils');

let CoinListFeature = function(item) {
  let $item = $(item);
  let $body = $('.js-coin-features');
  let clone = $body.html();

  let coin_info = {
    name: $item.attr('coin_name'),
    type: $item.attr('coin_type'),
    active: false,
    count: 0,
    generateHeadline: function() {
      return '<div class="coin-features-headline small-padding js-to-delete">' +
                '<div class="headline">' +
                  '<h2>'+ coin_info.type.toUpperCase() +' <span>'+ coin_info.name +'</span></h2>' +
                '</div>' +
                '<div class="coin-features-actions">' +
                  '<button class="js-send-assets action-button" coin_id="'+ coin_info.type.toLowerCase() +'">Send</button>' +
                  '<button class="js-recover-assets action-button" coin_id="'+ coin_info.type.toLowerCase() +'">Recover</button>' +
                  '<button class="js-trade-assets action-button--reverse" coin_id="'+ coin_info.type.toLowerCase() +'">Trade</button>' +
                '</div>' +
		          '</div>';
    },
    noTransactionHistory: function() {
      return '<div class="js-to-delete center h80p">No Transactions on this wallet :(</div>';
    }
  };

  let loading = {
    body: $body.find('.js-loading'),
    status: false,
  };
  

  $item.on('click', (e) => {
    e.stopImmediatePropagation();
    let remove = $('.js-to-delete').remove();
    console.log(remove);
    loading.body.removeClass('hidden');
    loading.status = true;

    ipcRenderer.send('get-user-coin', coin_info);
  });

  ipcRenderer.on('get-user-coins', (event, data) => {
    loading.status = false;
    loading.body.addClass('hidden');
    if(coin_info.type === data.type) {
      let headline = coin_info.generateHeadline();
      let transaction = null;
      if(data.amount === 0) {
        transaction = coin_info.noTransactionHistory();
      }
      console.log(headline);
      $body.append(headline);
      $body.append(transaction);
      SendWindow('.js-send-assets');
    }
  });

  // setInterval(() => {
  //   console.log(loading.status)
  //   if(!loading.status) {
  //     loading.body.addClass('hidden');
  //   }
  // }, 100);

  return this;
};


module.exports = CoinListFeature;