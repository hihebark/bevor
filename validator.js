/*
 * Validator
 * @param {Object} options.payload
 * @param {Array} options.rules
 * @param {Object} options.options
 *
 */

const Rules = require('./rules');

function Validator (payload, req_rules, options = {}) {
	this.payload = payload ? payload : {};
	this.req_rules = req_rules ? req_rules : [];
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
	this.rules = new Rules(this.payload);
}

Validator.prototype.validate = function() {
	if (Object.keys(this.payload).length == 0 && this.req_rules.length == 0)
		return true;
	const all_rules = this.rules.getRules()
  , { error } = require('./commons');

	for (const req_rule of this.req_rules) {
		const field = Object.keys(req_rule)[0];
		let rules = req_rule[field];

		if (typeof rules == 'string')
			rules = rules.split('|');

		for (let rule of rules) {
			rule = this.rules.make(rule);
			if (all_rules.includes(rule.name)) {
				let check = this.rules.check(field, rule);
				this.is_valid = check.validity && this.is_valid;

				if (!check.validity) {
          let ev = error.make(this.options.validation_messages[rule.name], check.attributes);
					if (this.validation_errors[field] != undefined)
						this.validation_errors[field].push(ev);
					else
						this.validation_errors[field] = [ev];
				}

				if (this.options.debug === true)
					console.log(
						`[${Date.now()}][VALIDATOR:debug]`,
						`field: ${field}`,
						`rule: ${rule.name} =>`,
						check.validity
					);

				if (this.options.first_error === true && this.is_valid === false)
					return this.is_valid;
			} else {
				throw new Error(`This '${rule.name}' is not recognized`);
			}
		}
	}
	return this.is_valid;
}

Validator.prototype.errors = function() {
	return Object.keys(this.validation_errors).length == 0 ? null : this.validation_errors;
}

module.exports = Validator;
