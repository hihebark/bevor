/**
 * @param {Object} options.payload
 */
const _ = require('lodash');

function Rules (payload) {
	this.payload = payload ? payload : {};
}

const clean = (obj) => {
	if (obj.validity == true) obj.error = undefined;
	return JSON.parse(JSON.stringify(obj));
}

Rules.prototype.make = function(rule) {
	rule = rule.split(':');
	return { name: rule[0], options: rule[1] };
}

Rules.prototype.check = function(field, rule) {
	if (this[rule.name] != undefined)
		return this[rule.name](field, rule.options);
	else
		return clean({
			validity: false,
			error: `This: '${rule.name}' does not exist in rules.`
		});
}

Rules.prototype.required = function(field) {
	let check = _.get(this.payload, field, undefined) != undefined;
	return clean({
		validity: check,
		error: `The: '${field}' is required.`
	});
}

Rules.prototype.min = function(field, min) {
	let pl_value = parseInt(_.get(this.payload, field, undefined));
	min = parseInt(min);
	let check = !isNaN(pl_value) && !isNaN(min) ? pl_value > min : false;
	return clean({
		validity: check,
		error: `The: '${field}' must be at least ${min}.`
	});
}

Rules.prototype.max = function(field, max) {
	let pl_value = parseInt(_.get(this.payload, field, undefined));
	max = parseInt(max);
	let check = !isNaN(pl_value) && !isNaN(max) ? pl_value < max : false;
	return clean({
		validity: check,
		error: `The: '${field}' may not be greater than ${max}.`
	});
}

Rules.prototype.between = function(field, value) {
	value = value.split(',');
	let min = Math.min(...value)
		, max = Math.max(...value);

	let check_max = this.max(field, Math.max(...value))
		, check_min = this.min(field, Math.min(...value));
	return clean({
		validity: check_max.validity && check_min.validity,
		error: `The: '${field}' must be between ${min} and ${max}.`
	});
}

Rules.prototype.in = function(field, values) {
	let check = values.split(',').includes(_.get(this.payload, field, undefined));
	return clean({
		validity: check,
		error: `The selected '${field}' is invalid.`
	});
}

Rules.prototype.not_in = function(field, values) {
	let check = !values.split(',').includes(_.get(this.payload, field, undefined));
	return clean({
		validity: check,
		error: `The selected '${field}' is invalid.`
	});
}

Rules.prototype.gte = function(field, value) {
	let pl_value = parseInt(_.get(this.payload, field, undefined));
	value = parseInt(value);
	let check = !isNaN(pl_value) && !isNaN(value) ? pl_value >= value : false;
	return clean({
		validity: check,
		error: `The: '${field}' must be greater than ${value}.`
	});
}

Rules.prototype.gt = function(field, value) {
	let pl_value = parseInt(_.get(this.payload, field, undefined));
	value = parseInt(value);
	let check = !isNaN(pl_value) && !isNaN(value) ? pl_value > value : false;
	return clean({
		validity: check,
		error: `The: '${field}' must be greater than ${value}.`
	});
}

Rules.prototype.lte = function(field, value) {
	let pl_value = parseInt(_.get(this.payload, field, undefined));
	value = parseInt(value);
	let check = !isNaN(pl_value) && !isNaN(value) ? pl_value <= value : false;
	return clean({
		validity: check,
		error: `The: '${field}' must be less than or equal ${value}.`
	});
}

Rules.prototype.lt = function(field, value) {
	let pl_value = parseInt(_.get(this.payload, field, undefined));
	value = parseInt(value);
	let check = !isNaN(pl_value) && !isNaN(value) ? pl_value < value : false;
	return clean({
		validity: check,
		error: `The: '${field}' must be less than ${value}.`
	});
}

Rules.prototype.eq = function(field, value) {
	let pl_value = parseInt(_.get(this.payload, field, undefined));
	value = parseInt(value);
	let check = !isNaN(pl_value) && !isNaN(value) ? pl_value == value : false;
	return clean({
		validity: check,
		error: `The: '${field}' must be equal to ${value}.`
	});
}

Rules.prototype.not_eq = function(field, value) {
	let pl_value = parseInt(_.get(this.payload, field, undefined));
	value = parseInt(value);
	let check = !isNaN(pl_value) && !isNaN(value) ? pl_value != value : false;
	return clean({
		validity: check,
		error: `The: '${field}' may not be equal to ${value}.`
	});
}

