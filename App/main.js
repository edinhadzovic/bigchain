const electron = require('electron');
const bigchain = require('./wallets/dgb/bigchain');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;

const path = require('path')
const url = require('url')

var data_cryption = require('../ClientInterface/javascript/data_cryption');
app.commandLine.appendSwitch('disable-smooth-scrolling');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

async function createWindow () {
  try {
    //let result = await wallet.getWalletValue();
  } catch (error) {
    console.log(error);
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({titleBarStyle: 'hidden',
  width: 1281,
  height: 800,
  minWidth: 1281,
  minHeight: 800,
  backgroundColor: '#a3c6ff',
  show: false
});
  mainWindow.maximize();

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../ClientInterface/views/mainView.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
})

  // and load the index.html of the app.
  

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
ipcMain.on("form-submission", function(event, data){
  create_dir(data);
  //TODO: logic for saving user information in c++ to be implemented.
  event.sender.send("login-success", data);
});


function create_dir(data){
    data_cryption.pepper(data);
    console.log("The file was saved!");
}; 

