/*
 * Validator
 * @param {Object} options.payload
 * @param {Array} options.rules
 * @param {Object} options.options
 *
 * @return Object
 */

const Rules = require('./rules');
const RulesParser = require('./rules_parser');

function Validator (payload, rules, options = {}) {
  this.payload = payload ? payload : {};
  this.rules = rules ? rules : [];
  this.options = {
    debug: options.debug || false,
    first_error: options.first_error || false,
    validation_messages: {
      ...require('./default_messages'),
      ...options.validation_messages,
    },
  };
  this.validation_errors = {};
  this.is_valid = true;
}

Validator.prototype.validate = function() {
  if (this.rules.length == 0)
    return true;

  try {
    const { error } = require('./commons');
    for (let rule of this.rules) {
      const field = Object.keys(rule)[0]
      , rules_parser = new RulesParser(rule[field]).generator();

      let check = new Rules(this.payload, rules_parser, this.options).check(field);
      
      this.is_valid = check.is_valid && this.is_valid;

      if (check.is_valid === false) {
        for (let ev of check.rules_checker.filter(v => v.validity === false)) {
          ev = error.make(
            this.options.validation_messages[ev.rule_name],
            ev.attributes
          );

          if (this.validation_errors[field] !== undefined)
            this.validation_errors[field].push(ev);
          else
            this.validation_errors[field] = [ev];
        }
      }
    }
    return this.is_valid;
  } catch(err) {
    if (this.options.debug)
      console.error(err);
    this.validation_errors[err.name] = err.message;
    return false;
  }
}

Validator.prototype.errors = function() {
  return Object.keys(this.validation_errors).length == 0 ? null : this.validation_errors;
}

module.exports = Validator;
