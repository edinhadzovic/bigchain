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

	read: function(user) {
		return new Promise((resolve, reject) => {
			console.log(message.store, 'Checking is user registered...')
			let found = false;
			fs.readdir(directory, (err, files) => {
				if(err) reject(error.ERR_DB_READING);

				files.forEach(element => {
					let file = fs.readFileSync(directory + '/' + element, 'utf8');
					var result = file.split("'");

					if(user.email === result[1]){
						found = true;
						let data = {};
						data.success = found;
						data.user = {
							email: result[1],
							password: result[3],
							first_name: result[5],
							last_name: result[7],
							gender: result[9],
							birthday: result[11],
							phone	: result[13],
							street: result[15],
							city: result[17],
							state: result[19],
							postal_code: result[21],
							country: result[23],
							// TODO: PROFILE IMAGE ADDITION
							profile_image: null,
						};
						resolve(data);
					}
				});
				if(!found) reject(error.ERR_NOT_VALID_EMAIL);
			});
		});
	},
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
		    fs.writeFile(path_dir, util.inspect([data.email, data.password, null, null, null, null, null, null, null, null, null, null]), function(error) {
		    
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
		let peper = data.password;
		this.salt(data, peper, (data) => {
			this.store(data, (result) => {
				if (result != true) reject(result);
				if(result === true) resolve(result);
			});
		});
		})
	},

	store_personal_info: function(current_user, data) {
		return new Promise((resolve, reject) => {
			console.log(message.store, 'Storing personal infomation process starting.');

			let replaced = false;
			fs.readdir(directory, (err, files) => {
				if(err) reject(error.ERR_DB_READING);

				files.forEach(element => {
					let file = fs.readFileSync(directory + '/' + element, 'utf8');
					var result = file.split("'");
					if(current_user._email === result[1]){
						var new_data = {
							email: current_user._email,
							password: current_user._password,
							gender: data.gender,
							first_name: data.first_name,
							last_name: data.last_name,
							birthday: data.birthday,
							phone: data.phone,
						}
						fs.writeFileSync(directory + '/' + element, util.inspect([new_data.email, new_data.password, new_data.first_name,
						 	new_data.last_name, new_data.gender, new_data.birthday, new_data.phone, null, null, null, null, null]));
						if(err) reject(error.ERR_DB_READING);
						replaced = true;
						resolve(true);
					}
				});
				if(!replaced) {
					reject(error.ERR_NOT_VALID_EMAIL);
				} 
			});
		})
	},

	change_personal_info: function(current_user, data) {
		return new Promise((resolve, reject) => {
			console.log(message.store, 'Changing personal information process starting.');

			let replaced = false;
			fs.readdir(directory, (err, files) => {
				if(err) reject(error.ERR_DB_READING);

				files.forEach(element => {
					let file = fs.readFileSync(directory + '/' + element, 'utf8');
					var result = file.split("'");
					if(current_user._email === result[1]){
						var new_data = {
							email: result[1],
							password: result[3],
							first_name: result[5],
							last_name: result[7],
							gender: result[9],
							birthday: result[11],
							phone: result[13],
							street: result[15],
							city: result[17],
							state: result[19],
							postal_code: result[21],
							country: result[23],
						}

						if(data.phone) {
							new_data.phone = data.phone;
						}
						if(data.birthday) {
							new_data.birthday = data.birthday;
						}
						if(data.first_name) {
							new_data.first_name = data.first_name;
						} 
						if(data.last_name) {
							new_data.last_name = data.last_name;
						}
						fs.writeFileSync(directory + '/' + element, util.inspect([new_data.email, new_data.password, new_data.first_name,
						 	new_data.last_name, new_data.gender, new_data.birthday, new_data.phone, new_data.street, new_data.city,
						 	new_data.state, new_data.postal_code, new_data.country]));
						if(err) reject(error.ERR_DB_READING);
						replaced = true;
						resolve(true);
					}
				});
				if(!replaced) {
					reject(error.ERR_NOT_VALID_EMAIL);
				} 
			});
		})

	},

	store_address_data: function(current_user, data) {
		return new Promise((resolve, reject) => {
			console.log(message.store, 'Storing address information process starting.');

			let replaced = false;
			fs.readdir(directory, (err, files) => {
				if(err) reject(error.ERR_DB_READING);

				files.forEach(element => {
					let file = fs.readFileSync(directory + '/' + element, 'utf8');
					var result = file.split("'");
					if(current_user._email === result[1]){
						var new_data = {
							email: result[1],
							password: result[3],
							first_name: result[5],
							last_name: result[7],
							gender: result[9],
							birthday: result[11],
							phone: result[13],
							street: data.street,
							city: data.city,
							state: data.state,
							postal_code: data.postal_code,
							country: data.country,
						}

						fs.writeFileSync(directory + '/' + element, util.inspect([new_data.email, new_data.password, new_data.first_name,
						 	new_data.last_name, new_data.gender, new_data.birthday, new_data.phone, new_data.street, new_data.city,
						 	new_data.state, new_data.postal_code, new_data.country]));
						if(err) reject(error.ERR_DB_READING);
						replaced = true;
						resolve(true);
					}
				});
				if(!replaced) {
					reject(error.ERR_NOT_VALID_EMAIL);
				} 
			});
		})
	},

	change_address_data: function(current_user, data) {
		return new Promise((resolve, reject) => {
			console.log(message.store, 'Storing address information process starting.');

			let replaced = false;
			fs.readdir(directory, (err, files) => {
				if(err) reject(error.ERR_DB_READING);

				files.forEach(element => {
					let file = fs.readFileSync(directory + '/' + element, 'utf8');
					var result = file.split("'");
					if(current_user._email === result[1]){
						var new_data = {
							email: result[1],
							password: result[3],
							first_name: result[5],
							last_name: result[7],
							gender: result[9],
							birthday: result[11],
							phone: result[13],
							street: result[15],
							city: result[17],
							state: result[19],
							postal_code: result[21],
							country: result[23],
						}


						if(data.street) {
							new_data.street = data.street;
						}
						if(data.city) {
							new_data.city = data.city;
						}
						if(data.state) {
							new_data.state = data.state;
						} 
						if(data.postal_code) {
							new_data.postal_code = data.postal_code;
						}
						if(data.country) {
							new_data.country = data.country;
						}

						fs.writeFileSync(directory + '/' + element, util.inspect([new_data.email, new_data.password, new_data.first_name,
						 	new_data.last_name, new_data.gender, new_data.birthday, new_data.phone, new_data.street, new_data.city,
						 	new_data.state, new_data.postal_code, new_data.country]));
						if(err) reject(error.ERR_DB_READING);
						replaced = true;
						resolve(true);
					}
				});
				if(!replaced) {
					reject(error.ERR_NOT_VALID_EMAIL);
				} 
			});
		})
	},

	save_image: function(current_user, data) {
		return new Promise((resolve, reject) => {
			console.log(message.store, 'Storing address information process starting.');

			let replaced = false;
			fs.readdir(directory, (err, files) => {
				if(err) reject(error.ERR_DB_READING);

				files.forEach(element => {
					let file = fs.readFileSync(directory + '/' + element, 'utf8');
					var result = file.split("'");
					if(current_user._email === result[1]){
						var new_data = {
							email: result[1],
							password: result[3],
							first_name: result[5],
							last_name: result[7],
							gender: result[9],
							birthday: result[11],
							phone: result[13],
							street: result[15],
							city: result[17],
							state: result[19],
							postal_code: result[21],
							country: result[23],
							profile_image: data.image
						};

						fs.writeFileSync(directory + '/' + element, util.inspect([new_data.email, new_data.password, new_data.first_name,
						 	new_data.last_name, new_data.gender, new_data.birthday, new_data.phone, new_data.street, new_data.city,
						 	new_data.state, new_data.postal_code, new_data.country, new_data.profile_image]));
						if(err) reject(error.ERR_DB_READING);
						replaced = true;
						resolve(true);
					}
				});
				if(!replaced) {
					reject(error.ERR_NOT_VALID_EMAIL);
				} 
			});
		});
	}
};