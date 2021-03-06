
const altcoins = require('./altcoins');
const {toSato} = require('./../../lib/utils');
const Request = require('request');
const Error = require('./../../error/error');

let altcoin = new altcoins();

class Bitcoin_Gold {

    constructor() 
    {
        this.private_key = null;
        this.address = null; 
        this.standing = null;
        this.explorerUrl = "https://btgexplorer.com/api/";
    }

    generatePrivateKeyandAddress() {
        let wallet = altcoin.generate_BitcoinGold();
        this.address = wallet._address;
        this.private_key = wallet._private_Key;
    
        //console.log(this.address, this.private_key, wallet);
    }

    getUnspentTransactionOutput(address) {
        return new Promise((resolve, reject) => {
            Request.get(`${this.explorerUrl}api/addr/${address}/utxo`, (error, response, body) => {
                if(error) {
                    reject(error);
                }
                resolve(JSON.parse(body));
            });
        });
    }

    /**
     * 
     * @param {Object} transaction 
     */
    sendTransaction(transaction) {
        return new Promise((resolve, reject) => {
            Request.post({
                "headers": { "content-type": "application/json" },
                "url": `${this.explorerUrl}tx/send`,
                "body": JSON.stringify({
                    "rawtx": transaction.serialize()
                })
            }, (error, response, body) => {
                if(error) {
                    reject(error);
                }
                resolve(JSON.parse(body));
            });
        });
    }

    createAndSendTransaction(amount, address, wallet)
    {
    
        return new Promise((resolve, reject) => {
            this.getUnspentTransactionOutput(wallet.address).then(utxos => {
                console.log(utxos);
                if(utxos.length == 0) {
                    reject({ "message": "The source address has no unspent transactions" });
                }
                for(var i = 0; i < utxos.length; i++) {
                    transaction.from(utxos[i]);
                }
                transaction.to(address, toSato(amount));
                transaction.change(wallet.address);
                transaction.sign(wallet.private_key);
                this.sendTransaction(transaction).then(result => {
                    resolve(Object.assign(result, {
                        // upitan je dio

                        "source_private_key": sourcePrivateKey.toWIF(),
                        "source_address": sourceAddress,
                        "change_private_key": changePrivateKey.toWIF(),
                        "change_address": changeAddress,
                        "destination_address": destinationAddress,
                        "sent_amount": satoshis
                    }));
                }, error => {
                    reject(error);
                });
            }, error => {
                reject(error);
            });
        });
    }

    readStandingFromAddress(wallet)
    {
        console.log(wallet);
        return new Promise((resolve, reject) => {
            Request.get(`${this.explorerUrl}addr/${wallet.address}`, (err, response, body) => {

                if(err){console.log(err); reject(Error.ERR_GETTING_WALLET_VALUE);} 
                console.log("Success", body);
                
                resolve(JSON.parse(body));
            });
        });
    }
    
}

module.exports = Bitcoin_Gold;