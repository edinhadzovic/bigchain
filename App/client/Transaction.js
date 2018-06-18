const {ipcRenderer} = require('electron');


let Transactions = function(element) {
  let $body = $(element);
  
  let elements = {
    type: $body.attr('type'),
    amount: $body.find('.js-transactions-amount'),
    address: $body.find('.js-transactions-address'),
    submit: $body.find('.js-transactions-send')
  };
  
  let values = {
    amount: 0,
    address: null
  };

  $(elements.submit).on('click', (ev) => {
    ev.preventDefault();

    values.amount = elements.amount.val();
    values.address = elements.address.val();

    if(values.amount <= 0 || values.address === "") {
      console.log("Error");
      return;
    }

    ipcRenderer.send('send_eth', values);

  });
};


module.exports = Transactions;