const { SearchModule, MarketCapCarousel } = require('./../../App/client/utils');

SearchModule('.js-coin-list-search', '.js-coin-list-item');
SearchModule('.js-menu-search', '.js-select-coin');
MarketCapCarousel('.js-coin-carousel');