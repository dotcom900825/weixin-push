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
var Pusher = require('../');

var pusher;
var loginBack;
describe('lib/pushwechat.js', function () {
  before(function (done) {
    pusher = Pusher.create('testname', 'testpwd');
    loginBack = proxy.login;
    proxy.login = function (name, pwd, callback) {
      process.nextTick(function () {
        return callback(null, 'mock cookie');
      });
    }
    pusher.once('connect', done);
  });
  after(function () {
    proxy.login = loginBack;
  });

  describe('#singleSend', function () {
    afterEach(mm.restore);
    
    it('should error when proxy error', function (done) {
      mm.error(proxy, 'singleSend', 'mock error');
      pusher.singleSend('fakeId', 'content', function (err, data) {
        err.message.should.equal('mock error');
        should.not.exist(pusher.cookie);
        pusher.cookie = 'mock cookie';
        done();
      });
    });
    
    it('should ok when has cookie', function (done) {
      mm.data(proxy, 'singleSend', {ret: 0, msg: 'ok'});
      pusher.singleSend('fakeId', 'content', function (err, data) {
        should.not.exist(err);
        data.should.eql({ret: 0, msg: 'ok'});
        done();
      });
    });

    it('should ok when no cookie', function (done) {
      mm.data(proxy, 'singleSend', {ret: 0, msg: 'ok'});
      pusher.cookie = null;
      pusher.singleSend('fakeId', 'content', function (err, data) {
        should.not.exist(err);
        data.should.eql({ret: 0, msg: 'ok'});
        pusher.cookie.should.equal('mock cookie');
        done();
      });
    });
  });

  describe('#getMessage', function () {
    afterEach(mm.restore);

    it('should error when proxy error', function (done) {
      mm.error(proxy, 'getMessage', 'mock error');
      pusher.getMessage('fakeId', 'content', 100, function (err, data) {
        err.message.should.equal('mock error');
        should.not.exist(pusher.cookie);
        pusher.cookie = 'mock cookie';
        done();
      });
    });

    it('should ok when has cookie', function (done) {
      mm.data(proxy, 'getMessage', [{}]);
      pusher.getMessage('fakeId', 'content', 100, function (err, data) {
        should.not.exist(err);
        data.should.eql([{}]);
        done();
      });
    });

    it('should error when no cookie and login error', function (done) {
      pusher.cookie = null;
      mm.error(proxy, 'login', 'mock error');
      pusher.getMessage('fakeId', 'content', 100, function (err, data) {
        err.message.should.equal('mock error');
        should.not.exist(pusher.cookie);
        pusher.cookie = 'mock cookie';
        done();
      });
    });

    it('should ok when no cookie', function (done) {
      mm.data(proxy, 'getMessage', [{}]);
      pusher.cookie = null;
      pusher.getMessage('fakeId', 'content', 100, function (err, data) {
        should.not.exist(err);
        data.should.eql([{}]);
        pusher.cookie.should.equal('mock cookie');
        done();
      });
    });
  });

  describe('#_refresh', function () {
    afterEach(mm.restore);
    it('should refresh ok', function (done) {
      pusher._refresh();
      pusher.once('connect', done);
    });

    it('should refresh error', function (done) {
      mm.error(proxy, 'refresh', 'mock error');
      mm.error(proxy, 'login', 'mock error');
      pusher.once('PWechatError', function (err) {
        err.message.should.equal('mock error');
        should.not.exist(pusher.cookie);
        done();
      });
      pusher._refresh();
    })
  });
});