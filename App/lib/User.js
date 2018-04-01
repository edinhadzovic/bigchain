const bcryptjs = require('bcryptjs');
const error = require('./../error/error');
let verification = require('../verification');
let store = require('../store');
var message = require('./Message');

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
};

User.prototype.save = async function(user){
  let result = await store.pepper(user);
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

User.prototype.generateUser = async function(user){
  try{
    let validation = await this.checkArguments(user);
    if(validation === true) {
      let new_user = {};
      new_user.success = true;
      new_user.data = await this.save(user);      

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
    this.setUser(user.user);
    this.setPersonalInfo(user.user);
    // TODO set address and profile image
    return true;
  } catch (err) {
    return err;
  }
};

User.prototype.personal_info_restore = async function(current_user, data) {
  try {
    let result = await verification.personal_data(data);
    if (result.error === true) {
      return (result);
    }
    let res = await store.store_personal_info(current_user, data);
    if (res === true) {
      console.log(message.user, " ", data);
      this.setPersonalInfo(data);
      return true;
    } 

  } catch (err) {
    return err;
  }
};

// TODO: craete function address_restore

// TODO: craete function photo_restore

User.prototype.setUser = function(data) {
    if (data.email !== null) {
      this._email = data.email;
    }
    if (data.password !== null) {
      this._password = data.password;
    }
};

User.prototype.setPersonalInfo = function(data) {
    if (data.first_name !== null) {
      this._personal_information.first_name = data.first_name;
    }
    if (data.last_name !== null) {
      this._personal_information.last_name = data.last_name;
    }
    if (data.gender !== null) {
      this._personal_information.gender = data.gender;
    }
    if (data.birthday !== null) {
      this._personal_information.birthday = data.birthday;
    }
    if (data.phone !== null) {
      this._personal_information.phone = data.phone;
    }
};

User.prototype.setAdress = function(data) {
    if (data.street !== null) {
        this._address.street = data.street;
      }
      if (data.city !== null) {
        this._address.city = data.city;
      }
      if (data.state !== null) {
        this._address.state = data.state;
      }
      if (data.postal_code !== null) {
        this._address.postal_code = data.postal_code;
      }
      if (data.country !== null) {
        this._address.country = data.country;
      }
};

User.prototype.setPhoto = function(data) {
      if (data.profile_image !== null) {
      this._profile_image = data.profile_image;
    }
};

module.exports = User;