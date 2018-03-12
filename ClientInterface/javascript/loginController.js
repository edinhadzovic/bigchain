(function(){
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
})();