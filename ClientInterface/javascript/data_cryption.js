const bcryptjs = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const util = require('util');

module.exports = {

	store: function(data){
	    
	    console.log("Storing data into file /tmp/test");
	    
	    path_dir = path.join(__dirname, '../../temp/test');
	    fs.writeFile(path_dir, util.inspect(data), function(err) {
	    
	    if(err) {
	        return console.log(err);
	    }});
	},
	salt: function(data, peper){
		// start with cryption
		console.log("Salt process...");
		var password = peper;
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(password, salt, (err, hash) => {
                data.password = hash;
                this.store(data);
            });
        });
	},

	pepper: function(data){
		// starting process
		// append data.username to data.password first
		// doing it automatically  without pepper-mint moodul
		console.log("Pepper process...");
		let peper = data.username + data.password;
		this.salt(data, peper);
	}	

};