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
  EventEmitter.call(this);
  setInterval(this._refresh.bind(this), 10 * 60 * 1000);
  this._refresh();
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

Pusher.prototype.afterLogin = function (callback, args) {
  var self = this;
  this._login(function (err, cookie) {
    if (err) {
      return callback(err);
    }
    callback.apply(self, args);
  });
};

Pusher.prototype._refresh = function () {
  var self = this;
  proxy.refresh(this.cookie, function (err) {
    if (err) {
      return self._login(function (err) {
        if (err) {
          process.nextTick(function () {
            self.emit('PWechatError', err);
          });
        } else {
          self.emit('connect');          
        }
      });
    }
  });
};

Pusher.prototype.singleSend = function (fakeId, content, callback) {
  if (this.cookie) {
    return proxy.singleSend(fakeId, content, this.cookie, callback);
  }
  this.afterLogin(this.singleSend, arguments);
};

Pusher.prototype.getMessage = function (keyword, count, fromMsgId, callback) {
  if (this.cookie) {
    return proxy.getMessage(this.cookie, keyword, count, fromMsgId, callback);
  }
  this.afterLogin(this.getMessage, arguments);
};

exports.create = function (username, pwd, options) {
  if (typeof username === 'object') {
    options = username;
    return new Pusher(options.username, options.password || options.pwd, options);
  }
  return new Pusher(username, pwd, options);
};

