const client = require('./../../App/client/User');
const croppie = require('croppie');
const fs = require('fs');
const path = require('path');
const {shell} = require('electron');
const {ipcRenderer} = require('electron');


const directory = path.join(__dirname, '../images/profile');

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
        personalInfoView: {
            body: $params.find('.js-loginView-personal-information'),
            first_name: $params.find('.js-loginView-personal-information-first_name'),
            last_name: $params.find('.js-loginView-personal-information-last_name'),
            birthday: $params.find('.js-loginView-personal-information-birthday'),
            gender: $params.find('.js-loginView-personal-information-gender'),
            phone: $params.find('.js-loginView-personal-information-phone'),
            toSubmit: $params.find('.js-loginView-personal-information-submit'),
            toSkip: $params.find('.js-loginView-personal-information-skip'),

            hide: function(view){
                $(view).removeClass('js-loginView-personal-information--fadeIn').addClass(' js-loginView-personal-information--fadeOut');
            },
            show: function(view){
                if($(view).hasClass('js-loginView-personal-information--fadeOut')) $(view).removeClass('js-loginView-personal-information--fadeOut');
                $(view).addClass(' js-loginView-personal-information--fadeIn');
            }
        },
        addressView: {
            body: $params.find('.js-loginView-address '),
            street: $params.find('.js-loginView-address-street '),
            city: $params.find('.js-loginView-address-city '),
            state: $params.find('.js-loginView-address-state '),
            postal_code: $params.find('.js-loginView-address-postal_code '),
            country: $params.find('.js-loginView-address-country '),
            toSubmit: $params.find('.js-loginView-address-submit '),
            toSkip: $params.find('.js-loginView-address-skip '),

            hide: function(view) {
                $(view).removeClass('js-loginView-address--fadeIn').addClass(' js-loginView-address--fadeOut');
            },
            show: function(view) {
                if($(view).hasClass('js-loginView-address--fadeOut')) $(view).removeClass('js-loginView-address--fadeOut');
                $(view).addClass(' js-loginView-address--fadeIn');
            }
        },
        imageView: {
            body: $params.find('.js-loginView-image'),
            image: $params.find('.js-loginView-image-image'),
            crop: $params.find('.js-loginView-image-crop'),
            toSubmit: $params.find('.js-loginView-image-submit'),
            toSkip: $params.find('.js-loginView-image-skip'),
            saveImage: $params.find('.js-loginView-image-crop-save'),

            hide: function(view) {
                $(view).removeClass('js-loginView-image--fadeIn').addClass(' js-loginView-image--fadeOut');
            },
            show: function(view) {
                if($(view).hasClass('js-loginView-image--fadeOut')) $(view).removeClass('js-loginView-image--fadeOut');
                $(view).addClass(' js-loginView-image--fadeIn');
            }
        }  
    };

    $(loginViewController.loginView.toRegister).click(function (event) {
        event.preventDefault();
        loginViewController.loginView.body.fadeOut(200, () => {
            loginViewController.registerView.body.fadeIn(200);
        });
    });
    
    $(loginViewController.registerView.toLogin).click(function(event) {
        event.preventDefault();
        loginViewController.registerView.body.fadeOut(200, () => {
            loginViewController.loginView.body.fadeIn(200);
        });
    });

    $(loginViewController.personalInfoView.toSkip).click(function(event){
        event.preventDefault();
        loginViewController.personalInfoView.body.fadeOut(200, () => {
            loginViewController.addressView.body.fadeIn(200);
        });
    });

    $(loginViewController.addressView.toSkip).click(function(event){
        event.preventDefault();
        loginViewController.addressView.body.fadeOut(200, () => {
            loginViewController.imageView.body.fadeIn(200);
        });
    });

    $(loginViewController.imageView.toSkip).click(function(event){
        event.preventDefault();
        loginViewController.registerView.body.fadeOut(200, () => {
            $('.js-homeView-box').removeClass('hidden').addClass('js-homeView-box--fadeIn').fadeIn(500, function(){
                new homeViewController($('.js-homeView-box',)); 
            });
        });
    });

    $(loginViewController.loginView.submit).click(function(event) {
        event.preventDefault();
        let data = {};
        data.email = $(loginViewController.loginView.username).val();
        data.password = $(loginViewController.loginView.password).val();
        
        let temp_data = {};
        temp_data.email = 'Danilo@yahoo.com';
        temp_data.password = 'Profi?danac321';
        // send username to main.js 
        ipcRenderer.send('login-submission', temp_data );
        
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
        
        let temp_data = {};
        temp_data.email = 'Danilo@yahoo.com';
        temp_data.password = 'Profi?danac321';
        temp_data.password_rep = 'Profi?danac321';
        // send username to main.js 
        ipcRenderer.send('register-submission', temp_data );
        
        ipcRenderer.on('register-success', (event, user) => {
            //event.preventDefault();
            loginViewController.registerView.body.fadeOut(200, () => {
                loginViewController.personalInfoView.body.fadeIn(200);
            });
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

    $(loginViewController.personalInfoView.toSubmit).click(function(event){
        event.preventDefault();


        let data = {};
        data.first_name = $(loginViewController.personalInfoView.first_name).val();
        data.last_name = $(loginViewController.personalInfoView.last_name).val();
        data.gender = $(loginViewController.personalInfoView.gender).val();
        data.birthday = $(loginViewController.personalInfoView.birthday).val();
        data.phone = $(loginViewController.personalInfoView.phone).val();

        ipcRenderer.send('personal-info-submission', data);

        ipcRenderer.on('store-personal-info-failed', (event, err) => {
            if(err.type === 'ERR_FIRST_NAME_MISSING') {
                document.getElementById('first_name_intro').style.border = '2px solid red';
                document.getElementById('last_name_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('phone_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('birthday_intro').style.border = '2px solid #d1d1d1';
            }
            if(err.type === 'ERR_LAST_NAME_MISSING') {
                document.getElementById('last_name_intro').style.border = '2px solid red';
                document.getElementById('first_name_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('phone_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('birthday_intro').style.border = '2px solid #d1d1d1';
            }
             if(err.type === 'ERR_BIRTHDAY_MISSING') {
                document.getElementById('birthday_intro').style.border = '2px solid red';
                document.getElementById('last_name_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('phone_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('first_name_intro').style.border = '2px solid #d1d1d1';
            }
            if(err.type === 'ERR_PHONE_MISSING') {
                document.getElementById('phone_intro').style.border = '2px solid red';
                document.getElementById('last_name_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('first_name_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('birthday_intro').style.border = '2px solid #d1d1d1';
            }
        });

        ipcRenderer.on('store-personal-info-success', (event, current_user) => {
            console.log(current_user, "CURRENT USER");
            loginViewController.personalInfoView.body.fadeOut(500, () => {
                loginViewController.addressView.body.fadeIn(500);
            });
        });
    });

    $(loginViewController.addressView.toSubmit).click(function(event){

        event.preventDefault();


        let data = {};
        data.street = $(loginViewController.addressView.street).val();
        data.city = $(loginViewController.addressView.city).val();
        data.state = $(loginViewController.addressView.state).val();
        data.postal_code = $(loginViewController.addressView.postal_code).val();
        data.country = $(loginViewController.addressView.country).val();
        
        ipcRenderer.send('address-info-submission', data);

        ipcRenderer.on('store-address-info-failed', (event, err) => {

            if(err.type === 'ERR_STREET_MISSING') {
                document.getElementById('street_intro').style.border = '2px solid red';
                document.getElementById('city_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('state_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('postal_code_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('country_intro').style.border = '2px solid #d1d1d1';
            }
            if(err.type === 'ERR_CITY_MISSING') {
                document.getElementById('city_intro').style.border = '2px solid red';
                document.getElementById('street_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('state_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('postal_code_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('country_intro').style.border = '2px solid #d1d1d1';
            }
             if(err.type === 'ERR_STATE_MISSING') {
                document.getElementById('state_intro').style.border = '2px solid red';
                document.getElementById('street_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('city_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('postal_code_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('country_intro').style.border = '2px solid #d1d1d1';
            }
            if(err.type === 'ERR_POSTAL_CODE_MISSING') {
                document.getElementById('postal_code_intro').style.border = '2px solid red';
                document.getElementById('street_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('city_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('state_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('country_intro').style.border = '2px solid #d1d1d1';
            }
            if(err.type === 'ERR_COUNTRY_MISSING') {
                document.getElementById('country_intro').style.border = '2px solid red';
                document.getElementById('street_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('city_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('state_intro').style.border = '2px solid #d1d1d1';
                document.getElementById('postal_code_intro').style.border = '2px solid #d1d1d1';
            }
        });

        ipcRenderer.on('store-address-info-success', (event, current_user) => {
            console.log(current_user, "CURRENT USER");
            loginViewController.addressView.body.fadeOut(500, () => {
                loginViewController.imageView.body.fadeIn(500);
            });
        });
    });

    $(loginViewController.imageView.toSubmit).click(function(event){
        event.preventDefault();
        let image;
        const {dialog} = require('electron').remote;
        console.log(dialog);
        dialog.showOpenDialog({properties: ['openFile']},  (file_names) => {
            if(file_names === undefined) return;

            image = file_names[0];
            
            let data = {};
            data.image = image;
            loginViewController.imageView.crop.removeClass('hidden').fadeIn(500, () => {
                data.imageController = $('.js-loginView-image-crop').croppie({
                    viewport: {
                        width: 200,
                        height: 200,
                        type: 'circle'
                    },
                    boundary: { width: 300, height: 300 },
                });

                data.imageController.croppie('bind', {
                    url: data.image
                });
            });

            $('.js-loginView-image-crop-save').click(function(event){
                var reader = new FileReader();
                event.preventDefault();
                console.log(data.imageController);
                data.imageController.croppie('result', {type: 'blob'}).then(function(resp){
                    reader.addEventListener('load', function(){
                        fs.writeFileSync(directory + '/user_profile.png', reader.result, 'binary', function(err){
                            if(err) console.log("down");
                            console.log("test");
                        });

                        data.profile_image = directory + '/user_profile.png';
                        ipcRenderer.send('form-submission-image', data);

                    });
                    reader.readAsBinaryString(resp);
                    
                
                });
            });
            //
        });
    
        
        ipcRenderer.on('image-submission-success', (event, current_user) => {
            loginViewController.reference.fadeOut(500, function(){
                $('.js-homeView-box').removeClass('hidden').addClass('js-homeView-box--fadeIn').fadeIn(500, function(){
                    new homeViewController($('.js-homeView-box'), current_user); 
                });
            });
        });
        ipcRenderer.on('image-submission-fail', (event, current_user) => {
            
        });
        //let data = {};
        //data.image = reader.readAsDataURL($(loginViewController.imageView.image).val());
        //console.log(data.image);
        console.log(image);

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
        wallet_navigation: {
            body: $params.find('.js-homeView-wallet-nav'),
            btc: $params.find('.js-homeView-wallet-symbol[request="btc"]'),
            dgb: $params.find('.js-homeView-wallet-symbol[request="dgb"]'),
            ltc: $params.find('.js-homeView-wallet-symbol[request="ltc"]'),
            eth: $params.find('.js-homeView-wallet-symbol[request="eth"]'),
        },
        btc_wallet: {
            body: $params.find('.js-homeView-wallet-content[display="btc"]'),
            address: $params.find('.js-homeView-wallet-send-btc-to-address'),
            amount: $params.find('.js-homeView-wallet-send-btc-amount'),
            send_button: $params.find('.js-homeView-wallet-btc-send'),
            market_price: $params.find('.js-homeView-wallet-fiat-btc'),
            personal_standing: $params.find('.js-homeView-wallet-standing-btc'),
        },
        ltc_wallet: {
            body: $params.find('.js-homeView-wallet-content[display="ltc"]'),
            address: $params.find('.js-homeView-wallet-send-ltc-to-address'),
            amount: $params.find('.js-homeView-wallet-send-ltc-amount'),
            send_button: $params.find('.js-homeView-wallet-ltc-send'),
            market_price: $params.find('.js-homeView-wallet-fiat-ltc'),
            personal_standing: $params.find('.js-homeView-wallet-standing-ltc'),
        },
        dgb_wallet: {
            body: $params.find('.js-homeView-wallet-content[display="dgb"]'),
            generateAddress: $params.find('.js-homeView-wallet-generate-address[for="dgb"]')
        },

        // 
        exchange: {
            body: $params.find('.js-homeView-exchange-form'),
            what_from: $params.find('.js-homeView-exchange-what-from'),
            what_to: $params.find('.js-homeView-exchange-what-to'),
            address_from: $params.find('.js-homeView-exchange-address-from'),
            exchange_amount_from: $params.find('.js-homeView-exchange-amount-from'),
            address_to: $params.find('.js-homeView-exchange-address-to'),
            receive_amount_to:  $params.find('.js-homeView-exchange-amount-to'),
            fee: $params.find('.js-homeView-exchange-fee'),
            exchange_button: $params.find('.js-homeView-exchange-button'),
        },
        wallets: [
            {
                type: "btc",
                body: $(params).find('.js-homeView-wallet-content[display="btc"]'),
                class: 'btc-select'
            },
            {
                type: "dgb",
                body: $(params).find('.js-homeView-wallet-content[display="dgb"]'),
                class: 'dgb-select'
            },
            {
                type: "ltc",
                body: $(params).find('.js-homeView-wallet-content[display="ltc"]'),
                class: 'ltc-select'
            },
            {
                type: "eth",
                body: $(params).find('.js-homeView-wallet-content[display="eth"]'),
                class: 'eth-select'
            }
        ],
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
        active: async function(user) {
            await ipcRenderer.send('get-user-data');
            ipcRenderer.on('init-user-data', (event, user) => {
                $('.js-home-profile-image-tag').attr('src', user._profile_image);
                $('.js-homeView-profile-name').text(user._personal_information.first_name + " " + user._personal_information.last_name);
            });
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
        },
        setWallet: function(wallet_type) {
            homeViewController.wallets.forEach(wallet => {
                if(wallet.type === wallet_type) {
                    wallet.body.removeClass('hidden');
                    $('.js-homeView-box').addClass(wallet.class);
                } else {
                    if(!wallet.body.hasClass('hidden')) {
                        $('.js-homeView-box').removeClass(wallet.class);                        
                        wallet.body.addClass('hidden');
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
        
        console.log(data);
    
        ipcRenderer.send('personal-info-change', data);

        ipcRenderer.on('store-failed', (event, err) => {
            // Cant fail
            // It will never reach here
            // GOod to know this 
            // Can be changed if all entries are equal 0 just return some error bla bla]

        });

        ipcRenderer.on('store-success', (event, current_user) => {
            console.log(current_user, "CURRENT USER");
            $('.js-homeView-profile-name').text(current_user._personal_information.first_name + " " + current_user._personal_information.last_name);
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

    $(homeViewController.wallet_navigation.btc).click(function() {
        homeViewController.setWallet('btc');
        ipcRenderer.send('get-btc');
        
        ipcRenderer.on('init-btc-info', (event, data) => {
            $('.js-homeView-wallet-fiat-btc').text('Price ' + data.market_price + '\u20AC');
            $('.js-homeView-wallet-standing-btc').text('BTC personal konto ' + data.standing);
        });
    });

    $(homeViewController.wallet_navigation.dgb).click(function() {
        homeViewController.setWallet('dgb');
    });

    $(homeViewController.wallet_navigation.ltc).click(function() {
        homeViewController.setWallet('ltc');
        ipcRenderer.send('get-ltc');
        
        ipcRenderer.on('init-ltc-info', (event, data) => {
            $('.js-homeView-wallet-fiat-ltc').text('Price ' + data.market_price + '\u20AC');
            $('.js-homeView-wallet-standing-ltc').text('LTC personal konto ' + data.standing);
        });
    });

    $(homeViewController.wallet_navigation.eth).click(function() {
        homeViewController.setWallet('eth');
    });

    $(homeViewController.dgb_wallet.generateAddress).click(function(event) {
        console.log("test");

        event.preventDefault();
        ipcRenderer.send('generate-dgb-address');

        ipcRenderer.on('generate-dgb-address-success', (event, private_key) => {
            console.log(private_key);
        });
    });

    $(homeViewController.btc_wallet.send_button).click(function(event){
        event.preventDefault();
   
        let data = {};
        data.btc_address = $(homeViewController.btc_wallet.address).val();
        data.btc_amount = $(homeViewController.btc_wallet.amount).val();
        console.log('test' +  data.btc_amount);
        ipcRenderer.send('send_btc', data);
    });


    $(homeViewController.ltc_wallet.send_button).click(function(event){
        event.preventDefault();
   
        let data = {};
        data.ltc_address = $(homeViewController.ltc_wallet.address).val();
        data.ltc_amount = $(homeViewController.ltc_wallet.amount).val();
        console.log('test' +  data.ltc_amount);
        ipcRenderer.send('send_ltc', data);
    });

    $(homeViewController.exchange.exchange_button).click(function(event){
        event.preventDefault();
        console.log("am i here?");
        let data = {};
        data.what_from = $(homeViewController.exchange.what_from).val();
        data.what_to = $(homeViewController.exchange.what_to).val();
        data.address_from = $(homeViewController.exchange.address_from).val();
        data.amount_of =  $(homeViewController.exchange.exchange_amount_from).val();
        data.address_to = $(homeViewController.exchange.address_to).val();
        console.log(data);
        ipcRenderer.send('exchange', data);
        ipcRenderer.on('fee-exchange', (event)=> {
            $('.js-homeView-exchange-amount-to').text('Recieved amount is 20 BTC');
            $('.js-homeView-exchange-fee').text('fee for transaction is 2000d$');
        });
    });

};

ipcRenderer.on('init-main-window', (event, current_user) => {
    console.log(current_user);
    new homeViewController($('.js-homeView-box'), current_user);     
});

$('document').ready(function(){
    $('.js-homeView-box').each(function () {
        new homeViewController(this);
    })
});