Rules.prototype.regex = function(field, regex) {
	regex = /\/(.*)\/(.*)/.exec(regex);
	if (regex == null)
		return clean({
			validity: false,
			error: `This format is invalid.`
		});
	const pattern = regex[1]
		, flags = regex[2];
	let check = new RegExp(pattern, flags).test(_.get(this.payload, field, undefined));
	return clean({
		validity: check,
		error: `The '${field}' format is invalid.`
	});
}

Rules.prototype.string = function(field) {
	if (typeof _.get(this.payload, field, undefined) == 'object')
		_.set(this.payload, field, JSON.stringify(_.get(this.payload, field, {})));
	else 
		_.set(this.payload, field, ''+_.get(this.payload, field, ''));

	return clean({ validity: true });
}

Rules.prototype.number = function(field) {
	_.set(this.payload, field, parseInt(_.get(this.payload, field, undefined)));
	let check = !isNaN(_.get(this.payload, field, undefined));
	return clean({
		validity: check,
		error: `The: '${field}' is not a number`
	});
}

Rules.prototype.json = function(field) {
	let check = true;
	try {
		_.set(this.payload, field, JSON.parse(_.get(this.payload, field, {})));
	} catch (e) {
		check = false;
	}
	return clean({
		validity: check,
		error: `The: '${field}' must be a valid JSON.`
	});
}

Rules.prototype.array = function(field) {
	let check = true;
	try {
		_.set(this.payload, field, Array.from(JSON.parse(_.get(this.payload, field, []))));
	} catch (e) {
		check = false;
	}
	return clean({
		validity: check,
		error: `The: '${field}' must be a valid Array.`
	});
}

Rules.prototype.file = function() {
}

Rules.prototype.image = function() {
}

Rules.prototype.date = function(field) {
	let check = false;
	if (_.get(this.payload, field, undefined) != undefined) {
		const moment = require('moment');
		if (moment(_.get(this.payload, field), true).isValid()) {
			_.set(this.payload, field, moment(_.get(this.payload, field)));
			check = true;
		}
	}
	return clean({
		validity: check,
		error: `The '${field}' is not a valid Date.`
	});
}

Rules.prototype.timestamp = function(field) {
	let check = true;
	if (!isNaN(_.get(this.payload, field, undefined)))
		_.set(this.payload, field, Date.parse(new Date(_.get(this.payload, field))));
	else
		check = false;

	return clean({
		validity: check,
		error: `The '${field}' is not a valid timestamp.`
	});
}

Rules.prototype.boolean = function(field) {
	let check = [
		true, false, 1, 0, 'true', 'false', '1', '0'
	].includes(_.get(this.payload, field, undefined));

	if (check === true)
		_.set(this.payload, field, [
			true, 'true', 1
		].includes(_.get(this.payload, field)) ? true : false);

	return clean({
		validity: check,
		error: `The '${field}' field must be true, false, 1 or 0.`
	});
}

Rules.prototype.email = function(field) {
	const { email } = require('./commons').regexp;
	let check = new RegExp(email).test(_.get(this.payload, field, undefined));
	return clean({
		validity: check,
		error: `The '${field}' must be a valid email address.`
	});
}

Rules.prototype.size = function(field, size) {
	let check = _.get(this.payload, field, undefined).length == size;
	return clean({
		validity: check,
		error: `The '${field}' must be ${size}.`
	});
}

Rules.prototype.url = function(field) {
	const { url } = require('./commons').regexp;
	let check = new RegExp(url).test(_.get(this.payload, field, undefined));
	return clean({
		validity: check,
		error: `The '${field}' must be a valid URL.`
	});
}

Rules.prototype.ip = function(field) {
	const { ip } = require('./commons').regexp;
	let check = new RegExp(ip).test(_.get(this.payload, field, undefined));
	return clean({
		validity: check,
		error: `The '${field}' must be a valid IP.`
	});
}

Rules.prototype.ipv6 = function(field) {
	// NOTE source: https://home.deds.nl/~aeron/regex/
	const { ipv6 } = require('./commons').regexp;
	let check = new RegExp(ipv6).test(_.get(this.payload, field, undefined));
	return clean({
		validity: check,
		error: `The '${field}' must be a valid IP.`
	});
}

module.exports = Rules;
