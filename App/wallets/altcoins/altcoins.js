var CoinKey = require('coinkey');
var coininfo = require('coininfo');
const Request = require('request');
const err = require('./../../error/error');

const btc = require ('./../btc');

class Altcoins {

    getWalletValue(address) {
        return new Promise((resolve, reject) => {
        Request.get("https://digiexplorer.info" + "/api/addr/" + address, (err, response, body) => {
            if(err) reject(Error.ERR_GETTING_WALLET_VALUE);
            
            resolve(JSON.parse(body));
        });
        });
    }

    generate_Digibyte(){
        var digibyte = CoinKey.createRandom(coininfo('DGB'));

        let digi_wallet = {}
        digi_wallet._address = digibyte.publicAddress;
        digi_wallet._private_Key = digibyte.privateKey.toString('hex');
        
        return digi_wallet;
    }

    generate_Namecoin(){
        var namecoin = CoinKey.createRandom(coininfo('NMC'));

        let namecoin_wallet = {}
        namecoin_wallet._address = namecoin.publicAddress;
        namecoin_wallet._private_Key = namecoin.privateKey.toString('hex');
        
        return namecoin_wallet;
    }

    generate_Monacoin(){
        var monacoin = CoinKey.createRandom(coininfo('MONA'));

        let monacoin_wallet = {}
        monacoin_wallet._address = monacoin.publicAddress;
        monacoin_wallet._private_Key = monacoin.privateKey.toString('hex');
        
        return monacoin_wallet;
    }

    generate_Blackcoin(){
        var blackcoin = CoinKey.createRandom(coininfo('BLK'));

        let blackcoin_wallet = {}
        blackcoin_wallet._address = blackcoin.publicAddress;
        blackcoin_wallet._private_Key = blackcoin.privateKey.toString('hex');
        
        return blackcoin_wallet;
    }

    generate_BitcoinGold(){
        var bitcoin_gold = CoinKey.createRandom(coininfo('BTG'));

        let bitcoinGold_wallet = {}
        bitcoinGold_wallet._address = bitcoin_gold.publicAddress;
        bitcoinGold_wallet._private_Key = bitcoin_gold.privateKey.toString('hex');
        
        return bitcoinGold_wallet;
    }

    generate_Dash(){
        var dash = CoinKey.createRandom(coininfo('DASH'));

        let dash_wallet = {}
        dash_wallet._address = dash.publicAddress;
        dash_wallet._private_Key = dash.privateKey.toString('hex');
        
        return dash_wallet;
    }

    generate_Doge(){
        var doge = CoinKey.createRandom(coininfo('DOGE'));

        let doge_wallet = {}
        doge_wallet._address = doge.publicAddress;
        doge_wallet._private_Key = doge.privateKey.toString('hex');
        
        return doge_wallet;
    }

    generate_Zcash(){
        var zcash = CoinKey.createRandom(coininfo('ZEC'));

        let zcash_wallet = {}
        zcash_wallet._address = zcash.publicAddress;
        zcash_wallet._private_Key = zcash.privateKey.toString('hex');
        
        return zcash_wallet;
    }

    generate_Vertcoin(){
        var Vertcoin = CoinKey.createRandom(coininfo('VTC'));

        let vertcoin_wallet = {}
        vertcoin_wallet._address = Vertcoin.publicAddress;
        vertcoin_wallet._private_Key = Vertcoin.privateKey.toString('hex');
        
        return vertcoin_wallet;
    }

    generate_Qtum(){
        var Qtum = CoinKey.createRandom(coininfo('QTUM'));

        let qtum_wallet = {}
        qtum_wallet._address = Qtum.publicAddress;
        qtum_wallet._private_Key = Qtum.privateKey.toString('hex');
        
        return qtum_wallet;
    }
    
    generate_ReddCoin(){
        var ReddCoin = CoinKey.createRandom(coininfo('RDD'));

        let reddCoin_wallet = {}
        reddCoin_wallet._address = ReddCoin.publicAddress;
        reddCoin_wallet._private_Key = ReddCoin.privateKey.toString('hex');
        
        return reddCoin_wallet;
    }

    generate_Peercoin(){
        var Peercoin = CoinKey.createRandom(coininfo('PPC'));

        let peerCoin_wallet = {}
        peerCoin_wallet._address = Peercoin.publicAddress;
        peerCoin_wallet._private_Key = Peercoin.privateKey.toString('hex');
        
        return peerCoin_wallet;
    }

    generate_Decred(){
        var Decred = CoinKey.createRandom(coininfo('DCR'));

        let decred_wallet = {}
        decred_wallet._address = Decred.publicAddress;
        decred_wallet._private_Key = Decred.privateKey.toString('hex');
        
        return decred_wallet;
    }

}
module.exports = Altcoins;