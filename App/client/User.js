
let User = function(data){
  this._status = 0;
  this._email = data.email;
};

User.prototype.status = function(){
  console.log(this._email);
  console.log(this._status);
};

User.prototype.getEmail = function() {
  return this._email;
};


module.exports = User;