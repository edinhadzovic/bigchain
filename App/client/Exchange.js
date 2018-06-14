const $ = require('jquery');
const {ipcRenderer} = require('electron');

var Exchange = function(container, coins) {
  //wrapper
  let body = $(container);
  
  //data
  const data = coins;
  let input = null;
  let search = body.find('.js-menu-search');

  //coin menu logic
  let menu = {
    body: body.find('.js-coin-menu'),
    content: body.find('.js-coin-menu-content'),
    close: body.find('.js-coin-menu-close'),
    showCase: body.find('.js-coin-menu-showcase'),
    coins: body.find('.js-select-coin'),
    hide: function(){
      this.body.removeClass('active');
      this.content.addClass('hidden');
    },
    show: function(){
      this.body.addClass('active');
      setTimeout(()=>{
        this.content.removeClass('hidden');
      }, 500);
    },
    generateShowCase: function(){
      if(menu.coins.length === 0) {
        for(let i = 0; i < data.length; i++) {
          let coin = data[i];
          let content = '<div class="coin-item js-select-coin" coin_type="'+ coin.symbol +'" coin_name="' + coin.name + '">' + 
            '<div class="coin-image"><img src="' + coin.image + '" heigh="100" width="100"></div>' +
            '<div class="coin-info">' + 
            '<h4>' + coin.name + ' ' + coin.symbol + '</h4>' +
            '<p class="font-medium">Miner Fee: '+ coin.minerFee +'</p>' + 
            '</div>' +
            '</div>';
          menu.showCase.append(content);
        }
      }
    }
  };
  
  menu.generateShowCase();

  menu.close.on('click', () => {
    menu.hide();
  });
  
  //coin left side selector
  var coin_from = {
    body: body.find('.js-exchange-from'),
    select: body.find('.js-coin-select-from'),
    input: body.find('.js-exchange-amount-from'),
    image: body.find('.js-coin-select-image-from'),
    active: false
  };

  coin_from.select.on('click', function(){
    menu.show();
    coin_from.active = true;
  });

  coin_from.input.keyup(() => {
    let pair = `${coin_from.input.attr('tradeFrom')}_${coin_to.input.attr('tradeTo')}`;
    ipcRenderer.send('getPair', pair);
  });

  ipcRenderer.on('returnPair', (event, data) => {
    coin_to.input.attr('value', coin_from.input.val() * data.rate);
  });

  //coin right side selector
  let coin_to = {
    body: body.find('.js-exchange-to'),
    select: body.find('.js-coin-select-to'),
    input: body.find('.js-exchange-amount-to'),
    image: body.find('.js-coin-select-image-to'),
    active: false
  };

  coin_to.select.on('click', function(){
    menu.show();
    coin_to.active = true;
  });

  //submit request to shapeshift
  let submit = body.find('.js-exchange-submit');

  submit.on('click', function(){
    let data = {};
    data.tradeFrom = `_${coin_from.input.attr('tradeFrom')}_wallet`;
    data.tradeFromAmount = coin_from.input.val();
    data.tradeTo = `_${coin_to.input.attr('tradeTo')}_wallet`;
    data.tradeToAmount = coin_to.input.val();
    data.pair = `${coin_from.input.attr('tradeFrom')}_${coin_to.input.attr('tradeTo')}`;
    ipcRenderer.send('exchange', data);
  });

  var coinMenuItem = function(param) {
    let $body = $(param);
    let attr = $body.attr('coin_type');
    $body.click(() => {
        data.forEach(coin => {
          if(coin_from.active) {
            if(coin.symbol === attr) {
              coin_from.image.attr('src', coin.image);
              coin_from.input.attr('tradeFrom', coin.symbol.toLowerCase());
              coin_from.active = false;
              menu.hide();
            }
          }

          if(coin_to.active) {
            if(coin.symbol === attr) {
              coin_to.image.attr('src', coin.image);
              coin_to.input.attr('tradeTo', coin.symbol.toLowerCase());
              coin_to.active = false;
              menu.hide();
            }
          }
          
        });
    });
  };

  var coin_array;
  $('.js-select-coin').each((el) => {
    coin_array = new coinMenuItem($('.js-select-coin')[el]);
  });

  this.log = function() {
    console.log(body);
    console.log(coin_from);
    console.log(submit);
    console.log(data);
  };
};

module.exports = Exchange;