// HI boys lets start with ethereum wallet and transaction
// Ethereum related require 
// ----------------

var sb = require('satoshi-bitcoin');
var request = require('request');
var ethers = require('ethers');
var Wallet = ethers.Wallet;
var utils = ethers.utils;
var providers = ethers.providers;
//console.log(providers.networks);

class Ethereum {

    // Change link to bitcoin info and price bitcoin
    constructor() 
    {
        this.private_key = null;
        this.address = null; 
        this.standing = null;
    }

    generateAddress_and_PrivateKey(user) 
    {
        let wallet = Wallet.createRandom();
        this.private_key = wallet.privateKey;
        this.address = wallet.address;
    }

    send(amount, address, wallet) {
        console.log(wallet);
        // let data = providers.getDefaultProvider(true);
        // console.log(data);
        let new_wallet = new Wallet(wallet.private_key, 'mainnet');
        // new_wallet.provider
        // var gasPrice = (new_wallet.provider.testnet ? 0x4a817c800: 0xba43b7400);
        new_wallet.provider = providers.getDefaultProvider({ chainId: 3,
            ensAddress: '0x112234455c3a32fd11230c42e7bccd4a84e02010',
            name: 'mainnet' });
       
        // console.log(new_wallet.provider);

        new_wallet.send("0x9dfdaC421E18A89d26b4AE7C88f4d4f97bDCf435", utils.parseEther("0.05"), {
            gasPrice: 0x4a817c800,
            gasLimit: 21000
        }).then((txId) => {
            console.log(txId);
        }).catch(e => console.log(e));
        
        // var transaction = {
        //     nonce: 0,
        //     gasLimit: 21000,
        //     gasPrice: utils.bigNumberify("20000000000"),
        
        //     to: "0x9dfdaC421E18A89d26b4AE7C88f4d4f97bDCf435",
        
        //     value: utils.parseEther("0.05"),
        //     data: "0x",
        
        //     // This ensures the transaction cannot be replayed on different networks
        //     chainId: 3
        
        // };

        // let tx = new_wallet.sign(transaction);
        // console.log(tx);
        // var provider = providers.getDefaultProvider(false);
        // console.log("2");
        // provider.sendTransaction(tx).then((hash) => {
        //     console.log(hash);
        // }).catch(e => console.log(e));
    }

    readStandingFromAddress(wallet){
        let address = `https://api.blockcypher.com/v1/eth/main/addrs/${wallet.address}/balance`; 
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