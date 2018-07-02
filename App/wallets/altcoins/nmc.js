
const altcoins = require('./altcoins');
let altcoin = new altcoins();

class Namecoin {

    constructor() 
    {
        this.private_key = null;
        this.address = null; 
        this.standing = null;
    }

    generatePrivateKeyandAddress() {
        let wallet = altcoin.generate_Namecoin();
        this.address = wallet._address;
        this.private_key = wallet._private_Key;
    
        console.log(this.address, this.private_key, wallet);
    }

    send(amount, address, wallet)
    {

    }

    readStandingFromAddress(wallet)
    {

    }
    
}

module.exports = Namecoin;