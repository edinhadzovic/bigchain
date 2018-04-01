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
        /*
        let data_temp = {};
        data_temp.email = 'jelena.radisa@yahoo.com';
        data_temp.password = 'Profi?danac321';
        */
        // send username to main.js 
        ipcRenderer.send('login-submission', data );
        
        ipcRenderer.on("login-success", (event, arg) => {
            loginViewController.reference.fadeOut(500, function(){
                $('.js-homeView-box').removeClass('hidden').addClass('js-homeView-box--fadeIn').fadeIn(500, function(){
                    new homeViewController($('.js-homeView-box'), arg); 
                });
            });
        });

        ipcRenderer.on('login-failed', (event, arg) => {
            if(arg.type === 'ERR_PASSWORD_WRONG') {
				document.getElementById('username').style.border = "2px solid #d1d1d1";
				document.getElementById('password').style.border = "2px solid red";
            }

            if(arg.type === 'ERR_NOT_VALID_EMAIL') {
				document.getElementById('password').style.border = "2px solid #d1d1d1";
                document.getElementById('username').style.border = "2px solid red";  
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
        
        ipcRenderer.on('register-success', (event, user) => {
            document.getElementById('email').style.border = "2px solid green";
            document.getElementById('password_rep').style.border = "2px solid green";
            document.getElementById('reg_password').style.border = "2px solid green";
            

        });

        ipcRenderer.on('register-failed', (event, err) => {

            if(err.type === 'ERR_PASSWORD_WRONG' || err.type === 'ERR_PASSWORD_FIELD_EMPTY' || 
                err.type === 'ERR_PASSWORD_TO_SHORT' || err.type === 'ERR_PASSWORD_TO_SIMPLE') {
                document.getElementById('email').style.border = "2px solid #d1d1d1";
                document.getElementById('password_rep').style.border = "2px solid #d1d1d1";
                document.getElementById('reg_password').style.border = "2px solid red";
            }

            if(err.type === 'ERR_NOT_VALID_EMAIL' || err.type === 'ERR_EMAIL_FIELD_EMPTY' ||
                err.type === 'ERR_EMAIL_TAKEN') {
                document.getElementById('reg_password').style.border = '2px solid #d1d1d1';
                document.getElementById('password_rep').style.border = '2px solid #d1d1d1';
                document.getElementById('email').style.border = '2px solid red';  
            }
            if(err.type === 'ERR_PASSWORD_REP_FIELD_EMPTY' || err.type === 'ERR_PASSWORD_DO_NOT_MATCH') {
                document.getElementById('reg_password').style.border = '2px solid #d1d1d1';
                document.getElementById('password_rep').style.border = '2px solid red';
                document.getElementById('email').style.border = '2px solid #d1d1d1';  
            }
        });
    });
};


$('document').ready(function(){
    $('.js-loginView-form').each(function () {
        new loginViewController(this);
    });
});

