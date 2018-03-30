const validator = require('validator');
const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../temp/');

var message = require('./lib/Message');

module.exports = {
	verify: function(data) {
		console.log(message.verify, 'Starting the process of data validation.');
		return new Promise((resolve, reject) => {
			if(validator.isEmpty(data.email)) {
				reject({
					error: true,
					error_type: "Email field empty."
				});
			}
			if(validator.isEmpty(data.password)) {
				reject({
					error: true,
					error_type: "Password field is empty."
				});
			}
			if(validator.isEmpty(data.password_rep)) {
				reject({
					error: true,
					error_type: "Confirm the password."
				});
			}
			if(!validator.isEmail(data.email)) {
				reject({
					error: true,
					error_type: "Email is not an email."
				});
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
				reject({
					error: true,
					error_type: "Password has to be 8-15 digit long."
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
					reject({
						error: true,
						error_type: "Passwords do not match."
					});
				} 
	
			}	
			else {

				reject ({

					error: true,
					error_type: "Passwords do not match."
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

			// No white spaces for the password and atleast one number, special sign and uppercase letter
			if (whitespaceCount == 0 && numberCount >= 1 && specialSignCount >= 1 && upperCaseCount >=1)
			{
				console.log(message.verify, 'Everything went well, prepare for storing...');
				resolve(true);
			}
			else
			{	
				reject ({
					error: true,
					error_type: "Password has to contain 1 number, 1 special sign, 1 upper case letter."
				});
			}
		});
	},

    // -------------------------
	// TODO: implement the function
	/*
		OVAKO:
		ZNACI KAD NE STAVIM RESOLVE(TRUE NA KRAJ) LOGICNO NIKADA SE NE VRATI
		AKO STAVIM RESOLVE TRUE UVIJEK JE TRE I NIKADA OVAJ KURCEV REJECT U OTVARANJU FAJL NE PREPOZNA

		ISTO SRANJE MIS E DESAVA ZNACI NA LINIJI 44 I 51 KAD POZIVAM OVE DVE FUNKCIJE NIKADA NECE DA PREKINE OVA
		KURCINA REJECT, KADA BI TREBALA, EVO NPR KAD POGRIJESIM PASSWORD A UNESEM GA NA TRENUTNOM STANJU ON CE PRODUZITI DALJE
		NECE PRESTATI A TREBAO BI REJECT SA LINIJE 133 ILI BILO KOJI REJECT IZ FUNKCIJE EXTRA_CHECKS DA RADI JEBEM LI MU MAJKU U PICKU
		ETO TOLIKO OD MENE NISAM MOGAO VISE ENGLESKOG


	*/
	// -------------------------
	does_exist: function (data) {
		return new Promise((resolve, reject) => {
		// open directory and check for usernames
			fs.readdir(directory, (err, files) => {
				if (err) throw err;
			  	for (var i = 0; i < files.length; i++)
			  	{
			  		filePath = path.join(__dirname, '../temp/' + files[i])
			  	
				  	let result = fs.readFileSync(filePath, 'utf8');
				  	var val = "'";
				  	var cut = result.split(val);

				  	if (data.email == cut[1])
				  	{
	  					console.log(message.verify, "Emails match, registration failed.");
				  		reject ({
							error: true,
							error_type: "There is already a user with this email."
						});
						break;
				  	}
			  	}  	
			});
			console.log(message.verify, "Currently no user with this email.");
			resolve(true);

		});
	}
};