const digibyte = require('digibyte');
const request = require('request');

//constructor
const BigChain = function(address) {
    this._address = address;
    this._explorerUrl = 'https://digiexplorer.info';
    this._api_address_prefix = '/api/addr/';
    this._utxo = '/utxo';
}

BigChain.prototype.generatePrivateKey = function() {
    return new digibyte.PrivateKey();
}

BigChain.prototype.importWIFPrivateKey = function() {
    return new digibyte.PrivateKey.fromWIF();
}

BigChain.prototype.getWalletValue = function() {
    return new Promise((resolve, reject) => {
        request.get(this._explorerUrl + this._api_address_prefix + this._address, (err, res, body) => {
            if(err) reject(err);
            resolve(JSON.parse(body));
        });
    });
}

BigChain.prototype.getUnspentTransactionOutput = function(){
    return new Promise((resolve, reject) => {
        request.get(this._explorerUrl + this._api_address_prefix + this._address + this._utxo, (err, res, body) => {
            if(err) reject(err);
            resolve(JSON.parse(body));
        });
    })
}

module.exports = BigChain;