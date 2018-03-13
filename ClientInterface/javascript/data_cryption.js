const bcryptjs = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const util = require('util');

// -------------------------------------
// TODO: Not sure is this going to work when we make executable
// We can always check number of files that we stored, if more less
// than 5 we can createa another user, but for now lets use some
// global by edin hated variables 
// -------------------------------------

// Max number of users
var user_count = 0;


module.exports = {

	store: function(data, isStored, err, ret){
		if(user_count >= 5) {
			console.log("MAX AMOUNT OF USERS " + user_count);
			err.push("Max number of users reached, login into existing ones");
			ret();
		}
		else {
		    console.log("Storing data into file /tmp/test");
		    
		    path_dir = path.join(__dirname, '../../temp/test'+ user_count);
		    fs.writeFile(path_dir, util.inspect([data.email, data.password]), function(error) {
		    
		    if(error) {
		        return console.log(error);
		    }

		    // No error during the whole process, return positive
		    isStored = 1;
		    user_count ++;
			
			});
			ret();
		}

	},
	salt: function(data, peper, isStored, err, ret){
		// start with cryption
		console.log("Salt process...");
		var password = peper;
        bcryptjs.genSalt(10, (error, salt) => {
            bcryptjs.hash(password, salt, (error, hash) => {
                data.password = hash;
                this.store(data, isStored, err, ret);
            });
        });
	},

	pepper: function(data, isStored, err, ret){
		// starting process
		// append data.username to data.password first
		// doing it automatically  without pepper-mint moodul
		console.log("Starting with storing!");
		console.log("Pepper process...");
		let peper = data.email + data.password;
		this.salt(data, peper, isStored, err, ret);
	},

	returnTomain: function(){
		return;
	}

};