const $ = require('jquery');
const {ipcRenderer} = require('electron');

let CoinListFeature = function(item) {
  let $item = $(item);
  let $body = $('.js-coin-features');
  let clone = $body.clone();

  let coin_info = {
    name: $item.attr('coin_name'),
    type: $item.attr('coin_type'),
    active: false,
    generateHeadline: function() {
      return '<div class="coin-features-headline small-padding">' +
                '<div class="headline">' +
                  '<h2>'+ coin_info.type.toUpperCase() +' <span>'+ coin_info.name +'</span></h2>' +
                '</div>' +
                '<div class="coin-features-actions">' +
                  '<button class="js-send-assets action-button" coin_id="'+ coin_info.type.toLowerCase() +'">Send</button>' +
                  '<button class="js-recover-assets action-button" coin_id="'+ coin_info.type.toLowerCase() +'">Recover</button>' +
                  '<button class="js-trade-assets action-button--reverse" coin_id="'+ coin_info.type.toLowerCase() +'">Trade</button>' +
                '</div>' +
		          '</div>';
    }
  };

  let loading = {
    body: $body.find('.js-loading'),
    status: false,
    content: '<div class="coin-features-display js-loading hidden">'+
    '<div class="lds-grid"><div class="aqua-bg"></div><div class="aqua-bg"></div><div class="aqua-bg"></div><div class="aqua-bg"></div><div class="aqua-bg"></div><div class="aqua-bg"></div><div class="aqua-bg"></div><div class="aqua-bg"></div><div class="aqua-bg"></div></div>'+
  '</div>'
  };
  
  $item.click(() => {
    // $body.html("");
    // $body.append(loading.content);
    loading.body.removeClass('hidden');
    loading.status = true;

    ipcRenderer.send('get-user-coin', coin_info);
  });

  ipcRenderer.on('get-user-coins', (event, data) => {
    console.log(data);
    loading.status = false;
    loading.body.addClass('hidden');
    if(coin_info.type === data.type && !coin_info.active) {
      coin_info.active = true;
      let headline = coin_info.generateHeadline();
      $body.append(headline);
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