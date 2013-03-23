module.exports = process.env.PUSHWECHAT_COV ? require('./lib-cov/pushwechat') : require('./lib/pushwechat');
