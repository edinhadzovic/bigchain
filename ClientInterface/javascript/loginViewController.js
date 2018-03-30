
(function(){
    console.log(login);
    console.log(js_loginView_login);

    document.querySelector('#login').addEventListener('click', function(e) {
        e.preventDefault();
        let data = {};
        data.email = document.getElementById("username").value;
        data.password = document.getElementById("password").value;
    

        const {ipcRenderer} = require('electron');
        
        var temp_data = {
            email: "test@gmail.com",
            password: "Manchester99!"
        };

        // send username to main.js 
        ipcRenderer.send('login-submission', data );
        
        ipcRenderer.on("login-success", (event, arg) => {
            console.log(arg); 
            document.getElementById("show_username").innerHTML = arg.email;
            document.getElementById("profile").style.display = "block";
            document.getElementById("js_loginView_login").style.display = "none";
        });

        ipcRenderer.on('login-fail', (event, arg) => {
			console.log("check", arg.type);
            if(arg.type === 'ERR_PASSWORD_WRONG') {
				document.getElementById('username').style.border = "2px solid #d1d1d1";
				document.getElementById('password').style.border = "2px solid red";
            }

            if(arg.type === 'ERR_NOT_VALID_EMAIL') {
				document.getElementById('password').style.border = '2px solid #d1d1d1';
                document.getElementById('username').style.border = '2px solid red';  
            }
        });
    });

    document.querySelector('#register').addEventListener('click', function(e) {
        e.preventDefault();
        let data = {};
        data.email = document.getElementById("email").value;
        data.password = document.getElementById("reg_password").value;
        data.password_rep = document.getElementById("password_rep").value;
    
        const {ipcRenderer} = require('electron');

        var temp_data = {
            email: "test@gmail.com",
            password: "Manchester99!",
            password_rep: "Manchester99!"
        };
    
        // send username to main.js 
        ipcRenderer.send('register-submission', data );
        
        ipcRenderer.on("register-success", (event, arg) => {
            console.log(arg);
            document.getElementById("show_username").innerHTML = arg.username;
            document.getElementById("profile").style.display = "block";
            document.getElementById("login_section").style.display = "none";
        })
    });

    document.querySelector("#js-loginView-form-register").addEventListener("click", function(e) {
        e.preventDefault();
        console.log(js_loginView_login);
        js_loginView_login.className += ' js-loginView-login--hide';
        js_loginView_register.className = 'js-loginView-register';
    })
})();