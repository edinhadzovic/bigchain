const $ = require('jquery');

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


module.exports = {
  SearchModule
};