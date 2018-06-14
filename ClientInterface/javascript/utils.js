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


let input = null;
let search = $('.js-menu-search');

$('.js-menu-search').on('keyup', () => {
  input = search.val();
  let find = null;
  if(input === "") {
    $('.js-select-coin').each((i, coin) => {
      $(coin).removeClass('hidden');
    });
  }

  $('.js-select-coin').each((i, coin) => {
    let coin_name = coin.getAttribute('coin_name'); 
    if(coin_name.toLowerCase() === input.toLowerCase()) {
      console.log("Finded Coin\n", input, coin_name);
      find = coin_name;
    }
  });

  $('.js-select-coin').each((i, coin) => {
    let coin_name = coin.getAttribute('coin_name'); 
    if(find) {
      if(coin_name !== find) {
        $(coin).addClass('hidden');
      }
    }
  });
});

$('.js-menu-search').focusout(() => {
  input = search.val();
  if(input === "") {
    $('.js-select-coin').each((i, coin) => {
      $(coin).removeClass('hidden');
    });
  }
});