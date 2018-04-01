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
    return user;
  } catch (err) {
    return err;
  }
};

User.prototype.restore = async function(current_user, data) {
  try {
    let result = await verification.personal_data(data);
    if (result.error === true) {
      return (result);
    }
    let res = await store.restore(current_user, data);
    if (res === true) {
      return (true);
    } else {
      return (res);
    }

  } catch (err) {
    return err;
  }
}

module.exports = User;