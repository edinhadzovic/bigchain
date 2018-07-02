const electron = require('electron');
const path = require('path');
const url = require('url');
const op = require('child_process');
const digibyte = require('digibyte');
const market_price = require('./wallets/market_price');
const ShapeShift = require('./lib/Shapeshift');
const blockstack = require('blockstack');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;
const server = op.fork(__dirname + '/lib/Server.js');
ipcMain.setMaxListeners(22);


var verification = require( path.resolve( __dirname, "./verification.js" ));
var User = require('./lib/User');
var Standing = require('./client/Standing');
var message = require('./lib/Message');

// Shapeshift related
let shapeshift = new ShapeShift();

function authCallback(authResponse) {
  // Bring app window to front
  loginWindow.focus();
  return new Promise((resolve, reject) => {
    const tokenPayload = blockstack.decodeToken(authResponse).payload;

    const profileURL = tokenPayload.profile_url;
    fetch(profileURL)
      .then(response => {
        if (!response.ok) {
          reject("Error fetching user profile")
        } else {
          response.text()
          .then(responseText => JSON.parse(responseText))
          .then(wrappedProfile => blockstack.extractProfile(wrappedProfile[0].token))
          .then(profile => {
            console.log(profile);
            resolve(profile);
          });
        }
    });
  });
};


// Testing related

let new_user = null;
  //var DGB = require('./wallets/altcoins/dgb');
  let Altcoins = require('./wallets/altcoins/altcoins');
  let altcoin = new Altcoins();

server.on('message', async (m) => {
  new_user = await authCallback(m.authResponse);
  current_user.saveBlockstack(new_user);
  console.log(new_user);
  createMainWindow();
});

// Global current user
var current_user = new User();
var current_standing = new Standing();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let loginWindow;
let mainWindow;

function createWalletWindow (data) {
  let walletWindow = new BrowserWindow({titleBarStyle: 'hidden',
  width: 300,
  height: 600,
  minWidth: 320,
  backgroundColor: '#d1d1d1',
  show: false });

  walletWindow.loadURL(url.format({
    pathname: path.join(__dirname, `../ClientInterface/views/${data.open}View.html`),
    protocol: 'file:',
    slashes: true
  }))
  let test = current_user[`_${data.coin}_wallet`];
  console.log(test);
  

  walletWindow.once('ready-to-show', () => {
    walletWindow.webContents.send('setWindow', test);
    walletWindow.show();
});

  // and load the index.html of the app.
  // Open the DevTools.
  // loginWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  walletWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    walletWindow = null;
  });
}


function createMainWindow (user, market_info, event) {
  loginWindow.hide();
  
  mainWindow = new BrowserWindow({titleBarStyle: 'hidden',
  width: 750,
  height: 600,
  minWidth: 400,
  minHeight: 350,
  backgroundColor: '#d1d1d1',
  show: false });

  mainWindow.maximize();

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../ClientInterface/views/mainView.html'),
    protocol: 'file:',
    slashes: true
  }));
  

  mainWindow.once('ready-to-show', () => {
    
  });

  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    app.emit('window-all-closed');
  });

    let data = {
      current_user,
      market_info
    };
    event.sender.send('init-main-window', data);
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
    pathname: path.join(__dirname, '../ClientInterface/views/blockstackLoginView.html'),
    protocol: 'file:',
    slashes: true
  }))

  loginWindow.once('ready-to-show', () => {
    loginWindow.show()
});

  // and load the index.html of the app.
  // Open the DevTools.
  // loginWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  loginWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    server.send('quit');
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
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (loginWindow === null) {
    createWindow();
  }
});

ipcMain.on('send', (event, transaction) => {
  console.log(transaction);
});

ipcMain.on('get-user-data', (event) => {
  event.sender.send("init-user-data", current_user);
});

ipcMain.on('start-main-window', (event, user) => {
  createMainWindow(user, event);
})

