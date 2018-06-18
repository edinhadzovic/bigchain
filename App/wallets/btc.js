const bitcoin = require('bitcoinjs-lib');
const bitcore = require('bitcore-lib');

const bigi = require('bigi');
const {toSato} = require('./../lib/utils');
var sb = require('satoshi-bitcoin');

var bitcore_exp = require('bitcore-explorers').Insight;
var insight = new bitcore_exp('mainnet');

class Bitcoin {

    // Change link to bitcoin info and price bitcoin
    constructor() 
    {
        this.private_key = null;
        this.address = null; 
        this.standing = null;
    }

    generateAddress_and_PrivateKey(user) 
    {
        // More and less create a buffer from data, big big buffer

        var buffer = new Buffer(JSON.stringify(user) + 'walletplus.io' + 'bitcoinstring');
        var hash = bitcoin.crypto.sha256(buffer);
        var bigNum = bigi.fromBuffer(hash);

        // Testnet addressa 
        // Normal address var keyPair = new bitcoin.ECPair(bigNum);
        var testnet = bitcoin.networks.testnet;
        // We are doing the same thing just we are using testnet network instead of real one
        var keyPair = new bitcoin.ECPair(bigNum, null, {network: bitcoin.networks.mainnet});
        // WIF is a representation of private key !!!!!!!!!!!!!!!!
        var btc_privateKey = keyPair.toWIF();
        var btc_address = keyPair.getAddress();
        this.address = btc_address;
        this.private_key = btc_privateKey;
        
    }

    send(amount, address, wallet)
    {
        if(amount < 0){
            console.log("Error, amount smaller than 0");
            return 0;
        }
        insight.getUnspentUtxos(wallet.address, (err, utxos) => {
            if (err) {
                // Handle errors
            } else {
                var amountSatoshi = toSato(amount);
                var tx = bitcore.Transaction();
                tx.from(utxos);
                tx.to(address, amountSatoshi); // .0001 BTC
                tx.change(wallet.address);
                tx.fee(10000);
                tx.sign(wallet.private_key);
                
                tx.serialize();
                console.log(tx.toObject());
    
                insight.broadcast(tx, (err, returnTxt)=> {
                    if (err) {
                        // Handle err
                    } else {
                        console.log('succesfully Transaction Id ' + returnTxt);                    
                    }
                });
            }
        });
    }

    readStandingFromAddress(wallet){
        return new Promise((resolve, reject) => {
            insight.getUnspentUtxos(wallet.address, function(err, utxos) {
                let satoshis = 0;
                // Complete object
                // console.log("btc", utxos);
                for(let transfer of utxos) {
                    satoshis = satoshis + transfer.satoshis;
                }
                resolve(sb.toBitcoin(satoshis));
            });
        });
    }
    
}


module.exports = Bitcoin;