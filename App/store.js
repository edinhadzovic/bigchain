const bcryptjs = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const util = require('util');

const error = require('./error/error');
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
	formatData: function(user) {
		console.log(message.store, user);
		return {
			unique_id: user._unique_id,
			email: user._email,
			password: user._password,
			personal_information: {
				first_name: user._personal_information.first_name,
				last_name: user._personal_information.last_name,
				gender: user._personal_information.gender,
				birthday: user._personal_information.birthday,
				phone: user._personal_information.phone,
			},
			address: {
				street: user._address.street,
				city: user._address.city,
				state: user._address.state,
				postal_code: user._address.postal_code,
				country: user._address.country,
			},
			profile_image: user._profile_image
		};
	},

	read: function(user) {
		return new Promise((resolve, reject) => {
			console.log(message.store, 'Checking is user registered...')
			let found = false;
			fs.readdir(directory, (err, files) => {
				if(err) reject(error.ERR_DB_READING);

				files.forEach(element => {
					let file = fs.readFileSync(directory + '/' + element, 'utf8');
					var result = JSON.parse(file);

					if(user.email === result._email){
						found = true;
						let data = {};
						data.success = found;
						data.user = this.formatData(result);
						console.log(message.store, data);
						resolve(data);
					}
				});
				if(!found) reject(error.ERR_NOT_VALID_EMAIL);
			});
		});
	},

	new_store: function(user) {
		return new Promise((resolve, reject) => {
			//reading file directory
			let files = fs.readdirSync(directory);

			if(files.constructor !== Array) {
				reject(error.ERR_DB_STORING);
			}

			user_count = files.length;

			if(user_count >= 1) reject(error.ERR_MAX_USER);

			message.print(message.store, "Start to store data into a File");

			path_file = path.join(__dirname, '../temp/test'+ user_count);

			delete user.password_rep;

			try {
				fs.writeFileSync(path_file, JSON.stringify(user));
				resolve(true);			
			} catch (error) {
				reject(error);
			}
		});
	},

	update: function(current_user) {
		return new Promise((resolve, reject) => {
			message.print(message.store, "updating data");
			console.log(current_user);
			let found = false;
			fs.readdir(directory, (err, files) => {
				if(err) reject(error.ERR_DB_READING);

				files.forEach(element => {
					let file = fs.readFileSync(directory + '/' + element, 'utf8');
					var result = JSON.parse(file);
					console.log(result);
					if(current_user._email === result._email){
						console.log("hollllaaaaa");
						found = true;
						try {
							fs.writeFileSync(directory + '/' + element, JSON.stringify(current_user));
							resolve(true);
						} catch (e) {
							reject(error.ERR_DB_STORING)
						}
					}
				});
				if(!found) reject(error.ERR_NOT_VALID_EMAIL);
			});
		});
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
		let peper = data._password;
		this.salt(data, peper, (data) => {
			this.new_store(data).then((res) => {
				resolve(res);
			}).catch(e => reject(e));
			});
		})
	},
};