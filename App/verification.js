const validator = require('validator');
const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../temp/');

module.exports = {
	verify: function(data) {
		console.log("New: ", data);
		return new Promise((resolve, reject) => {
			if(validator.isEmpty(data.email)) {
				reject({
					error: true,
					error_type: "email field empty"
				});
				//err.push("email field empty");
			}
			if(validator.isEmpty(data.password)) {
				reject({
					error: true,
					error_type: "password field is empty"
				});
				err.push("password field is empty");
			}
			if(validator.isEmpty(data.password_rep)) {
				reject({
					error: true,
					error_type: "password field is empty"
				});
			}
			
			// Verify Email address 
			if(!validator.isEmail(data.email)) {
				reject({
					error: true,
					error_type: "Email is not an email"
				});
			}
			
			let success;
			// Extra password check
			this.extra_check(data.password, data.password_rep).then((result) => {
				//then ako je pozvan resolve(data)
				resolve(true);
			}).catch((err) => {
				err => console.log(e);
				resolve(err);
				//nesto uradi snjim - ako je pozvano reject(data);
			})

			
		});
		


		// ---------------------
		// TODO: Check does user already exist
		// ---------------------

		//this.does_exist(data);

	},

	// Special checks for the passwords
	// Password has to be strong
	extra_check: function(data, data_rep) {
		return new Promise((resolve, reject) => {

			if(data.length < 8 || data.length > 16)
			{
				reject({
					error: true,
					error_type: "password has to be 8-15 digit long"
				});
			}
	
			if(data.length == data_rep.length) {
				var difCount = 0;
				for (var i = 0; i < data.length; i++) {
					if(!(data[i] == data_rep[i])) {
						difCount ++;
					}
				}
				if (difCount != 0) {
					console.log("aa ovde?");
					reject({
						error: true,
						error_type: "passwords do not match"
					});
				} 
	
			}	
			else {

				reject ({

					error: true,
					error_type: "passwords do not match"
				});
			}

			
			var upperCaseCount = 0;
			var numberCount = 0;
			var specialSignCount = 0;
			var whitespaceCount = 0;
	
			for (var i = 0; i < data.length; i++)
			{
				if (data[i].match(/\s/))
				{
					whitespaceCount++;
				}
				if (data[i].match(/[?!@#$%^&*)_]/))
				{
					specialSignCount++;
				}
				if (data[i].match(/[0-9]/))
				{
					numberCount++;
				}
				if (data[i].match(/[A-Z]/))
				{
					upperCaseCount++;
				}
	
			}
			
			console.log("HAAAAAAAAAAAAAAAAALOOOOOOOOOOOOOOO", data);

			// No white spaces for the password and atleast one number, special sign and uppercase letter
			if (whitespaceCount == 0 && numberCount >= 1 && specialSignCount >= 1 && upperCaseCount >=1)
			{
				console.log('Everything went well, prepare for storing...');
				resolve(true);
			}
			else
			{	
				reject ({
					error: true,
					error_type: "password has to contain 1 number, 1 special sign, 1 upper case letter"
				});
			}
		});
	},

    // -------------------------
	// TODO: implement the function
	// -------------------------
	does_exist: function (data) {
		return new Promise((resolve, reject) => {
			resolve(true);
		});
		// open directory and check for usernames
		fs.readdir(directory, (err, files) => {
		  for (var i = 0; i < files.length; i++)
		  {
		  	filePath = path.join(__dirname, '../temp/' + files[i])
		  	//console.log(i);
			  let content = fs.readFileSync(filePath, 'utf8');
			  //if(content) console.log(content);
			  return true;
		  }
		});

	}
};