const altcoins = require('./altcoins');
const {toSato} = require('./../../lib/utils');
const Request = require('request');
const Error = require('./../../error/error');

let altcoin = new altcoins();

class Blackcoin {

    constructor() 
    {
        this.private_key = null;
        this.address = null; 
        this.standing = null;
    }

    generatePrivateKeyandAddress() {
        let wallet = altcoin.generate_Blackcoin();
        this.address = wallet._address;
        this.private_key = wallet._private_Key;
    
        //console.log(this.address, this.private_key, wallet);
    }

    getUnspentTransactionOutput(address) {
        return new Promise((resolve, reject) => {
            Request.get("https://node.blackcoin.io/insight-api/addr/" + address + "/utxo", (error, response, body) => {
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
                "url": "https://node.blackcoin.io/insight-api/tx/send/",
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
        // https://node.blackcoin.io/insight-api/addr/BAsSdPKxEbhnuhYXHnPPdE7GBvB9DkzRe6
        // https://node.blackcoin.io/insight-api/addr/BAsSdPKxEbhnuhYXHnPPdE7GBvB9DkzRe6/utxo[?noCache=1]
        // https://node.blackcoin.io/insight-api/rawtx/525de308971eabd941b139f46c7198b5af9479325c2395db7f2fb5ae8562556c
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
        return new Promise((resolve, reject) => {
            Request.get("https://node.blackcoin.io/insight-api/addr/" + wallet.address + "/balance", (err, response, body) => {
                if(err) reject(Error.ERR_GETTING_WALLET_VALUE);
                console.log(body);
                resolve(JSON.parse(body));
            });
            });
    }
    
}

module.exports = Blackcoin;