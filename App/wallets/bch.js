const bch = require('bitcoincashjs');
const explorers = require('bitcore-explorers')
const insight = new explorers.Insight('https://insight.bitpay.com')
var sb = require('satoshi-bitcoin');
const request = require('request');
const bs58 = require('bs58');
const {toSato} = require('./../lib/utils');
const market_price = require('./market_price');

let Bitcoincash = function(){
    this.name = "Bitcoin Cash";
    this.symbol = "bch";
    this.private_key = null;
    this.address = null;
    this.balance = null;
    this.market_price = null;
};


Bitcoincash.prototype.generateAddress_and_PrivateKey = async function(user){
    return new Promise(async (resolve, reject) => {
        const buffer = new Buffer(JSON.stringify(user) + "bitcoincash", 'hex');
        const hash = bch.crypto.Hash.sha256(buffer);
        const bn = bch.crypto.BN.fromBuffer(hash);
        var testnet = bch.Networks.testnet;
        // var private_key = new bch.PrivateKey(bn, 'livenet');
        var private_key = new bch.PrivateKey(bn, 'testnet');
        this.private_key = private_key.toWIF();
        this.address = private_key.toAddress('testnet').toString();
        this.balance = await this.readStandingFromAddress(this);
        this.market_price = await market_price.getBchPrice();
        resolve(true);
    });
};

Bitcoincash.prototype.unspendUTXOS = function(address) {
    let url = `https://insight.bitpay.com/api/addrs/${address}/utxo`;

    return new Promise((resolve, reject) => {
        request.get(url, function(err, res, body){
            if(err) {
                reject(err);
            }
            
            resolve(JSON.parse(body));
        });
    }); 
};

Bitcoincash.prototype.send = function(amount, address, wallet){
    if(amount < 0){
        console.log("Error, amount smaller than 0");
        return 
    }
    let key = this.private_key;
    let change = wallet.address;
    let toAddress = address;
    let satoshis = amount / 100000000;
    insight.getUnspentUtxos(this.address, function (error, utxos) {
        if (error) {
          console.error(error);
          return;
        }
        
        let new_utxos = [];
        for(let utxo of utxos) {
            new_utxos.push({
                txid: utxo.txid,
                outputIndex: utxo.vout,
                script: utxo.scriptPubKey,
                satoshis: utxo.satoshis
            });
        }
        
        const transaction = new bch.Transaction()
          .from(new_utxos)
          .to(toAddress, satoshis)
          .change(change)
          .sign(key)
          .serialize();
      
        console.log(transaction.toString()); // 01000000011b8a4185...
        insight.broadcast(transaction, (err, txIndex) => {
            if(err) {
                
            } else {
                console.log("success!!!!!!!!!!!!1", txIndex);
            }
        });
    });
};

Bitcoincash.prototype.readStandingFromAddress = function(wallet) {
    return new Promise(async (resolve, reject) => {
       let utxos = await this.unspendUTXOS(wallet.address);
    //    if(utxos.length === 0) {
    //        reject({
    //         succes: false,
    //         msg: "utxos failed"
    //     });
    //    }

       let satoshis = 0;
       for(let transfer of utxos) {
           satoshis += transfer.satoshis;
       }
       resolve(sb.toBitcoin(satoshis));
    });
};

module.exports = Bitcoincash;