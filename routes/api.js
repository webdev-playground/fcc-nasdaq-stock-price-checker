/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const superagent = require('superagent');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      const { stock, like } = req.query;
//       if (Array.isArray(stock)) {
        
//       }
      try {
        const data = await superagent.get(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`);

        if (data.body === 'Unknown symbol') {
          throw new Error('Unknown symbol');
        }
        
        console.log(data.body.latestPrice);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    });
};

async function getStockPrice(stock) {
      try {
        const data = await superagent.get(`https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`);

        if (data.body === 'Unknown symbol') {
          throw new Error('Unknown symbol');
        }
      } catch (err) {
        return res.status(400).json({ error: err.message });
      } 
}