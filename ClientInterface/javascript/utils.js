const { SearchModule } = require('./../../App/client/utils');

SearchModule('.js-coin-list-search', '.js-coin-list-item');
SearchModule('.js-menu-search', '.js-select-coin');

let coinMenu = function(tag) {
  $body = $(tag);
  let input = null;
  let search = $body.find('.js-menu-search');
  let coins = $body.find('.js-select-coin');

  console.log(search);
  console.log(coins);
};


$('.js-coin-menu-content').each((i, el) => {
  console.log(el);
  new coinMenu(el);
});