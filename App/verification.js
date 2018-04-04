const validator = require('validator');
const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../temp/');

var message = require('./lib/Message');
const error = require('./error/error');

module.exports = {
	verify: function(data) {
		console.log(message.verify, 'Starting the process of data validation.');
		return new Promise((resolve, reject) => {
			if(validator.isEmpty(data.email)) {
				reject(error.ERR_EMAIL_FIELD_EMPTY);
			}
			if(validator.isEmpty(data.password)) {
				reject(error.ERR_PASSWORD_FIELD_EMPTY);
			}
			if(validator.isEmpty(data.password_rep)) {
				reject(error.ERR_PASSWORD_REP_FIELD_EMPTY);
			}
			if(!validator.isEmail(data.email)) {
				reject(error.ERR_NOT_VALID_EMAIL);
			}

			this.extra_check(data.password, data.password_rep).then((result) => {
			}).catch((err) => {
				reject(err);
			})

			this.does_exist(data).then((result)=>{
				resolve(true);
			}).catch((err) => {
				reject(err);
			});
			
		});

	},

	extra_check: function(data, data_rep) {
		return new Promise((resolve, reject) => {

			if(data.length < 8 || data.length > 16)
			{
				reject(error.ERR_PASSWORD_TO_SHORT);
			}
	
			if(data.length == data_rep.length) {
				var difCount = 0;
				for (var i = 0; i < data.length; i++) {
					if(!(data[i] == data_rep[i])) {
						difCount ++;
					}
				}
				if (difCount != 0) {
					reject(error.ERR_PASSWORD_DO_NOT_MATCH);
				} 
	
			}	
			else {
				reject (error.ERR_PASSWORD_DO_NOT_MATCH);
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

			// No white spaces for the password and atleast one number, special sign and uppercase letter
			if (whitespaceCount == 0 && numberCount >= 1 && specialSignCount >= 1 && upperCaseCount >=1)
			{
				console.log(message.verify, 'Everything went well, prepare for storing...');
				resolve(true);
			}
			else
			{	
				reject (error.ERR_PASSWORD_TO_SIMPLE);
			}
		});
	},

	does_exist: function (data) {
		return new Promise((resolve, reject) => {
			let store = true;
		// open directory and check for usernames
			fs.readdir(directory, (err, files) => {
				if (err) throw err;
			  	for (var i = 0; i < files.length; i++)
			  	{
			  		filePath = path.join(__dirname, '../temp/' + files[i])
			  	
				  	let result = fs.readFileSync(filePath, 'utf8');
				  	var val = "'";
						var cut = result.split(val);

				  	if (data.email === cut[1])
				  	{
							store = false;
	  					console.log(message.verify, "Email taken, registration failed.");
				  		reject (error.ERR_EMAIL_TAKEN);
						break;
				  	}
					}
					if(store) {
						resolve(true); 
					}
			});
		});
	},


	personal_data: function(data) {
		return new Promise((resolve, reject) => {
			console.log(message.verify, 'Personal data verifying.');
			let count = 0;
			if(validator.isEmpty(data.first_name)) {
				count++;
				reject(error.ERR_FIRST_NAME_MISSING);
			}
			if(validator.isEmpty(data.last_name)) {
				count++;
				reject(error.ERR_LAST_NAME_MISSING);
			}
			if (validator.isEmpty(data.birthday)) {
				count++;
				reject(error.ERR_BIRTHDAY_MISSING);
			}
			if(validator.isEmpty(data.phone)) {
				count++;
				reject(error.ERR_PHONE_MISSING);
			}
			if (count == 0) {
				resolve(true);
			}
		});
	},

	address_data: function(data) {
		return new Promise((resolve, reject) => {
			console.log(message.verify, 'Personal data verifying.');
			let count = 0;
			if(validator.isEmpty(data.street)) {
				count++;
				reject(error.ERR_STREET_MISSING);
			}
			if(validator.isEmpty(data.city)) {
				count++;
				reject(error.ERR_CITY_MISSING);
			}
			if (validator.isEmpty(data.state)) {
				count++;
				reject(error.ERR_STATE_MISSING);
			}
			if(validator.isEmpty(data.postal_code)) {
				count++;
				reject(error.ERR_POSTAL_CODE_MISSING);
			}
			if(validator.isEmpty(data.country)) {
				count++;
				reject(error.ERR_COUNTRY_MISSING);
			}
			if (count == 0) {
				resolve(true);
			}
		});
	},

};