const litecore = require('litecore-lib');
const request = require('request');

const bigi = require('bigi');

var explorers = require('litecore-explorers');
var insight = new explorers.Insight();
 
var exc = require('cryptocurrency-unit-convert');

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

        var ltc_privateKey = new litecore.PrivateKey(bigNum, 'testnet');
        var ltc_address = ltc_privateKey.toAddress('testnet');
        console.log(ltc_address);
        console.log(ltc_privateKey);
        this._ltc_address = ltc_address.toString();
        this._ltc_privateKey = ltc_privateKey.toString();
 
    }

    /**
     * 
     * @param {String} addr 
     * @returns {Array}  
     */
    getUTXOs(addr) {
        let address = `https://testnet.litecore.io/api/addr/${addr}/utxo`;

        return new Promise((resolve, reject) => {
            request({url: address, json: true},(err, res, body)=> {
                if(err) reject(err);
                resolve(body);
            })
        });
    }

    broadcastTransaction(rawtx) {
        return new Promise((resolve, reject) => {
                request({
                  url: 'https://testnet.litecore.io/api/tx/send',
                  method: 'POST',
                  json: {
                    rawtx
                  }
                },
                  (error, response, body) => {
                    if(error) reject(error);
                    resolve(body.txid)
                  }
                )
        });
    }

    send(amount, address, wallet) {

        this.getUTXOs(wallet._ltc_address).then((utxos) => {
            let tx = litecore.Transaction()
                .from(utxos)
                .to(address, 800000)
                .change(wallet._ltc_address)
                .sign(wallet._ltc_privateKey)
                .serialize();
            console.log(tx);
            this.broadcastTransaction(tx).then((result) => {
                console.log(result, " sfafasgasga");
            }).catch(e => console.log(e)); 

        }).catch(e => console.log(e)); 

       /* insight.getUnspentUtxos(wallet._ltc_address, (err, utxos) => {
            if (err) {
                // Handle errors
            } else {
    
                var amountSatoshi = exc.convertLTC(amount,'ltc','satoshi');
                console.log(amountSatoshi);
                var tx = bitcore.Transaction();
                tx.from(utxos);
                tx.to(address, amountSatoshi); // .0001 BTC
                tx.change(wallet.ltc_address);
                tx.fee(10000);
                tx.sign(wallet._ltc_privateKey);
                
                tx.serialize();
                console.log(tx.toObject());
    
                insight.broadcast(tx, (err, returnTxt)=> {
                    if (err) {
                        // Handle err
                    } else {
                        console.log('succesfully  sent bla bla ' + returnTxt);                    
                    }
                });

            }
        });*/
    }
    

    readStandingFromAddress(wallet){
        let address = `https://testnet.litecore.io/api/addr/${wallet._ltc_address}/utxo`    
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