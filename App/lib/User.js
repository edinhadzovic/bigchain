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
    return user;
  } catch (err) {
    console.log(err);
  }
};

module.exports = User;