module.exports.Rules = {
}
/**
 * Create a new collection
 * @param {Object} options.payload
 */

function Rules (payload) {
  this.payload = payload ? payload : {};
}

Rules.prototype.check = function(rule, key) {
  return this[rule] ? this[rule](key) : false;
}

Rules.prototype.required = function(key) {
  return this.payload[key] != undefined;
}

Rules.prototype.required_if = function() {}
Rules.prototype.required_unless = function() {}
Rules.prototype.min = function() {}
Rules.prototype.max = function() {}
Rules.prototype.in = function() {}
Rules.prototype.notIn = function() {}

Rules.prototype.regex = function() {}
Rules.prototype.string = function() {}
Rules.prototype.number = function() {}
Rules.prototype.json = function() {}
Rules.prototype.array = function() {}
Rules.prototype.file = function() {}
Rules.prototype.image = function() {}
Rules.prototype.date = function() {}
Rules.prototype.boolean = function() {}

Rules.prototype.email = function() {}
Rules.prototype.size = function() {}
Rules.prototype.url = function() {}
Rules.prototype.ip = function() {}

module.exports = Rules;
