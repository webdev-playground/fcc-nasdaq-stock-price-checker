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

      // Check if IP already recorded - i.e. user has already submitted one like
      const ip = req.ip;
      const foundIp = await IP.exists({ ip: ip });

      if (foundIp) {
        console.log("IP already exists");
      } else {
        console.log('Unique IP');
      }

      // Increment only if didn't find IP, and query like is true
      const incLike = !foundIp && like ? 1 : 0;

      const data = [];

      for (let st of stock) {
        const price = await getStockPrice(st);

        // increment likes
        const s = await Stock.findOneAndUpdate(
          { stock: st },
          {
            stock: st,
            price: price,
            $inc: {
              likes: incLike
            }
          },
          { new: true, upsert: true } // create new document if does not already exist
        );

        data.push(s);
      }

      // store IP in db
      if (incLike > 0) {
        await IP.create({ ip: ip });
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
