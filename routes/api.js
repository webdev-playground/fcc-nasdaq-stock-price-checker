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
const Stock = require("../models/stock");
const IP = require("../models/ip");

module.exports = function(app) {
  app.route("/api/stock-prices").get(async function(req, res) {
    let { stock, like } = req.query;

    try {
      if (!stock) {
        throw new Error("stock symbol needs to be provided in query");
      }

      if (!Array.isArray(stock)) {
        stock = [stock];
      }

      if (stock.length > 2) {
        throw new Error("a maximum of 2 stocks can be specified");
      }

      const data = [];

      for (let st of stock) {
        const price = await getStockPrice(st);
        const likes = like ? 1 : 0;

        let stockLikes;
        // Check if IP address has already been recorded
        if (likes > 0) {
          const ip = req.ip;
          const foundIp = await IP.findOne({ ip: ip });
          if (!foundIp) {
            // store IP in db
            await IP.save({ ip: ip });

            // increment likes
            stockLikes = await Stock.findOneAndUpdate(
              { stock: st },
              {
                $inc: {
                  likes: 1
                }
              },
              { new: true }
            );
          }
        }
        
        if (!stockLikes) {
          stockLikes = await Stock.findOne({ stock: st });
        }

        const stData = { stock: st, price: price, likes: stockLikes.likes };

        data.push(stData);
      }

      const stockData = { stockData: data };
      if (data.length === 1) {
        stockData.stockData = data[0];
      }

      return res.status(200).json(stockData);
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
