const electron = require('electron');
const path = require('path');
const url = require('url');
const digibyte = require('digibyte');
const market_price = require('./wallets/market_price');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;
var exec  = require('child_process').exec,
    child;

child = exec(path.resolve(__dirname, "./CryptoCoin test"),
  function (error, stdout, stderr) {
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    if (error !== null) {
      console.log('exec error:', error);
    }
});


var verification = require( path.resolve( __dirname, "./verification.js" ));
var User = require('./lib/User');
var message = require('./lib/Message');
var DGB = require('./wallets/dgb');


// Global current user
var current_user = new User();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let loginWindow;
let mainWindow;

function createMainWindow (user, event) {
  loginWindow.hide();
  mainWindow = new BrowserWindow({titleBarStyle: 'hidden',
  width: 400,
  height: 600,
  minWidth: 400,
  minHeight: 600,
  backgroundColor: '#d1d1d1',
  show: false });

  mainWindow.maximize();

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../ClientInterface/views/mainView.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.once('ready-to-show', () => {
    console.log("send the message");
    event.sender.send('init-main-window', current_user);
  });

  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    app.emit('window-all-closed');
  });
}

function createWindow () {
  try {
    //let result = await wallet.getWalletValue();
  } catch (error) {
    console.log(error);
  }

  // Create the browser window.
  loginWindow = new BrowserWindow({titleBarStyle: 'hidden',
  width: 400,
  height: 600,
  minWidth: 400,
  minHeight: 600,
  backgroundColor: '#d1d1d1',
  show: false
});
  //loginWindow.maximize();

  loginWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../ClientInterface/views/loginView.html'),
    protocol: 'file:',
    slashes: true
  }))

  loginWindow.once('ready-to-show', () => {
    loginWindow.show();
});

  // and load the index.html of the app.
  

  // Open the DevTools.
  // loginWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  loginWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    loginWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (loginWindow === null) {
    createWindow();
  }
});

ipcMain.on('get-user-data', (event) => {
  event.sender.send("init-user-data", current_user);
});

ipcMain.on("login-submission", async function(event, data) {
  
  console.log(message.main, 'Request to login of a user');

  let result = await current_user.login(data);
  console.log(message.main,current_user);
  if(result === true) {
    console.log(message.main, "User connected successfully!");
    createMainWindow(current_user, event);
  } else {
    console.log(message.main, 'Login failed');
    console.log(' ');
    event.sender.send("login-failed", result);
  }
  
});

ipcMain.on("register-submission", async function(event, data) {
  console.log(message.main, 'Request for creation of new user.');
  let result = await current_user.generateUser(data);
  if (result.success) {
    console.log(message.main, "Status success!");
    console.log(' ');
    event.sender.send("register-success", current_user);
  } 
  else {
    console.log(message.main, "Status failed!");
    console.log(' '); 
    event.sender.send("register-failed", result);
  }
});

ipcMain.on("personal-info-submission", async function(event, data) {
  console.log(message.main, 'Personal information provided!');
  let result = await current_user.personal_info_save(current_user, data);
  if (result === true) {
    console.log(message.main, 'Storing of personal information successfully done.');
    console.log(' ');
    event.sender.send('store-personal-info-success', current_user);
  } else {
    console.log(message.main, 'Storing of personal information failed.');
    console.log(' ');
    event.sender.send('store-personal-info-failed', result);
  }
});

ipcMain.on("personal-info-change", async function(event, data) {
  console.log(message.main, 'Personal information changing!');
  console.log(message.main, 'New user data provided!');
  console.log(message.main, 'Name: ', data.first_name);
  console.log(message.main, 'Last name: ', data.last_name);
  console.log(message.main, 'Birthday: ', data.birthday);
  console.log(message.main, 'Gender: ', data.gender);
  console.log(message.main, 'Phone: ', data.phone);

  let result = await current_user.personal_info_change(current_user, data);
  if (result === true) {
    console.log(message.main, 'Restoring successfully done.');
    console.log(' ');
    event.sender.send('store-success', current_user);
  } else {
    console.log(message.main, 'Restoring failed.');
    console.log(' ');
    event.sender.send('store-failed', result);
  }
});

