module.exports = process.env.PUSHWECHAT_COV ? require('./lib-cov/pushwechat') : require('./lib/pushwechat');

module.exports.proxy = process.env.PUSHWECHAT_COV ? require('./lib-cov/proxy') : require('./lib/proxy');