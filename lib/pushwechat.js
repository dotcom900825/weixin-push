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

var Pusher = function (username, pwd) {
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
      var cb = args[args.length - 1];
      return typeof cb === 'function' && cb(err);
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
          self.cookie = null;
          self.emit('PWechatError', err);
        } else {
          self.emit('connect');          
        }
      });
    }
  });
};

/**
 * 给单个用户发送微信消息
 * @param {String} fakeId 用户fakeId
 * @param {String} content 发送内容
 */
Pusher.prototype.singleSend = function (fakeId, content, callback) {
  var self = this;
  if (self.cookie) {
    return proxy.singleSend(fakeId, content, self.cookie, function (err, data) {
      if (err) {
        self.cookie = null;
      }
      callback(err, data);
    });
  }
  self.afterLogin(self.singleSend, arguments);
};

/**
 * 获取包含关键字的消息
 * @param {String} keyword 消息中包含的关键字
 * @param {Number} count 获取条数
 * @param {Number} fromMsgId 从这个msgId开始往前查找
 */
Pusher.prototype.getMessage = function (keyword, count, fromMsgId, callback) {
  var self = this;
  if (self.cookie) {
    return proxy.getMessage(self.cookie, keyword, count, fromMsgId, function (err, data) {
      if (err) {
        self.cookie = null;
      }
      callback(err, data);
    });      
  }
  self.afterLogin(self.getMessage, arguments);
};

exports.create = function (username, pwd) {
  return new Pusher(username, pwd);
};

