var CoinKey = require('coinkey');
var coininfo = require('coininfo');

const btc = require ('./btc');

class Altcoins {
 
    generateAddresses() {
        console.log('JEBENI CONSOLE LOGOVII BRE ALTCOINI');
        var privateKeyHex = "1184cd2cdd640ca42cfc3a091c51d549b2f016d454b2774019c2b2d2e08529fd";
    
        //Bitcoin WIF
        console.log('BITCOINIIIIII');
        var key = new CoinKey(new Buffer(privateKeyHex, 'hex'));
        key.compressed = false;
        console.log(key.privateWif); // => 5Hx15HFGyep2CfPxsJKe2fXJsCVn5DEiyoeGGF6JZjGbTRnqfiD
        var bitcoin = CoinKey.fromWif(key.privateWif);
        console.log(bitcoin.privateKey.toString('hex'));
        console.log(bitcoin.publicAddress);
        
        console.log('LITECOIN');
        //Litecoin WIF
        var key = new CoinKey(new Buffer(privateKeyHex, 'hex'), {private: 0x9e, public: 0x1e});
        console.log(key.privateWif); // => 6uFjYQnot5Gtg3HpP87bp4JUpg4FH1gkkV3RyS7LHBbD9Hpt1na
        var litecin = CoinKey.fromWif(key.privateWif);
        console.log(litecin.privateKey.toString('hex'));
        console.log(litecin.publicAddress);

        while(1){
            var testCoin = CoinKey.createRandom();
            //console.log(testCoin);
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
/*
        console.log('Namecoin');
        var Namecoin = CoinKey.createRandom(coininfo('NMC'));

        console.log(Namecoin.privateKey.toString('hex'));
        console.log(Namecoin.publicAddress);
        console.log(Namecoin.versions.public === coininfo('NMC').versions.public)

        console.log('DIGIBYTE');
        var Digibyte = CoinKey.createRandom(coininfo('DGB'));

        console.log(Digibyte.privateKey.toString('hex'));
        console.log(Digibyte.publicAddress);
        console.log(Digibyte.versions.public === coininfo('DGB').versions.public)
        
        //console.log(namecoins);
        console.log('Monacoin');
        var Monacoin = CoinKey.createRandom(coininfo('MONA'));

        console.log(Monacoin.privateKey.toString('hex'));
        console.log(Monacoin.publicAddress);
        console.log(Monacoin.versions.public === coininfo('MONA').versions.public)

        //console.log(namecoins);
        console.log('BLK');
        var BlackCoin = CoinKey.createRandom(coininfo('BLK'));

        console.log(BlackCoin.privateKey.toString('hex'));
        console.log(BlackCoin.publicAddress);
        console.log(BlackCoin.versions.public === coininfo('BLK').versions.public)

                        //console.log(namecoins);
        console.log('BTG');
        var Bitcoin_Gold = CoinKey.createRandom(coininfo('BTG'));

        console.log(Bitcoin_Gold.privateKey.toString('hex'));
        console.log(Bitcoin_Gold.publicAddress);
        console.log(Bitcoin_Gold.versions.public === coininfo('BTG').versions.public)

        //console.log(namecoins);
        console.log('Dash');
        var Dash = CoinKey.createRandom(coininfo('DASH'));

        console.log(Dash.privateKey.toString('hex'));
        console.log(Dash.publicAddress);
        console.log(Dash.versions.public === coininfo('DASH').versions.public)
        
        //console.log(namecoins2);
        console.log('DOGE');
        var ck = CoinKey.fromWif('QVD3x1RPiWPvyxbTsfxVwaYLyeBZrQvjhZ2aZJUsbuRgsEAGpNQ2')
        
        console.log(ck.privateKey.toString('hex')) // => c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a
        console.log(ck.publicAddress) // => DGG6AicS4Qg8Y3UFtcuwJqbuRZ3Q7WtYXv
        console.log(ck.compressed) // => true
        console.log(ck.versions.public === coininfo('DOGE').versions.public) // => true

        */
    }


}

/*
ar network = map[string]Network{
	"rdd": {name: "reddcoin", symbol: "rdd", xpubkey: 0x3d, xprivatekey: 0xbd},
	"dgb": {name: "digibyte", symbol: "dgb", xpubkey: 0x1e, xprivatekey: 0x80},
	"btc": {name: "bitcoin", symbol: "btc", xpubkey: 0x00, xprivatekey: 0x80},
	"ltc": {name: "litecoin", symbol: "ltc", xpubkey: 0x30, xprivatekey: 0xb0},
	"bch": {name: "bitcoin-cash", symbol: "bch", xpubkey: 0x6f, xprivatekey: 0xef},
	"doge": {name: "doge", symbol: "doge", xpubkey: 0x1e, xprivatekey: 0x9e},
	"dash": {name: "dash", symbol: "dash", xpubkey: 0x4c, xprivatekey: 0xcc},
	"mona": {name: "mona", symbol: "mona", xpubkey: 0x32, xprivatekey: 0xb0},
}
*/

module.exports = Altcoins;