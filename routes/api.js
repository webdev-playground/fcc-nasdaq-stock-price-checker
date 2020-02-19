/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
const superagent = require("superagent");

module.exports = function(app) {
  app.route("/api/stock-prices").get(async function(req, res) {
    let { stock, like } = req.query;
    const ip = req.ip;
    
    try {
      if (!Array.isArray(stock)) {
        stock = [stock];
      }
      
      const data = []

      for (let st of stock) {
        const price = await getStockPrice(st);
        const likes = like ? 1 : 0;
        
        const stData = { stock: st, price: price, likes: likes };
        
        data.push(stData);
      }
      
      const stockData = { stockData: data };
      if (data.length === 1) {
        stockData.stockData = data[0];
      }

      return res
        .status(200)
        .json(stockData);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  });
};

async function getStockPrice(stock) {
  try {
    const data = await superagent.get(
      `https://repeated-alpaca.glitch.me/v1/stock/${stock}/quote`
    );

    if (data.body === "Unknown symbol") {
      throw new Error("Unknown symbol");
    }

    return data.body.latestPrice;
  } catch (err) {
    throw err;
  }
}