var homeViewController = function (params, user) {
    console.log(user);
    var $params = $(params);
    var homeViewController = {
        navigaiton: {
            $body: $params.find('.js-homeView-navigation'),
            wallet: $params.find('.js-homeView-navigation-item[type="request_wallet_plus"]'),
            settings: $params.find('.js-homeView-navigation-item[type="request_settings"]'),
            startup_plus: $params.find('.js-homeView-navigation-item[type="request_startup_plus"]'),
            manager_plus: $params.find('.js-homeView-navigation-item[type="request_manager_plus"]'),
            file_plus: $params.find('.js-homeView-navigation-item[type="request_file_plus"]'),
        },
        personalInformation: {
            body: $params.find('.js-homeView-setting-row'),
            first_name: $params.find('.js-homeView-settings-input[input-type="first_name"]'),
            last_name: $params.find('.js-homeView-settings-input[input-type="last_name"]'),
            gender: $params.find('.js-homeView-setting-input[input-type="gender"]'),
            birthday: $params.find('.js-homeView-setting-input[input-type="birthday"]'),
            phone: $params.find('.js-homeView-setting-input[input-type="phone"]'),
            personal_submit: $params.find('.js-homeView-settings-input-pi-save'),
        },
        views: [
            {
                type: "Wallet",
                body: $(params).find('.js-homeView-wallet')
            },
            {
                type: "Startup",
                body: $(params).find('.js-homeView-startup')
            },
            {
                type: 'File',
                body: $(params).find('.js-homeView-file')
            },
            {
                type: 'Manager',
                body: $(params).find('.js-homeView-manager')            
            },
            {
                type: 'Settings',
                body: $(params).find('.js-homeView-settings')
            }
        ],
        active: function(user) {
            $('.js-homeView-profile-name').text(user._personal_information.first_name + " " + user._personal_information.last_name);
        },
        setPage: function(page_type) {
            homeViewController.views.forEach(page => {
                if(page.type === page_type) {
                    page.body.removeClass('hidden');
                } else {
                    if(!page.body.hasClass('hidden')) {
                        page.body.addClass('hidden');
                    }
                }
            });
        }
    };


    $(homeViewController.personalInformation.personal_submit).click(function(event){
        event.preventDefault();
        let data = {};
        data.first_name = $(homeViewController.personalInformation.first_name).val();
        data.last_name = $(homeViewController.personalInformation.last_name).val();
        data.gender = $(homeViewController.personalInformation.gender).val();
        data.birthday = $(homeViewController.personalInformation.birthday).val();
        data.phone = $(homeViewController.personalInformation.phone).val();
        
        const {ipcRenderer} = require('electron');
        console.log(data);
    
        ipcRenderer.send('personal-info-submission', data);

        ipcRenderer.on('store-failed', (event, err) => {
            if(err.type === 'ERR_FIRST_NAME_MISSING') {
                document.getElementById('first_name').style.border = '2px solid red';
                document.getElementById('last_name').style.border = '2px solid #d1d1d1';
                document.getElementById('phone').style.border = '2px solid #d1d1d1';
                document.getElementById('birthday').style.border = '2px solid #d1d1d1';
            }
            if(err.type === 'ERR_LAST_NAME_MISSING') {
                document.getElementById('last_name').style.border = '2px solid red';
                document.getElementById('first_name').style.border = '2px solid #d1d1d1';
                document.getElementById('phone').style.border = '2px solid #d1d1d1';
                document.getElementById('birthday').style.border = '2px solid #d1d1d1';
            }
            if(err.type === 'ERR_PHONE_MISSING') {
                document.getElementById('phone').style.border = '2px solid red';
                document.getElementById('last_name').style.border = '2px solid #d1d1d1';
                document.getElementById('first_name').style.border = '2px solid #d1d1d1';
                document.getElementById('birthday').style.border = '2px solid #d1d1d1';
            }
            if(err.type === 'ERR_BIRTHDAY_MISSING') {
                document.getElementById('birthday').style.border = '2px solid red';
                document.getElementById('last_name').style.border = '2px solid #d1d1d1';
                document.getElementById('phone').style.border = '2px solid #d1d1d1';
                document.getElementById('first_name').style.border = '2px solid #d1d1d1';
            }
        });

        ipcRenderer.on('store-success', (event, current_user) => {
            console.log(current_user, "CURRENT USER");
        })
    });



    homeViewController.active(user);
    $(homeViewController.navigaiton.settings).click(function(){
        homeViewController.setPage("Settings");
    });
    $(homeViewController.navigaiton.wallet).click(function(){
        homeViewController.setPage("Wallet");
    });
    $(homeViewController.navigaiton.startup_plus).click(function(){
        homeViewController.setPage("Startup");
    });
    $(homeViewController.navigaiton.file_plus).click(function(){
        homeViewController.setPage("File");
    });
    $(homeViewController.navigaiton.manager_plus).click(function(){
        homeViewController.setPage("Manager");
    });
};

/*
$('document').ready(function(){
    $('.js-homeView-box').each(function () {
        new homeViewController(this);
    })
});
*/