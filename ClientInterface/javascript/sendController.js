const {SendModule} = require('./../../App/client/utils');

require('electron').ipcRenderer.on('setWindow', (event, data) => {
  new SendModule($('.js-send-coin'), data);
});