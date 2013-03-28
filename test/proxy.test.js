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
          callback(null, '{"ErrCode": 0}', {statusCode: 200, headers: {'set-cookie': ['mock cookie'] }});
        }); 
      });
      proxy.login('test@gmail.com', '123', function (err, data) {
        should.not.exist(err);
        data.should.equal('mock cookie');
        done();
      });
    });
  });

  describe('#singleSend', function () {
    afterEach(mm.restore);

    it('should reponse err', function (done) {
      mm.error(urllib, 'request', 'mock error');
      proxy.singleSend('123', 'test', 'cookie', function (err) {
        err.message.should.equal('mock error');
        done();
      });
    });

    it('should response error by statusCode', function (done) {
      mm(urllib, 'request', function (url, opts, callback) {
        process.nextTick(function () {
          callback(null, 'test', {statusCode: 302});
        });
      });
      proxy.singleSend('123', 'test', 'cookie', function (err) {
        err.message.should.equal('singleSend Error! status code:302');
        done();
      });
    });

    it('should response parse error', function (done) {
      mm(urllib, 'request', function (url, opts, callback) {
        process.nextTick(function () {
          callback(null, 'test', {statusCode: 200});
        });
      });
      proxy.singleSend('123', 'test', 'cookie', function (err) {
        err.message.should.equal('singleSend Error! Unexpected token e');
        done();
      });      
    });

    it('should ok', function (done) {
      mm(urllib, 'request', function (url, opts, callback) {
        process.nextTick(function () {
          callback(null, '{"ret":0, "msg":"ok"}', {statusCode: 200});
        });
      });
      proxy.singleSend('123', 'test', 'cookie', function (err, data) {
        should.not.exist(err);
        data.should.eql({ret: 0, msg: 'ok'});
        done();
      });      
    });
  });

  describe('#refresh', function () {
    afterEach(mm.restore);
    
    it('should reponse err', function (done) {
      mm.error(urllib, 'request', 'mock error');
      proxy.refresh('cookie', function (err) {
        err.message.should.equal('mock error');
        done();
      });
    });

    it('should response error by statusCode', function (done) {
      mm(urllib, 'request', function (url, opts, callback) {
        process.nextTick(function () {
          callback(null, 'test', {statusCode: 302});
        });
      });
      proxy.refresh('cookie', function (err) {
        err.message.should.equal('refresh Error! status code:302');
        done();
      });
    });

    it('should refresh error by data', function (done) {
      mm(urllib, 'request', function (url, opts, callback) {
        process.nextTick(function () {
          callback(null, '{"ret":0, "msg":"ok"}', {statusCode: 200});
        });
      });
      proxy.refresh('cookie', function (err) {
        err.message.should.equal('login become invalid');
        done();
      });
    });

    it('should refresh ok', function (done) {
      mm(urllib, 'request', function (url, opts, callback) {
        process.nextTick(function () {
          callback(null, new Buffer('实时消息'), {statusCode: 200});
        });
      });
      proxy.refresh('cookie', function (err) {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('#getMessage', function () {
    it('should reponse err', function (done) {
      mm.error(urllib, 'request', 'mock error');
      proxy.getMessage('123', 'test', 'cookie', 100, function (err) {
        err.message.should.equal('mock error');
        done();
      });
    });

    it('should response error by statusCode', function (done) {
      mm(urllib, 'request', function (url, opts, callback) {
        process.nextTick(function () {
          callback(null, 'test', {statusCode: 302});
        });
      });
      proxy.getMessage('123', 'test', 'cookie', 100, function (err) {
        err.message.should.equal('getMessage Error! status code:302');
        done();
      });
    });

    it('should response parse error', function (done) {
      mm(urllib, 'request', function (url, opts, callback) {
        process.nextTick(function () {
          callback(null, 'test', {statusCode: 200});
        });
      });
      proxy.getMessage('123', 'test', 'cookie', 100, function (err) {
        err.message.should.equal('getMessage Error! Unexpected token e');
        done();
      });      
    });

    it('should get ok', function (done) {
      mm(urllib, 'request', function (url, opts, callback) {
        process.nextTick(function () {
          callback(null, new Buffer('[]'), {statusCode: 200});
        });
      });
      proxy.getMessage('123', 'test', 'cookie', 100, function (err, data) {
        should.not.exist(err);
        data.should.eql([]);
        done();
      });
    });    
  });
});