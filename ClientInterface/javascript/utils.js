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

let find = [];

$('.js-menu-search').on('keyup', () => {
  input = search.val();
  if(input === "") {
    $('.js-select-coin').each((i, coin) => {
      $(coin).removeClass('hidden');
    });
  }


  $('.js-select-coin').each((i, coin) => {
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

  $('.js-select-coin').each((i, coin) => {
    //console.log('22222');
    let coin_name = coin.getAttribute('coin_name'); 
    //console.log(find, coin_name, " koji se kurac desava");
    var index = find.indexOf(coin_name);
    if(index === -1 && find.length === 0)
    {
      console.log(index, coin_name, "SHOWING");
      $(coin).removeClass('hidden'); 
    }
    else if (index === -1)
    {
      console.log(index, coin_name, "HIDING");
      $(coin).addClass('hidden');
    } 
    else 
    {
      console.log(index, coin_name, "SHOWING");
      $(coin).removeClass('hidden');
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