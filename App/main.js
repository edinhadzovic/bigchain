const electron = require('electron');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;

const path = require('path')
const url = require('url')

var verification = require( path.resolve( __dirname, "./verification.js" ))
var data_cryption = require('../ClientInterface/javascript/data_cryption')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

async function createWindow () {
  try {
    //let result = await wallet.getWalletValue();
  } catch (error) {
    console.log(error);
  }

  // Create the browser window.
  mainWindow = new BrowserWindow();
  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../ClientInterface/views/loginView.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//Getting user input
ipcMain.on("login-submission", function(event, data) {
  event.sender.send("login-success", data);
});

ipcMain.on("register-submission", async function(event, data) {

  var err = [];
  var isStored = 0;
  let check = await check_val(data);
  //check_val(data, isStored, err);
  if (err.length > 0) {
    console.log(err);
    console.log('Houston we have a problem');
  }
  else {
    console.log('Everything went well!');
  }
  //
  // TODO: THIS FUNCTION HAS TO WAIT FOR CHECK_VAL TO BE FINISHED!
  // HAVE NO IDEA WHY ITS NOT WORKING ...
  // 
  // If it's stored return success, if not return fail with errors
  if (isStored) {
    console.log("status success");
    event.sender.send("register-success");
  } 
  else {
    console.log("status failed");
    event.sender.send("register-failed", err);
  }
});


let check_val = (data) => {
  return new Promise((resolve, reject) => {
    console.log('Starting the verification of the user ');
    let success = verification.verify(data).then((result) => {
      create_dir(result)
    }).catch(e => console.log(e));
  });
}

/*function check_val(data, isStored, err){
  console.log('Starting the verification of the user ');
  let success = verification.verify(data, (err, isStored) => {
    if(err) return false;
    create_dir(data, isStored, (err) => {
      if(err) return false;
    })
  })
  verification.verify(data, err);
  if (err.length > 0) {
    return 0;
  }
  create_dir(data, isStored, err );
  //create_dir(data, isStored, err );
};*/

function create_dir(data){
    data_cryption.pepper(data).then((result) => {
      console.log(result);
    }).catch(e => console.log(e));
}; 
