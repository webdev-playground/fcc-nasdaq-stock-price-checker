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

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

suite("Functional Tests", function() {
  this.timeout(5000);
  
  suite("GET /api/stock-prices => stockData object", function() {
    test("1 stock", function(done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "GOOG" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.property(res.body.stockData, 'price');
          assert.typeOf(res.body.stockData.price, 'number');
          assert.property(res.body.stockData, 'likes');
          assert.typeOf(res.body.stockData.likes, 'number');
          
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
          assert.property(res.body, 'stockData');
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.property(res.body.stockData, 'price');
          assert.typeOf(res.body.stockData.price, 'number');
          assert.property(res.body.stockData, 'likes');
          assert.typeOf(res.body.stockData.likes, 'number');
          
          done();
        });
    });

    test("1 stock with like again (ensure likes arent double counted)", function(done) {});

    test("2 stocks", function(done) {});

    test("2 stocks with like", function(done) {});
  });
});
