const bcryptjs = require('bcryptjs');
const error = require('./../error/error');
let verification = require('../verification');
let data_encryption = require('../store');
var message = require('./Message');

//_constructor
let User = function(){};


User.prototype.save = async function(user){
  let result = await data_encryption.pepper(user);
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
    console.log(message.user, "Error event: ", err.error_type);
    return err;
  }
};

User.prototype.login = async function(data) {
  try { 
    let user = await data_encryption.read(data);
    let password_check = await bcryptjs.compare(data.password, user.user.password);
    if(!password_check) {
      return (error.ERR_PASSWORD_WRONG);
    } 
    return user;
  } catch (err) {
    return err;
  }
};

module.exports = User;