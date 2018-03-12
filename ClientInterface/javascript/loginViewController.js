
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

    document.querySelector("#js-loginView-form-register").addEventListener("click", function(e) {
        e.preventDefault();
        console.log(js_loginView_login);
        js_loginView_login.className += ' js-loginView-login--hide';
        js_loginView_register.className = 'js-loginView-register';
    })
})();
