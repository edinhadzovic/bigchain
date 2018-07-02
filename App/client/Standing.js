const btc = require('../wallets/btc');
const ltc = require('../wallets/ltc');
const eth = require('../wallets/eth');
const bch = require('../wallets/bch');
const dgb = require('../wallets/altcoins/dgb');
const market_price = require('../wallets/market_price');

let Standing = function(){
  this.btc = {
    standing: 0,
    usd: 0,
  };
  this.bch = {
    standing: 0,
    usd: 0,
  };
  this.ltc = {
    standing: 0,
    usd: 0,
  };
  this.eth = {
    standing: 0,
    usd: 0,
  };
  this.dgb = {
    standing: 0,
    usd: 0,
  };
};

Standing.prototype.generate_Standings = async function(current_user) {
  this.btc.usd = await market_price.getBtcPrice();
  this.ltc.usd = await market_price.getLtcPrice();
  this.eth.usd = await market_price.getEthPrice();
  this.bch.usd = await market_price.getBchPrice();
  this.dgb.usd = await market_price.getDgbPrice();
  this.btc.standing = await current_user._btc_wallet.readStandingFromAddress(current_user._btc_wallet);
  this.ltc.standing = await current_user._ltc_wallet.readStandingFromAddress(current_user._ltc_wallet);
  this.eth.standing = await current_user._eth_wallet.readStandingFromAddress(current_user._eth_wallet);
  this.bch.standing = await current_user._bch_wallet.readStandingFromAddress(current_user._bch_wallet);
};


/*
    var standing = new Standing();
    await standing.generate_Standings(current_user);
    console.log(standing);
*/
module.exports = Standing;