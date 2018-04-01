
let User = function(data){
  this._state = 0;
  this._email = data.email;
};

User.prototype.status = function(){
  console.log(this._email);
  console.log(this._state);
};

User.prototype.setState = function(state) {
  this._state = state;
};

User.prototype.getState = function() {
  return this._state;
};

User.prototype.getEmail = function() {
  return this._email;
};


module.exports = User;