ipcMain.on("login-submission", async function(event, data) {
  
  console.log(message.main, 'Request to login of a user');

  let result = await current_user.login(data);
  let market_info = await market_price.getTop100();

  if(result === true) {
    console.log(current_user);
    console.log(message.main, "User connected successfully!");
    await current_standing.generate_Standings(current_user);
    console.log(current_standing);
    createMainWindow(current_user, market_info, event);
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
    event.sender.send("register-success", current_user);
  } 
  else {
    console.log(message.main, "Status failed!");
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

// ipcMain.on('get-supported-coins', async (event, data) => {
  
// });

ipcMain.on('Window', (event, data) => {
  if(data.open === "send") {
    createWalletWindow(data);
  }
});

ipcMain.on('send_btc', async function(event, data) { 
  current_user._btc_wallet.send(data.amount, data.address, current_user._btc_wallet);

});

ipcMain.on('get-btc', async function(event) {
  let data = {};
  
  data.market_price = await market_price.getBtcPrice(current_user._btc_wallet);
  data.standing = await current_user._btc_wallet.readStandingFromAddress(current_user._btc_wallet);
  event.sender.send('init-btc-info', data);
});

ipcMain.on('send_ltc', async function(event, data) { 
  console.log(data);
  current_user._ltc_wallet.send(data.amount, data.address, current_user._ltc_wallet);
});


ipcMain.on('get-ltc', async function(event) {
  let data = {};
  
  data.market_price = await market_price.getLtcPrice(current_user._ltc_wallet);
  data.standing = await current_user._ltc_wallet.readStandingFromAddress(current_user._ltc_wallet);
  event.sender.send('init-ltc-info', data);
});

ipcMain.on('send_bch', async function(event, data) { 
  console.log(message.main, data);
  current_user._bch_wallet.send(data.amount, data.address, current_user._bch_wallet);
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

ipcMain.on('send_eth', async function(event, data) { 
  console.log(data);
  current_user._eth_wallet.send(data.amount, data.address, current_user._eth_wallet);
  //console.log('DIDNT IMPLEMENTED SEND YET');
});

ipcMain.on('get-eth', async function(event) {
  let data = {};
  
  data.market_price = await market_price.getEthPrice(current_user._eth_wallet);
  data.standing = await current_user._eth_wallet.readStandingFromAddress(current_user._eth_wallet);
  event.sender.send('init-eth-info', data);
});

ipcMain.on('exchange', async function(event,data){
  console.log(data);
  let new_data = {};
  new_data.address_from = current_user[data.tradeFrom].address;
  new_data.address_to = current_user[data.tradeTo].address;
  new_data.pair = data.pair;
  new_data.amount_of = data.tradeFromAmount;
  shapeshift.shiftFixed(new_data).then((res) => {
    console.log(res);
  }).catch(e => console.log(e));
  event.sender.send('fee_exchange');
})

ipcMain.on('get-supported-coins', async (event, data) => {
  let coins = await shapeshift.getCoins();
  if(coins.length > 0) {
    return event.sender.send('resolve-supported-coins', coins, current_standing);
  }
});

ipcMain.on('getPair', async (event, pair) => {
  let pairs = await shapeshift.getPairRate(pair);
  console.log(pairs);
  event.sender.send('returnPair', pairs);
})

ipcMain.on('exchange-market-info', async(event, pair) => {
  let market_info = await shapeshift.getMarketInfo(pair);
  // console.log("Market Info", market_info);
  event.sender.send('market-info-result', market_info);
});

ipcMain.on('get-user-coin', async (event, coin_info) => {
  console.log(coin_info);
  if(coin_info.type === 'bch') {
    let data = {};
    data.amount = await current_user._bch_wallet.readStandingFromAddress(current_user._bch_wallet);
    data.market_price = await market_price.getBchPrice();
    data.type = 'bch';
    event.sender.send('get-user-coins', data);
  }
  if(coin_info.type === 'btc') {
    let data = {};
    data.amount = await current_user._btc_wallet.readStandingFromAddress(current_user._btc_wallet);
    data.type = 'btc';
    event.sender.send('get-user-coins', data)
  }
})

ipcMain.on('getMarketCap', async (event) => {
  let market = await market_price.getTop100();
  if(market.length !== 0) {
    event.sender.send('sendMarketCap', market);
  }
});


// ipcMain.on('Open-btc-wallet', event => {
//   createWalletWindow('btc');
// })
