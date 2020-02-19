/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");
const IP = require("../models/ip");
const Stock = require("../models/stock");

process.env.NODE_ENV = "test";

chai.use(chaiHttp);

suite("Functional Tests", function() {
  this.timeout(5000);

  suite("GET /api/stock-prices => stockData object", function() {
    before(done => {
      //Before each test we empty the database
      IP.remove({}, err => {
        done();
      });
      Stock.remove({}, err => {
        done();
      });
    });

    test("1 stock", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "GOOG" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "stockData");
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.property(res.body.stockData, "price");
          assert.typeOf(res.body.stockData.price, "number");
          assert.property(res.body.stockData, "likes");
          assert.typeOf(res.body.stockData.likes, "number");
          assert.equal(res.body.stockData.likes, 0);

          done();
        });
    });

    test("1 stock with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "GOOG", like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "stockData");
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.property(res.body.stockData, "price");
          assert.typeOf(res.body.stockData.price, "number");
          assert.property(res.body.stockData, "likes");
          assert.typeOf(res.body.stockData.likes, "number");
          assert.equal(res.body.stockData.likes, 1);

          done();
        });
    });

    test("1 stock with like again (ensure likes arent double counted)", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "GOOG", like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "stockData");
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.property(res.body.stockData, "price");
          assert.typeOf(res.body.stockData.price, "number");
          assert.property(res.body.stockData, "likes");
          assert.typeOf(res.body.stockData.likes, "number");
          assert.equal(res.body.stockData.likes, 1);

          done();
        });
    });

    test("2 stocks", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query("stock=GOOG&stock=MSFT")
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "stockData");
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData.length, 2);
          assert.equal(res.body.stockData[0].stock, "GOOG");
          assert.equal(res.body.stockData[1].stock, "MSFT");
          assert.property(res.body.stockData[0], "price");
          assert.property(res.body.stockData[1], "price");
          assert.typeOf(res.body.stockData[0].price, "number");
          assert.typeOf(res.body.stockData[1].price, "number");
          assert.property(res.body.stockData[0], "rel_likes");
          assert.property(res.body.stockData[1], "rel_likes");
          assert.typeOf(res.body.stockData[0].rel_likes, "number");
          assert.typeOf(res.body.stockData[1].rel_likes, "number");
          assert.equal(res.body.stockData[0].rel_likes, 1);
          assert.equal(res.body.stockData[1].rel_likes, -1);

          done();
        });
    });

    test("2 stocks with like", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query("stock=GOOG&stock=MSFT&like=true")
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "stockData");
          assert.isArray(res.body.stockData);
          assert.equal(res.body.stockData.length, 2);
          assert.equal(res.body.stockData[0].stock, "GOOG");
          assert.equal(res.body.stockData[1].stock, "MSFT");
          assert.property(res.body.stockData[0], "price");
          assert.property(res.body.stockData[1], "price");
          assert.typeOf(res.body.stockData[0].price, "number");
          assert.typeOf(res.body.stockData[1].price, "number");
          assert.property(res.body.stockData[0], "rel_likes");
          assert.property(res.body.stockData[1], "rel_likes");
          assert.typeOf(res.body.stockData[0].rel_likes, "number");
          assert.typeOf(res.body.stockData[1].rel_likes, "number");
          assert.equal(res.body.stockData[0].rel_likes, 1);
          assert.equal(res.body.stockData[1].rel_likes, -1);

          done();
        });
    });
  });
});
