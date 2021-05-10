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
      let _rule = rule.split(':');
      let rule_name = _rule[0];
      let rule_options = _rule[1];
      let check_rule = rules.check(rule_name, key, rule_options);
      console.log('[*]', key, 'rule:[', rule_name, '] :', check_rule);
    }
  }
  console.log(this.payload);

  return false;
}

module.exports = Validator;
