const litecore = require('litecore-lib');
const request = require('request');

const bigi = require('bigi');

var sb = require('satoshi-bitcoin');

var explorers = require('litecore-explorers');
var insight = new explorers.Insight();
 

// balance
var balance = require('crypto-balances');

// --------------------------
// Creating of Litecoin address
// Tested on https://live.blockcypher.com/ -- working...
// TODO: Check is address already in use, is address valid, how transaction is done
// --------------------------

class Litecoin {

    // Change link to bitcoin info and price bitcoin
    constructor() 
    {
        this._ltc_market_price = null;
        this._ltc_privateKey = null;
        this._ltc_address = null; 
        this._ltc_standing = null;
    }

    generateAddress_and_PrivateKey(user) 
    {
        // More and less create a buffer from data, big big buffer

        var buffer = new Buffer(JSON.stringify(user) + 'walletplus.io' + 'litecoinstring');
        var hash = litecore.crypto.Hash.sha256(buffer);
        var bigNum = litecore.crypto.BN.fromBuffer(hash);

        // Testnet addressa USE LITECOIN AFTER THE TESTING, SAME CREATION FOR LITECOIN
        // -------------------------------------------
        // var litecoin = bitcoin.networks.litecoin
        // -------------------------------------------
        // We are doing the same thing just we are using testnet network instead of real one

        var ltc_privateKey = new litecore.PrivateKey(bigNum, 'livenet');
        var ltc_address = ltc_privateKey.toAddress('testnet');
        console.log(ltc_address);
        console.log(ltc_privateKey);
        this._ltc_address = ltc_address.toString();
        this._ltc_privateKey = ltc_privateKey.toString();
 
    }

    /*
    send(amount, address, wallet)
    {
        insight.getUnspentUtxos(wallet._btc_address, (err, utxos) => {
            if (err) {
                // Handle errors
            } else {
    
                var amountSatoshi = sb.toSatoshi(amount);
                var tx = bitcore.Transaction();
                tx.from(utxos);
                tx.to(address, amountSatoshi); // .0001 BTC
                tx.change(wallet._btc_address);
                tx.fee(10000);
                tx.sign(wallet._btc_privateKey);
                
                tx.serialize();
                console.log(tx.toObject());
    
                insight.broadcast(tx, (err, returnTxt)=> {
                    if (err) {
                        // Handle err
                    } else {
                        console.log('succesfully  sent bla bla ' + returnTxt);                    
                    }
                });ddress: LZY1k9q68doG66hC1oUesebhumNNbi6qyk, type: pubkeyhash, network: livenet>

            }
        });
    }
    */

    readStandingFromAddress(wallet){
        let address = `https://testnet.litecore.io/api/addr/${wallet._ltc_address}/utxo`
        console.log(address);
        let litecoin = 0;
        return new Promise((resolve, reject) => {
            request({url: address, json: true},(err, res, body)=> {
                if(err) reject(err);
                for (let transfer of  body) {
                    litecoin += transfer.amount;
                }       
                resolve(litecoin);
            })
        });
    }

}

module.exports = Litecoin;