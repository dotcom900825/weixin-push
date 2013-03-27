/*!
 * pushwechat - lib/proxy.js 
 * Copyright(c) 2012 Taobao.com
 * Author: dead-horse <dead_horse@qq.com>
 */


/**
 * Module dependencies.
 */
var proxy = require('../').proxy;
var mm = require('mm');
var should = require('should');
var urllib = require('urllib');

describe('lib/proxy.js', function () {
  describe('#login', function () {
    afterEach(mm.restore);
    it('should response response error', function (done) {
      mm.data(urllib, 'request', '{a: 1}');
      proxy.login('test@gmail.com', '123', function (err, data) {
        err.message.should.equal('response error');
        should.not.exist(data);
        done();
      });
    });

    it('should response login error', function (done) {
      mm(urllib, 'request', function (url, opts, callback) {
        process.nextTick(function () {
          callback(new Error('mock error'), '{"a": "b"}');
        });
      });
      proxy.login('test@gmail.com', '123', function (err, data) {
        err.message.should.equal('mock error');
        should.not.exist(data);
        done();
      });      
    });

    it('should response ok', function (done) {
      mm(urllib, 'request', function (url, opts, callback) {
        process.nextTick(function () {
          callback(null, '{"ErrCode": 0}', {statusCode: 200, headers: {'set-cookie': ['mock cookie']}});
        });
      });
      proxy.login('test@gmail.com', '123', function (err, data) {
        should.not.exist(err);
        data.should.equal('mock cookie');
        done();
      });
    });
  });
});