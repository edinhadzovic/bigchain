
(function(){
    console.log(login);
    console.log(js_loginView_login);

    document.querySelector('#login').addEventListener('click', function(e) {
        e.preventDefault();
        let data = {};
        data.username = document.getElementById("username").value;
        data.password = document.getElementById("password").value;
    
        const {ipcRenderer} = require('electron')
    
        // send username to main.js 
        ipcRenderer.send('form-submission', data );
        
        ipcRenderer.on("login-success", (event, arg) => {
            console.log(arg);
            document.getElementById("show_username").innerHTML = arg.username;
            document.getElementById("show_password").innerHTML = arg.password;
            document.getElementById("profile").style.display = "block";
            document.getElementById("login_section").style.display = "none";
        })
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
        }
    
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