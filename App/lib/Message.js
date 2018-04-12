let messages = {
	store:        "[STORE:        ] ",
	verify:       "[VERIFICATION: ] ",
	main:         "[MAIN:         ] ",
	user:         "[USER:         ] ",
	print: function(type, messages) {
		console.log(`${type} : ${messages}`);	
	}
};


module.exports = messages;