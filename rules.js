module.exports.Rules = {
}
/**
 * Create a new collection
 * @param {Object} options.payload
 */

function Rules (payload) {
  this.payload = payload ? payload : {};
}

Rules.prototype.check = function(name, key, options) {
  return this[name] ? this[name](key, options) : false;
}

Rules.prototype.required = function(key) {
  return this.payload[key] != undefined;
}

Rules.prototype.required_if = function() {}
Rules.prototype.required_unless = function() {}

Rules.prototype.min = function(key, min) {
  let pl_value = parseInt(this.payload[key]);
  min = parseInt(min);
  return !isNaN(pl_value) && !isNaN(min) ? pl_value > min : false;
}

Rules.prototype.max = function(key, min) {
  let pl_value = parseInt(this.payload[key]);
  min = parseInt(min);
  return !isNaN(pl_value) && !isNaN(min) ? pl_value < min : false;
}

Rules.prototype.between = function(key, value) {
  return this.max(key, Math.max(...value.split(','))) && this.min(key, Math.min(...value.split(',')));
}

Rules.prototype.in = function() {}
Rules.prototype.notIn = function() {}

Rules.prototype.regex = function(key, regex) {
  regex = /\/(.*)\/(.*)/.exec(regex)
  if (regex == null) return false
  let flags = regex[2]
  , pattern = regex[1];
  return new RegExp(pattern, flags).test(this.payload[key]);
}

Rules.prototype.string = function(key) {
  this.payload[key] = ''+this.payload[key];
  return true;
}
Rules.prototype.number = function(key) {
  this.payload[key] = parseInt(this.payload[key]);
  return !isNaN(this.payload[key]);
}
Rules.prototype.json = function(key) {
  try {
  this.payload[key] = JSON.parse(this.payload[key]);
  return true;
  } catch (e) { return false; }
}
Rules.prototype.array = function(key) {
}
Rules.prototype.file = function() {
}
Rules.prototype.image = function() {
}
Rules.prototype.date = function() {
}
Rules.prototype.boolean = function() {
}

Rules.prototype.email = function() {}
Rules.prototype.size = function() {}
Rules.prototype.url = function() {}
Rules.prototype.ip = function() {}

module.exports = Rules;