ipcMain.on("address-info-submission", async function(event, data) {
  console.log(message.main, 'Personal information provided!');
  let result = await current_user.address_info_save(current_user, data);
  if (result === true) {
    console.log(message.main, 'Storing of address information successfully done.');
    console.log(' ');
    event.sender.send('store-address-info-success', current_user);
  } else {
    console.log(message.main, 'Storing of address information failed.');
    console.log(' ');
    event.sender.send('store-address-info-failed', result);
  }
});

ipcMain.on("address-info-change", async function(event, data) {
  console.log(message.main, 'Personal information provided!');
  let result = await current_user.address_info_change(current_user, data);
  if (result === true) {
    console.log(message.main, 'Storing of address information successfully done.');
    console.log(' ');
    event.sender.send('change-address-info-success', current_user);
  } else {
    console.log(message.main, 'Storing of address information failed.');
    console.log(' ');
    event.sender.send('change-address-info-failed', result);
  }
});

ipcMain.on('form-submission-image', async function(event, data){
  console.log(message.main, data);
  let result = await current_user.save_image(current_user, data);
  if(result === true) {
    let generate_address = await current_user.generate_wallets();
    console.log(message.main, 'Storing');
    createMainWindow(current_user, event);
  } else {
    console.log("false");
  }
});

ipcMain.on('generate-dgb-address', async function(event) {
  console.log(message.main, "generate new dgb address");
  // let wallet = new DGB;
  // let privateKey = wallet.generatePrivateKey();
  try {
    // let address = wallet.generateAddress(privateKey);    
    var privateKey = new digibyte.PrivateKey();
    console.log(privateKey);
    // var publicKey = privateKey.publicKey;
    // var address = publicKey.toAddress();   
    event.sender.send('generate-dgb-address-success', privateKey);  
  } catch (error) {
    console.log(error);
  }
  console.log(message.main, "generate new private key");
});

ipcMain.on('send_btc', async function(event, data) { 
  current_user._btc_wallet.send(data.btc_amount, data.btc_address, current_user._btc_wallet);

});

ipcMain.on('get-btc', async function(event) {
  let data = {};
  
  data.market_price = await market_price.getBtcPrice(current_user._btc_wallet);
  data.standing = await current_user._btc_wallet.readStandingFromAddress(current_user._btc_wallet);
  event.sender.send('init-btc-info', data);
});

ipcMain.on('send_ltc', async function(event, data) { 
  current_user._ltc_wallet.send(data.ltc_amount, data.ltc_address, current_user._ltc_wallet);

});


ipcMain.on('get-ltc', async function(event) {
  let data = {};
  
  data.market_price = await market_price.getLtcPrice(current_user._ltc_wallet);
  data.standing = await current_user._ltc_wallet.readStandingFromAddress(current_user._ltc_wallet);
  event.sender.send('init-ltc-info', data);
});

ipcMain.on('send_ltc', async function(event, data) { 
  current_user._ltc_wallet.send(data.ltc_amount, data.ltc_address, current_user._ltc_wallet);
});

ipcMain.on('get-bch', async function(event) {
  try {
    let data = {};
    console.log(message.main, "get Bch");
    
    data.market_price = await market_price.getBchPrice(current_user._bch_wallet);
    data.standing = await current_user._bch_wallet.readBalance(current_user._bch_wallet);
    console.log(message.main, "send back to user");
    event.sender.send('init-bch-info', data); 
  } catch (err) {
    console.log(err);
  }
});

ipcMain.on('send_bch', async function(event, data) { 
  console.log(message.main, data);
  current_user._bch_wallet.send(data.bch_amount, data.bch_address, current_user._bch_wallet);
});

ipcMain.on('send_eth', async function(event, data) { 
  console.log(data);
  current_user._eth_wallet.send(data.eth_amount, data.eth_address, current_user._eth_wallet);
  //console.log('DIDNT IMPLEMENTED SEND YET');
});


ipcMain.on('get-eth', async function(event) {
  let data = {};
  
  data.market_price = await market_price.getEthPrice(current_user._eth_wallet);
  data.standing = await current_user._eth_wallet.readStandingFromAddress(current_user._eth_wallet);
  event.sender.send('init-eth-info', data);
});

