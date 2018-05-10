// HI boys lets start with ethereum wallet and transaction
// Ethereum related require 
// ----------------

var sb = require('satoshi-bitcoin');
var request = require('request');
//const bigi = require('bigi');


const eth_util = require('ethereumjs-util')
const keythereum = require("keythereum");
const EthereumTx = require('ethereumjs-tx')
const ethers = require('ethers');


// for hash
const createKeccakHash = require("keccak/js");

class Ethereum {

    // Change link to bitcoin info and price bitcoin
    constructor() 
    {
        this._eth_privateKey = null;
        this._eth_address = null; 
        this._eth_standing = null;
    }

    generateAddress_and_PrivateKey(user) 
    {
        let eth_address;
        let eth_privateKey;

        var buffer = keythereum.str2buf(JSON.stringify(user) + 'walletplus.io' + 'ethereumstring');
        var hash = createKeccakHash('keccak256').update(buffer).digest();

        var params = {keyBytes: 32, ivBytes: 16 };
        var dk = keythereum.create(params);
        console.log(dk);

        let pbkdf2 = {
            c:262144, 
            dklen: 32, 
            hash:"keccak256",
            prf: "hmac-sha256"
        };
        // Export object with everything hash, address and some other stuff we have no use to now.
        var keyObject = keythereum.dump(hash, dk.privateKey, dk.salt, dk.iv, pbkdf2);
        console.log(keyObject);
        
        eth_privateKey = dk.privateKey;
        console.log('Is private key valid: ', eth_util.isValidPrivate(eth_privateKey));
        // Create checksum address from address
        eth_address = eth_util.toChecksumAddress(keyObject.address);
        console.log('Is address valid: ', eth_util.isValidAddress(eth_address));
        console.log('Is address checksum valid: ', eth_util.isValidChecksumAddress(eth_address));

        if (eth_util.isValidPrivate(eth_privateKey) && eth_util.isValidAddress(eth_address) && eth_util.isValidChecksumAddress(eth_address)) {
            this._eth_address = eth_address;
            this._eth_privateKey = eth_util.baToJSON(eth_privateKey); // toString('hex'); optional
            console.log("EVeryhitng went well bla bal bla", this._eth_address, this._eth_privateKey);
        }
        
    }

    send(amount, address, wallet) {

        let messageBuffer = new Buffer('hi');
        var amountSatoshi = sb.toSatoshi(amount);
        /*

            data.chainId Number EIP 155 chainId - mainnet: 1, ropsten: 3
            data.gasLimit Buffer transaction gas limit
            data.gasPrice Buffer transaction gas price
            data.to Buffer to the to address
            data.nonce Buffer nonce number
            data.data Buffer this will contain the data of the message or the init of a contract
            data.v Buffer EC recovery ID
            data.r Buffer EC signature parameter
            data.s Buffer EC signature parameter
            data.value Buffer the amount of ether sent

        
       let gasPrice = 100000;
       let gasLimit = 500000;
        const txParams = {
            nonce: '0x00',
            gasPrice: '0x4800', 
            gasLimit: '0x0',
            to: address,
            data: messageBuffer,
            value: amountSatoshi, 
            // EIP 155 chainId - mainnet: 1, ropsten: 3 ROPSTEN IS USED AS TESTNET 
            chainId: 3
        }


        const tx = new EthereumTx(txParams);
        console.log(eth_util.toBuffer(wallet._eth_privateKey));

        var feeCost = tx.getUpfrontCost()
        tx.gas = feeCost.toString('hex');

        tx.sign(eth_util.toBuffer(wallet._eth_privateKey));
        const serializedTx = tx.serialize();
        console.log(serializedTx.toString('hex')); 
        */

       var Wallet = ethers.Wallet;
       var utils = ethers.utils;
       var wall = new ethers.Wallet(eth_util.toBuffer(wallet._eth_privateKey));

        var transaction = {
            nonce: 0,
            gasLimit: 21000,
            gasPrice: utils.bigNumberify("20000000000"),
        
            to: address,
        
            value: utils.parseEther(amount),
            data: "0x",
            // This ensures the transaction cannot be replayed on different networks
            chainId: 3
        };

        var signedTransaction = wall.sign(transaction);
        console.log(wall);
        var transaction = Wallet.parseTransaction(signedTransaction);
        console.log(signedTransaction);
        console.log(transaction);
        
    }

    readStandingFromAddress(wallet){
        let address = `https://api.blockcypher.com/v1/eth/main/addrs/${wallet._eth_address}/balance`; 
        let ethereum;
        return new Promise((resolve, reject) => {
            request({url: address, json: true},(err, res, body)=> {
                if(err) reject(err);
                // BODY RETURNS WHOLE TRANSACTION SECTION AND BALANCE AND OTHER STUFF
                // console.log(body);   
                ethereum = body.balance;      
                resolve(ethereum);
            })
        });
    }
    
}


module.exports = Ethereum;