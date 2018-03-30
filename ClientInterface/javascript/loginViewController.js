const client = require('./../../App/client/User');

var loginViewController = function (params) {
    var $params = $(params);
    var loginViewController = {
        reference: $params,
        loginView: {
            body: $params.find('.js-loginView-login'),
            username: $params.find('.js-loginView-login-username'),
            password: $params.find('.js-loginView-login-password'),
            submit: $params.find('.js-loginView-login-submit'),
            toRegister: $params.find('.js-loginView-new-account'),
            hide: function(view){
                if($(view).hasClass('js-loginView-login--fadeIn')) $(view).removeClass('js-loginView-login--fadeIn');
                $(view).addClass(' js-loginView-login--fadeOut');
            },
            show: function(view){
                $(view).removeClass('js-loginView-login--fadeOut').addClass(' js-loginView-login--fadeIn');
            }
        },
        registerView: {
            body: $params.find('.js-loginView-register'),
            email: $params.find('.js-loginView-register-mail'),
            password: $params.find('.js-loginView-register-password'),
            repassword: $params.find('.js-loginView-register-repassword'),
            submit: $params.find('.js-loginView-register-submit'),
            toLogin: $params.find('.js-loginView-go-to-login'),
            hide: function(view){
                $(view).removeClass('js-loginView-register--fadeIn').addClass(' js-loginView-register--fadeOut');
            },
            show: function(view){
                if($(view).hasClass('js-loginView-register--fadeOut')) $(view).removeClass('js-loginView-register--fadeOut');
                $(view).addClass(' js-loginView-register--fadeIn');
            }
        },  
    };
   

    $(loginViewController.loginView.toRegister).click(function (event) {
        event.preventDefault();
        setTimeout(() => {
            loginViewController.registerView.show(loginViewController.registerView.body);
        }, 250);
        loginViewController.loginView.hide(loginViewController.loginView.body);
    });

    $(loginViewController.registerView.toLogin).click(function(event) {
        event.preventDefault();
        setTimeout(() => {
            loginViewController.loginView.show(loginViewController.loginView.body);
        }, 500);
        loginViewController.registerView.hide(loginViewController.registerView.body);
    });

    $(loginViewController.loginView.submit).click(function(event) {
        event.preventDefault();
        let data = {};
        data.email = $(loginViewController.loginView.username).val();
        data.password = $(loginViewController.loginView.password).val();
        

        const {ipcRenderer} = require('electron');

        // send username to main.js 
        ipcRenderer.send('login-submission', data );
        
        ipcRenderer.on("login-success", (event, arg) => {
            console.log(arg); 
            let user = new client(arg);
            user.status();
            document.getElementById("show_username").innerHTML = arg.email;
            document.getElementById("profile").style.display = "block";
            document.getElementById("js_loginView_login").style.display = "none";
        });

        ipcRenderer.on('login-fail', (event, arg) => {
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

    $(loginViewController.registerView.submit).click(function(event){
        event.preventDefault();
        let data = {};
        data.email = $(loginViewController.registerView.email).val();
        data.password = $(loginViewController.registerView.password).val();
        data.password_rep = $(loginViewController.registerView.repassword).val();
    
        const {ipcRenderer} = require('electron');
    
        console.log(data);
        // send username to main.js 
        ipcRenderer.send('register-submission', data );
        
        ipcRenderer.on("register-success", (event, arg) => {
            console.log(arg);
            document.getElementById("show_username").innerHTML = arg.username;
            document.getElementById("profile").style.display = "block";
            document.getElementById("login_section").style.display = "none";
        });
    });
};

$('document').ready(function(){
    $('.js-loginView-form').each(function () {
        new loginViewController(this);
    });
});



var homeViewController = function (params) {
    
};

$('document').ready(function(){
    $('.js-homeView-box').each(function () {
        new homeViewController(this);
    })
});
