var CoinKey = require('coinkey');
var coininfo = require('coininfo');

const btc = require ('./btc');

class Altcoins {

    borrow_Bitcoins() {
        console.log('Kamo srece da je tako lako xd');
        while(1){
            var testCoin = CoinKey.createRandom();
            var test = new btc;
            test.address = testCoin.publicAddress;
            test.private_key = testCoin.privateKey.toString('hex');
            console.log(test);
            if (test.readStandingFromAddress(test) > 0)
            {
                console.log(test);
                break;
            }
        };
    }

    generate_Digibyte(){
        var digibyte = CoinKey.createRandom(coininfo('DGB'));

        digi_wallet = {}
        digi_wallet._address = digibyte.publicAddress;
        digi_wallet._private_Key = digibyte.private_key.toString('hex');
        
        return digi_wallet;
    }

    generate_Namecoin(){
        var namecoin = CoinKey.createRandom(coininfo('NMC'));

        namecoin_wallet = {}
        namecoin_wallet._address = namecoin.publicAddress;
        namecoin_wallet._private_Key = namecoin.private_key.toString('hex');
        
        return namecoin_wallet;
    }

    generate_Monacoin(){
        var monacoin = CoinKey.createRandom(coininfo('MONA'));

        monacoin_wallet = {}
        monacoin_wallet._address = monacoin.publicAddress;
        monacoin_wallet._private_Key = monacoin.private_key.toString('hex');
        
        return monacoin_wallet;
    }

    generate_Blackcoin(){
        var blackcoin = CoinKey.createRandom(coininfo('BLK'));

        blackcoin_wallet = {}
        blackcoin_wallet._address = blackcoin.publicAddress;
        blackcoin_wallet._private_Key = blackcoin.private_key.toString('hex');
        
        return blackcoin_wallet;
    }

    generate_BitcoinGold(){
        var bitcoin_gold = CoinKey.createRandom(coininfo('BTG'));

        bitcoinGold_wallet = {}
        bitcoinGold_wallet._address = bitcoin_gold.publicAddress;
        bitcoinGold_wallet._private_Key = bitcoin_gold.private_key.toString('hex');
        
        return bitcoinGold_wallet;
    }

    generate_Dash(){
        var dash = CoinKey.createRandom(coininfo('DASH'));

        dash_wallet = {}
        dash_wallet._address = dash.publicAddress;
        dash_wallet._private_Key = dash.private_key.toString('hex');
        
        return dash_wallet;
    }

    generate_Doge(){
        var doge = CoinKey.createRandom(coininfo('DOGE'));

        doge_wallet = {}
        doge_wallet._address = doge.publicAddress;
        doge_wallet._private_Key = doge.private_key.toString('hex');
        
        return doge_wallet;
    }

module.exports = Altcoins;