
pushwechat
====== 

 通过模拟后台登录的形式，进行消息的发送和获取。   

 ## 用法  

``` js
var Pusher = require('pwchat');
var pusher = Pusher = create('youremail', 'yourpassword');

pusher.on('PWwchatError', function (err) {
  console.log(err); //无法登录后台
});

/**
 * 给单个用户发送微信消息
 * @param {String} fakeId 用户fakeId
 * @param {String} content 发送内容
 */
pusher.singleSend('12345, '测试内容', function (err, data) {
  // 发送成功的响应data.should.eql({ret: 0, msg: 'ok'});
});

/**
 * 获取包含关键字的消息
 * @param {String} keyword 消息中包含的关键字
 * @param {Number} count 获取条数
 * @param {Number} fromMsgId 从这个msgId开始往前查找
 */
pusher.getMessage('@help', 10, 1000, function (err, data) {
  // 获取成功的响应，data会是一个数组
});
```


