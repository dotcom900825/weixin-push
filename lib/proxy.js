/*!
 * pushwechat - lib/proxy.js 
 * Copyright(c) 2012 Taobao.com
 * Author: dead-horse <dead_horse@qq.com>
 */


/**
 * Module dependencies.
 */
var urllib = require('urllib');
var utility = require('utility');
var translate = require('./translate');

var URLS = {
  login: 'http://mp.weixin.qq.com/cgi-bin/login?lang=zh_CN',
  addGroup: 'http://mp.weixin.qq.com/cgi-bin/modifygroup?t=ajax-friend-group',
  singleSend: 'http://mp.weixin.qq.com/cgi-bin/singlesend?t=ajax-response&lang=zh_CN',
  refresh: 'http://mp.weixin.qq.com/',
  getMessage: 'http://mp.weixin.qq.com/cgi-bin/getmessage?t=ajax-message'
};

var USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11';

var okStatus = [65201, 65202, 0];
exports.login = function (username, pwd, callback) {
  var data = {
    username: username,
    pwd: utility.md5(pwd.substr(0, 16)).toLowerCase(),
    imgcode: '',
    f: 'json'
  };
  urllib.request(URLS.login, {
    type: 'POST',
    data: data
  }, function (err, data, res) {
    try {
      data = JSON.parse(data);    
    } catch (err) {
      return callback(new Error('response error'));
    }
    if (err || res.statusCode !== 200 || okStatus.indexOf(data.ErrCode) < 0) {
      return callback(err || new Error('login error!' + translate.loginErrorMap(data.ErrCode)));
    }
    var cookies = '';
    res.headers['set-cookie'].forEach(function (cookie) {
      cookies += cookie.replace(/Path=\//g, '');
    });
    callback(null, cookies);
  });
};

exports.singleSend = function (fakeId, content, cookie, callback) {
  var data = {
    type: 1,
    content: content,
    tofakeid: fakeId,
    ajax: 1,
    error: false
  };
  var headers = {
    cookie: cookie
  };
  urllib.request(URLS.singleSend, {
    type: 'POST',
    headers: headers,
    data: data
  }, function (err, data, res) {
    if (err || res.statusCode !== 200) {
      return callback(err || new Error('singleSend Error! status code:' + res.statusCode));
    }
    try {
      data = JSON.parse(data);
    } catch (err) {
      return callback(new Error('singleSend Error! ' + err.message));
    }
    callback(null, data);
  });
};

exports.refresh = function (cookie, callback) {
  urllib.request(URLS.refresh, {headers: {cookie: cookie}}, function (err, data, res) {
    if (err || res.statusCode !== 200) {
      return callback(err || new Error('refresh Error! status code:' + res.statusCode));
    }
    if (String(data).indexOf('实时消息') < 0) {
      return callback(new Error('login become invalid'));
    }
    return callback(null);
  });
};

exports.getMessage = function (cookie, keyword, count, fromMsgId, callback) {
  var data = {
    keyword: keyword,
    count: count,
    frommsgid: fromMsgId,
    ajax: 1
  };
  var headers = {
    cookie: cookie,
    'User-Agent': USER_AGENT
  };
  urllib.request(URLS.getMessage, {
    type: 'POST',
    headers: headers,
    data: data
  }, function (err, data, res) {
    if (err || res.statusCode !== 200) {
      return callback(err || new Error('getMessage Error! status code:' + res.statusCode));
    }
    try {
      data = JSON.parse(data);
    } catch (err) {
      return callback(new Error('getMessage Error! ' + err.message));
    }
    callback(null, data);
  });
};
