import { PrivateKey } from 'digibyte';

const bitcoin = require('bitcoinjs-lib');

const bigi = require('bigi');

var sb = require('satoshi-bitcoin');

var bitcore_exp = require('bitcore-explorers').Insight;
var insight = new bitcore_exp('testnet');


class Bitcoin {

    // Change link to bitcoin info and price bitcoin
    constructor() 
    {
        this._explorerUrl = "https://digiexplorer.info";
        this._marketUrl = "https://api.coinmarketcap.com/v1/ticker";
        this._btc_privateKey = null;
        this._btc_address = null; 
        this._btc_standing = null;
    }

    generateAddress_and_PrivateKey() 
    {
        // More and less create a buffer from data, big big buffer

        var buffer = new Buffer(this._personal_information.first_name + this._personal_information.last_name
             + this._personal_information.birthday + this._personal_information.phone + this._email + this._password + this._address.street
             + this._address.city + this._address.state + this._address.postal_code + this._address.country + 'walletplus.io');
        var hash = bitcoin.crypto.sha256(buffer);
        var bigNum = bigi.fromBuffer(hash);

        // Testnet addressa 
        var testnet = bitcoin.networks.testnet;
        // We are doing the same thing just we are using testnet network instead of real one
        var keyPair = new bitcoin.ECPair(bigNum, null, {network: testnet});
        // WIF is a representation of private key !!!!!!!!!!!!!!!!
        var btc_privateKey = keyPair.toWIF();
        var btc_address = keyPair.getAddress();
        this._btc_address = btc_address;
        this._btc_privateKey = btc_privateKey;
        
    }

    send(amount, address, user)
    {
        insight.getUnspentUtxos(user.btc.btc_address, (err, utxos) => {
            if (err) {
                // Handle errors
            } else {
    
                var amountSatoshi = sb.toSatoshi(amount);
                var tx = bitcore.Transaction();
                tx.from(utxos);
                tx.to(address, amountSatoshi); // .0001 BTC
                tx.change(user.btc_address);
                tx.fee(10000);
                tx.sign(user.btc_privateKey);
                
                tx.serialize();
                console.log(tx.toObject());
    
                insight.broadcast(tx, (err, returnTxt)=> {
                    if (err) {
                        // Handle err
                    } else {
                        console.log('succesfully  sent bla bla ' + returnTxt);
                        res.send("SUCCESSFULLY SENT " + amount + "BTC to address " + address + "\n" + tx.serialize());
                        
                    }
                })
    
            }
        });
    }

    readStandingFromAddress(user){
        // procitati stanje sa adrese
    }
    
}