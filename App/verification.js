const validator = require('validator');
const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../temp/');

module.exports = {
	verify: function(data, err) {
// this.does_exist(data);
// return;
		// Is some part of the form empty
		if(validator.isEmpty(data.email)) {
			err.push("email field empty");
		}
		if(validator.isEmpty(data.password)) {
			err.push("password field is empty");
		}
		if(validator.isEmpty(data.password_rep)) {
			err.push("confirm the password");
		}
		
		// Verify Email address 
		if(validator.isEmail(data.email)) {
			console.log('It is an valid email, check the passwords');
		}
		else {
			err.push("not an email");
		}

		// Extra password check
		if(err != null)
		{
			this.extra_check(data.password, data.password_rep, err);
		}			


		// ---------------------
		// TODO: Check does user already exist
		// ---------------------

		//this.does_exist(data);

	},

	// Special checks for the passwords
	// Password has to be strong
	extra_check: function(data, data_rep, err) {
		if(data.length < 8)
		{
			err.push("password has to be 8-15 digit long");	
			return;
		}

		if(data.length == data_rep.length) {
			var difCount = 0;
			for (var i = 0; i < data.length; i++) {
				if(!(data[i] == data_rep[i])) {
					difCount ++;
				}
			}
			if (difCount != 0) {
				err.push("passwords do not match");
				return;
			} 

		}	
		else {
			err.push("passwords do not match");
			return;
		}

		console.log("Passwords match, further checks...");

		
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
			console.log('Everything went well, prepare for storing...');
		}
		else
		{	
			err.push("password has to contain 1 number, 1 special sign, 1 upper case letter");
		}
	},

    // -------------------------
	// TODO: implement the function
	// -------------------------
	does_exist: function (data) {

		// open directory and check for usernames
		fs.readdir(directory, (err, files) => {
			console.log('123');
		  for (var i = 0; i < files.length; i++)
		  {
		  	filePath = path.join(__dirname, '../temp/' + files[i])
		  	console.log(i);
		  	fs.readFile(filePath, {encoding: 'utf-8'}, function(err, content) {
		  		console.log(content);
		  		//response.end();
		  	});
		  }
		});

	}
};