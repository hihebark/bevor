/**
 * Create a new collection
 * @param {Object} options.payload
 * @param {Array} options.rules
 */

const Rules = require('./rules');

function Validator (payload, req_rules, options) {
	this.payload = payload ? payload : {};
	this.req_rules = req_rules ? req_rules : [];
	this.options = options ? options : { debug: false, first_error: false };
	this.validation_errors = {};
	this.is_valid = true;
	this.rules = new Rules(this.payload);
}

Validator.prototype.validate = function() {
	if (Object.keys(this.payload).length == 0 && this.req_rules.length == 0)
		return true;

	for (const req_rule of this.req_rules) {
		const field = Object.keys(req_rule)[0];
		let array_rules = req_rule[field];

		if (typeof array_rules == 'string')
			array_rules = array_rules.split('|');

		for (let rule of array_rules) {
			rules = this.rules.make(rule)
			let check = this.rules.check(rules.name, field, rules.options);
			this.is_valid = check.validity && this.is_valid;

			if (!check.validity) {
				if (this.validation_errors[field] != undefined)
					this.validation_errors[field].push(check.error);
				else
					this.validation_errors[field] = [check.error];
			}

			if (this.options.debug == true)
				console.log('[*]', field, 'rule:[', rules.name, '] :', check.validity);

			if (this.options.first_error == true && this.is_valid == false)
				return this.is_valid;
		}
	}
	return this.is_valid;
}

Validator.prototype.errors = function() {
	return this.validation_errors;
}

module.exports = Validator;
