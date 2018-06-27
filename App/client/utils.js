const $ = require('jquery');
const {ipcRenderer} = require('electron');

/**
 * 
 * @param {string} searchField Class name of the seach input field
 * @param {string} searchTarget Class name of the items that should be searched
 */
let SearchModule = function(searchField, searchTarget) {
  let input = null;
  let search = $(searchField);
  
  let find = [];
  
  $(searchField).on('keyup', () => {
    input = search.val();
    if(input === "") {
      $(searchTarget).each((i, coin) => {
        $(coin).removeClass('hidden');
      });
    }
  
  
    $(searchTarget).each((i, coin) => {
      // Testing for coin_name and coin_type
  
      let coin_name = coin.getAttribute('coin_name'); 
      let coin_type = coin.getAttribute('coin_type');
  
      if(coin_name.toLowerCase().includes(input.toLowerCase()) && input !== "")
      {
        var index = find.indexOf(coin_name);
        if (index === -1)
        {
          find.push(coin_name);
        }
      } 
      else if (coin_type.toLowerCase().includes(input.toLowerCase()) && input !== "")
      {
        var index = find.indexOf(coin_name);
        if (index === -1)
        {
          find.push(coin_name);
        }
      }
      else if (input !== "") {
        var index = find.indexOf(coin_name);
        if (index !== -1)
        {
          find.splice(index,1);
        } 
      }
      else if(input === " " || input === "")
      {
        find.splice(index,find.length);
      }
  
    });
  
    $(searchTarget).each((i, coin) => {
      let coin_name = coin.getAttribute('coin_name'); 
      var index = find.indexOf(coin_name);
      if(index === -1 && find.length === 0)
      {
        $(coin).removeClass('hidden'); 
      }
      else if (index === -1)
      {
        $(coin).addClass('hidden');
      } 
      else 
      {
        $(coin).removeClass('hidden');
      } 
  
    });
  });
  
  $(searchField).focusout(() => {
    input = search.val();
    if(input === "") {
      $(searchTarget).each((i, coin) => {
        $(coin).removeClass('hidden');
      });
    }
  });
};

let SendWindow = function(SendButton) {
  $send = $(SendButton);

  $send.click(() => {
    let data = {};
    data.coin = $send.attr('coin_id');
    data.open = "send";
    ipcRenderer.send('Window', data);
  });
};


let SendModule = function(body, data) {
  $body = $(body);
  
  let headline = {
    image: $body.find('.js-send-image'),
    h3: $body.find('.js-send-coin-name')
  };

  let balance = {
    body: $body.find('.js-balance'),
    fiat: $body.find('.js-balance-fiat'),
    satoshi: $body.find('.js-satoshi-balance')
  };

  console.log(data);
  let $form = $body.find('.js-send-coin-form');

  let send = {
    type: data.symbol,
    address: $form.find('.js-address'),
    amount: $form.find('.js-amount'),
    fee: $form.find('.js-miner-fee'),
    button: $form.find('.js-send')
  };

  console.log(headline, balance);

  headline.image.addClass(`${data.symbol}-bg`);
  headline.h3.html(data.name);

  balance.fiat.text(`$${data.balance*data.market_price}`);
  balance.satoshi.text(`${data.balance} ${data.symbol.toUpperCase()}`);

  send.button.click(() => {
    if(send.address.val() === "") { 
      send.address.addClass('wrong');
      return;
    } else {
      send.address.removeClass('wrong');
    }

    if(send.amount.val() === "") { 
      send.amount.addClass('wrong');
      return;
    } else {
      send.amount.removeClass('wrong');
    }

    let transaction = {}
    transaction.address = send.address.val();
    transaction.amount = send.amount.val();
    transaction.coin = send.type;

    ipcRenderer.send('send', transaction);
  });

  send.address.focus(() => {
    if(send.address.hasClass('wrong')) {
      send.address.removeClass('wrong');
    }
  });

  send.amount.focus(() => {
    if(send.amount.hasClass('wrong')) {
      send.amount.removeClass('wrong');
    }
  });
};

module.exports = {
  SearchModule,
  SendWindow,
  SendModule
};