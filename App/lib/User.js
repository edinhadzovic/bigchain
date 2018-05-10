const bcryptjs = require('bcryptjs');
const error = require('./../error/error');
let verification = require('../verification');
let store = require('../store');
var message = require('./Message');
const btc = require ('./../wallets/btc');
const ltc = require ('./../wallets/ltc');
const eth = require('./../wallets/eth');
const market_price = require('./../wallets/market_price');

//_constructor
let User = function(){
  this._unique_id = null;
  this._email = null;
  this._password = null;
  this._personal_information = {
    first_name: null,
    last_name: null,
    gender: null,
    birthday: null,
    phone: null,
  };
  this._address = {
    street: null,
    city: null,
    state: null,
    postal_code: null,
    country: null,
  };
  this._profile_image = null;
  this._btc_wallet = new btc();
  this._ltc_wallet = new ltc();
  this._eth_wallet = new eth();
};

User.prototype.save = async function(user){
  let result = await store.new_store(user);
  if(!result) throw({success: false, message: "Something want wrong with storing the data."});
  return result;
};

User.prototype.checkArguments = async function(user){
  let result = await verification.verify(user);

  if(result.error === true) {
    throw(result);
  }

  //result should be true here.
  return result;
};

User.prototype.setPassword = function(password) {
  this._password = password;
};

User.prototype.getPassword = function(){
  return this._password;
}

User.prototype.generateUser = async function(user){
  try{
    let validation = await this.checkArguments(user);
    if(validation === true) {
      let new_user = {};
      new_user.success = true;
      let salt = bcryptjs.genSaltSync(10);
      this.setUser(user);      
      let hash = bcryptjs.hashSync(this.getPassword(), salt);
      this.setPassword(hash);
     // console.log(message.user,this);
      new_user.data = await this.save(this);      
     // console.log(message.user, user);
      return new_user;
    }
  } catch(err) {
    console.log(message.user, err);
    console.log(message.user, "Error event: ", err.type);
    return err;
  }
};

User.prototype.login = async function(data) {
  try { 
    let user = await store.read(data);
    console.log(message.user, 'Checking is password a correct...');
    let password_check = await bcryptjs.compare(data.password, user.user.password);
    if(!password_check) {
      return (error.ERR_PASSWORD_WRONG);
    } 
    // console.log(message.user, user);
    this.setUser(user.user);
    this.setPersonalInfo(user.user);
    this.setAdress(user.user);
    // TODO set address and profile image
    this.setImage(user.user);
    this.setBtc(user.user);
    this.setLtc(user.user);
    this.setEth(user.user);
    return true;
  } catch (err) {
    return err;
  }
};

User.prototype.format_personal_information_data = (data) => {
  return {
    personal_information : {
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      birthday: data.birthday,
      gender: data.gender,
    }
  }
};

User.prototype.personal_info_save = async function(current_user, data) {
  try {
    let result = await verification.personal_data(data);
    if (result.error === true) {
      return (result);
    }
    message.print(message.user, `${current_user}, ${data}`);
    let new_data = this.format_personal_information_data(data);
    this.setPersonalInfo(new_data);
   // console.log(message.user, current_user);
   // console.log(current_user);
    let res = await store.update(current_user);
    if (res === true) {
      return true;
    } 
  } catch (err) {
    return err;
  }
};


User.prototype.personal_info_change = async function(current_user, data) {
  try {
    // TODO: MB check is everyhitng valid before chaning just in case, but i'm not sure is that needed
    console.log("im here lets see where i go")
    let res = await store.update(current_user, data); 
    if (res === true) {
      this.setPersonalInfo(data);
      return true;
    } 

  } catch (err) {
    return err;
  }
};


// TODO: craete function address_restore
User.prototype.format_address_information_data = (data) => {
  return {
    address : {
      street: data.street,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      country: data.country,
    }
  }
};

User.prototype.address_info_save = async function(current_user, data) {
  try {
    let result = await verification.address_data(data);
    if (result.error === true) {
      return (result);
    } 
    let new_data = this.format_address_information_data(data);
    this.setAdress(new_data);    
    console.log(message.user, "saving address info");
    let res =  await store.update(current_user);
      if (res === true) {
      return true;
    } 
    return false;
  } catch (err) {
    return err;
  }
};

User.prototype.address_info_change = async function(current_user, data) {
  try {
    // TODO: Check mb?
    let res =  await store.change_address_data(current_user, data);
      if (res === true) {
      this.setAdress(data);
      return true;
    } 

  } catch (err) {
    return err;
  }
};

User.prototype.save_image = async function(current_user, data) {
  try {
    this.setImage(data);
    let res = await store.update(current_user);
    if(res === true) {
      return true;
    }
    return false;
  } catch (error) {
    return error;
  }
};

// TODO: craete function photo_restore

User.prototype.setUser = function(data) {
    if (data.email) {
      this._email = data.email;
    }
    if (data.password) {
      this._password = data.password;
    }
};

User.prototype.setPersonalInfo = function(data) {
    if (data.personal_information.first_name) {
      this._personal_information.first_name = data.personal_information.first_name;
    }
    if (data.personal_information.last_name) {
      this._personal_information.last_name = data.personal_information.last_name;
    }
    if (data.personal_information.gender) {
      this._personal_information.gender = data.personal_information.gender;
    }
    if (data.personal_information.birthday) {
      this._personal_information.birthday = data.personal_information.birthday;
    }
    if (data.personal_information.phone) {
      this._personal_information.phone = data.personal_information.phone;
    }
};

User.prototype.setAdress = function(data) {
    if (data.address.street) {
        this._address.street = data.address.street;
      }
      if (data.address.city) {
        this._address.city = data.address.city;
      }
      if (data.address.state) {
        this._address.state = data.address.state;
      }
      if (data.address.postal_code) {
        this._address.postal_code = data.address.postal_code;
      }
      if (data.address.country) {
        this._address.country = data.address.country;
      }
};

User.prototype.setImage = function(data) {
      if (data.profile_image) {
      this._profile_image = data.profile_image;
    }
};


User.prototype.setBtc = async function(data) {

  this._btc_wallet._btc_address = data._btc_wallet._btc_address;
  this._btc_wallet._btc_privateKey = data._btc_wallet._btc_privateKey;
};

User.prototype.setLtc = async function(data) {

  this._ltc_wallet._ltc_address = data._ltc_wallet._ltc_address;
  this._ltc_wallet._ltc_privateKey = data._ltc_wallet._ltc_privateKey;
};

User.prototype.setEth = async function(data) {

  this._eth_wallet._eth_address = data._eth_wallet._eth_address;
  this._eth_wallet._eth_privateKey = data._eth_wallet._eth_privateKey;
};

User.prototype.generate_wallets = async function() {
  return new Promise((resolve, reject) => {
    if(this._btc_wallet._btc_privateKey === null) {
      //generate address
      this._btc_wallet.generateAddress_and_PrivateKey(this);
      this._ltc_wallet.generateAddress_and_PrivateKey(this);
      this._eth_wallet.generateAddress_and_PrivateKey(this);
      this.setBtc(this);
      this.setLtc(this);
      this.setEth(this);
      console.log(this._btc_wallet);
      console.log(this._ltc_wallet);
      console.log(this._eth_wallet);

      let res = store.update(this); 
      resolve(true);
    }
    reject(false);
  });
};

module.exports = User;