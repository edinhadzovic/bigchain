const shapeshift = require('shapeshift.io');
const requst = require('request');
const http = require('./http-node');

let basicUrl = 'https://shapeshift.io';


class Shapeshift {
  constructor(){
    this.availableCoins = [];
    this.unavaiableCoins = [];
  }

  getCoins(){
    return new Promise((resolve, reject) => {
      shapeshift.coins(function(err, coinData) {
        if(err) reject(err);
        resolve(coinData);
      });
    });
  }

  /**
   * return {Object}
   */
  getCoinsManuel(){
    let url = basicUrl + '/getcoins';
    return new Promise((resolve, reject) => {
      requst.get({url: url, json: true}, (err, response, body) => {
        if(err) reject(body);
        if (response.statusCode !== 200) reject(new Error('HTTP status code: ' + response.statusCode));
        resolve(body);
      });
    });
  }

  getPairRate(pair){
    let url = `${basicUrl}/rate/${pair}`;
    return new Promise((resolve, reject) => {
      requst.get({url: url, json: true}, (err, response, body) => {
        if(err) reject(body);
        if(response.statusCode !== 200) reject(new Error('HTTP status code:' + response.statusCode));
        resolve(body);
      });
    });
  }

  getPairLimit(pair){
    let url = `${basicUrl}/limit/${pair}`;
    return new Promise((resolve, reject) => {
      requst.get({url: url, json: true}, (err, response, body) => {
        if(err) reject(body);
        if(response.statusCode !== 200) reject(new Error('HTTP status code:' + response.statusCode));
        resolve(body);
      });
    });
  }

  getMarketInfo(pair){
    let url = `${basicUrl}/marketinfo/${pair}`;
    return new Promise((resolve, reject) => {
      requst.get({url: url, json: true}, (err, response, body) => {
        if(err) reject(body);
        if(response.statusCode !== 200) reject(new Error('HTTP status code:' + response.statusCode));
        resolve(body);
      });
    });
  }

  getRecentTx(max){
    let url = `${basicUrl}/recenttx/${max}`;
    return new Promise((resolve, reject) => {
      requst.get({url: url, json: true}, (err, response, body) => {
        if(err) reject(body);
        if(response.statusCode !== 200) reject(new Error('HTTP status code:' + response.statusCode));
        resolve(body);
      });
    });
  }

  shiftFixed(data){
    let body = {};
    body.apiKey = '342ae1849ae05e1dcc801bae4925197139da819bd2e92e2fdad6dda89e94018e2ef33192409168e9dc3ce8e36af406c85ffbde508225e9c1ead30ed3daf6bcb5';
    body.returnAddress = data.address_from;
    body.amount = data.amount_of;
    body.withdrawal = data.address_to;
    body.pair = `${data.what_from}_${data.what_to}`;
    console.log(body);
    let url = `${basicUrl}/sendamount`;
    return new Promise((resolve, reject) => {
      requst.post({url: url, json: true, body: body}, function (err, resp, data) {
        if (err) return reject(err);
        if (resp.statusCode !== 200) return reject(new Error('HTTP status code: ' + resp.statusCode));
        resolve(data);
      });
    });
  }
}

module.exports = Shapeshift;