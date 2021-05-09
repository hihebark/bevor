/**
 * Create a new collection
 * @param {Object} options.payload
 * @param {Array} options.rules
 */

const Rules = require('./rules');

function Validator (payload, rules) {
  this.payload = payload ? payload : {};
  this.rules = rules ? rules : [];
}

Validator.prototype.exec = function() {
  if (Object.keys(this.payload).length == 0 && this.rules.length == 0)
    return true;

  let rules = new Rules(this.payload);
  for (const rule of this.rules) {
    const key = Object.keys(rule)[0];
    let value = rule[key];
    if (typeof value == 'string') value = value.split('|');
    for (let rule of value) {
      let check_rule = rules.check(rule, key);
      console.log(key, ' rule: ', rule, ':', check_rule);
    }
  }

  return false;
}

module.exports = Validator;
