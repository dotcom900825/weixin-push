/*!
 * pushwechat - lib/proxy.js 
 * Copyright(c) 2012 Taobao.com
 * Author: dead-horse <dead_horse@qq.com>
 */


/**
 * Module dependencies.
 */

exports.loginErrorMap = function (code) {
  var t = code + "";
  var n;
  switch (t) {
  case "-1":
    n = "系统错误。";
    break;
  case "-2":
    n = "帐号或密码错误。";
    break;
  case "-3":
    n = "密码错误。";
    break;
  case "-4":
    n = "不存在该帐户。";
    break;
  case "-5":
    n = "访问受限。";
    break;
  case "-6":
    n = "需要输入验证码";
    break;
  case "-7":
    n = "此帐号已绑定私人微信号，不可用于公众平台登录。";
    break;
  case "-8":
    n = "邮箱已存在。";
    break;
  case "-32":
    n = "验证码输入错误";
    break;
  case "-200":
    n = "因频繁提交虚假资料，该帐号被拒绝登录。";
    break;
  case "-94":
    n = "请使用邮箱登陆。";
    break;
  case "10":
    n = "该公众会议号已经过期，无法再登录使用。";
    break;
  default:
    n = "未知的返回。";
  }
  return n;
};
