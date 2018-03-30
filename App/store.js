const bcryptjs = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const util = require('util');

var message = require('./lib/Message');
const directory = path.join(__dirname, '../temp');

// -------------------------------------
// TODO: Not sure is this going to work when we make executable
// We can always check number of files that we stored, if more less
// than 5 we can createa another user, but for now lets use some
// global by edin hated variables 
// -------------------------------------

// Max number of users
var user_count;


module.exports = {

	// Store function stors data in file
	store: function(data, callback){
		// ?? Should check how many users are already registered
		// if more then 5 leave with error
		let files = fs.readdirSync(directory);

		if(files.constructor !== Array) {
			throw({
				success: false,
				error: 'Wrong directory'
			});
		}

		user_count = files.length;

		if(user_count >= 5) {
			console.log(message.store, "MAX AMOUNT OF USERS " + user_count + " REACHED!");
			callback({
				error: true,
				error_type: 'Registration failed, login into existing accounts.'
			});
		}	
		else {
		    console.log(message.store, "Storing data into file /tmp/test");
		    
		    path_dir = path.join(__dirname, '../temp/test'+ user_count);
		    fs.writeFile(path_dir, util.inspect([data.email, data.password]), function(error) {
		    
		    if(error) {
		        return console.log(error);
		    }

		    user_count++;
			
			});
			callback(true);
		}

	},

	// Salt function starts encryption 
	salt: function(data, peper, callback){
		console.log(message.store, "Salt process...");
		var password = peper;
        bcryptjs.genSalt(10, (error, salt) => {
            bcryptjs.hash(password, salt, (error, hash) => {
				data.password = hash;
				callback(data);
            });
        });
	},


	// Pepper function does addition of input strings
	pepper: function(data){
		return new Promise((resolve, reject) => {
		console.log(message.store, "Starting with storing!");
		console.log(message.store, "Pepper process...");
		let peper = data.email + data.password;
		this.salt(data, peper, (data) => {
			this.store(data, (result) => {

				if (result != true) reject(result);
				if(result === true) resolve(result);
			});
		});
		})
	},


};