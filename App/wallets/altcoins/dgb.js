const Digibyte = require('digibyte');
const Request = require('request');
const Error = require('./../error/error');

const altcoins = require('./altcoins');
let altcoin = new altcoins();

class DGB {

  constructor() {
    this.private_key = null;
    this.address = null; 
    this.standing = null;
  }

  generatePrivateKeyandAddress() {
    let wallet = altcoin.generate_Digibyte();
    this.address = wallet._address;
    this.private_key = wallet._private_Key;

    console.log(this.address, this.private_key, wallet);
  }

  getWalletValue(address) {
    return new Promise((resolve, reject) => {
      Request.get(this.explorerUrl + "/api/addr/" + address, (err, response, body) => {
        if(err) reject(Error.ERR_GETTING_WALLET_VALUE);
        
        resolve(JSON.parse(body));
      });
    });
  }

  /**
   * 
   * @param {String} address to check UTXO information
   */
  getUnspentTransactionOutput(address) {
    return new Promise((resolve, reject) => {
      Request.get(this.explorerUrl + "/api/addr/" + address + "/utxo", (error, response, body) => {
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
            "url": this.explorerUrl + "/api/tx/send",
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

  createAndSendTransaction(sourcePrivateKey, sourceAddress, destinationAddress, satoshis) {
    return new Promise((resolve, reject) => {
        getUnspentTransactionOutput(sourceAddress).then(utxos => {
            if(utxos.length == 0) {
                reject({ "message": "The source address has no unspent transactions" });
            }
            var changePrivateKey = new DigiByte.PrivateKey();
            var changeAddress = changePrivateKey.toAddress();
            var transaction = new DigiByte.Transaction();
            for(var i = 0; i < utxos.length; i++) {
                transaction.from(utxos[i]);
            }
            transaction.to(destinationAddress, satoshis);
            transaction.change(changeAddress);
            transaction.sign(sourcePrivateKey);
            this.sendTransaction(transaction).then(result => {
                resolve(Object.assign(result, {
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
}

module.exports = DGB;