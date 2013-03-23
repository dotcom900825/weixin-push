/*!
 * pushwechat - lib/pushwechat.js 
 * Copyright(c) 2012 Taobao.com
 * Author: dead-horse <dead_horse@qq.com>
 */


/**
 * Module dependencies.
 */
var proxy = require('./proxy');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var utility = require('utility');

var Pusher = function (username, pwd, options) {
  this.username = username || '';
  this.pwd = pwd || '';
  this.keepAlive = !!options.keepAlive;
  EventEmitter.call(this);
  if (options.keepAlive) {
    setInterval(this._refresh.bind(this), 10 * 60 * 1000);
    this._refresh();
  }
};
util.inherits(Pusher, EventEmitter);

Pusher.prototype._login = function(callback) {
  var self = this;
  proxy.login(self.username, self.pwd, function (err, cookie) {
    if (err) {
      return callback(err);
    }
    self.cookie = cookie;
    callback(null, cookie);
  });
};

Pusher.prototype._refresh = function () {
  var self = this;
  proxy.refresh(this.cookie, function (err) {
    if (err) {
      return self._login(utility.noop);
    }
  });
};

Pusher.prototype.singleSend = function (fakeId, content, callback) {
  if (this.keepAlive && this.cookie) {
    return proxy.singleSend(fakeId, content, this.cookie, callback);
  }
  this._login(function (err, cookie) {
    if (err) {
      return callback(err);
    }
    proxy.singleSend(fakeId, content, cookie, callback);
  });
};

exports.create = function (username, pwd, options) {
  if (typeof username === 'object') {
    options = username;
    return new Pusher(options.username, options.password || options.pwd, options);
  }
  return new Pusher(username, pwd, options);
};