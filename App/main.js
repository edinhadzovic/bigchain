const electron = require('electron');
const path = require('path');
const url = require('url');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;


var verification = require( path.resolve( __dirname, "./verification.js" ));
var User = require('./lib/User');
var message = require('./lib/Message');


// Global current user
var current_user = new User();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let loginWindow;

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
    loginWindow.show()
})

  // and load the index.html of the app.
  

  // Open the DevTools.
  // loginWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  loginWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    loginWindow = null;
  })
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
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (loginWindow === null) {
    createWindow();
  }
})

ipcMain.on("login-submission", async function(event, data) {
  
  console.log(message.main, 'Request to login of a user');

  let result = await current_user.login(data);

  if(result === true) {
    console.log(message.main, "User connected successfully!");
    console.log(' ');
    event.sender.send("login-success", current_user);
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
  let result = await current_user.personal_info_change(current_user, data);
  if (result === true) {
    console.log(message.main, 'Changing of personal information successfully done.');
    console.log(' ');
    event.sender.send('store-success', current_user);
  } else {
    console.log(message.main, 'Changing of personal information failed.');
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


// USE IT WHEN CHANGE IS CREATED IN SETTINGS

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
  let result = await current_user.save_image(current_user, data);
  if(result === true) {
    console.log(message.main, 'Storing');
    event.sender.send('image-submission-success', current_user);
  } else {
    console.log("false");
  }
});

