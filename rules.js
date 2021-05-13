module.exports.Rules = {
}
/**
 * Create a new collection
 * @param {Object} options.payload
 */

function Rules (payload) {
  this.payload = payload ? payload : {};
}

const clean = (obj) => JSON.parse(JSON.stringify(obj));

Rules.prototype.check = function(name, field, options) {
  return this[name] ? this[name](field, options) : false;
}

Rules.prototype.make = function(rule) {
	let _rule = rule.split(':');
	return {
		name: _rule[0],
		options: _rule[1],
	};
}

Rules.prototype.required = function(field) {
  let check = this.payload[field] != undefined;
	return clean({
		validity: check,
		error: `The: '${field}' is required.`
	});
}

Rules.prototype.required_if = function(field, value) {}
Rules.prototype.required_unless = function() {}

Rules.prototype.min = function(field, min) {
  let pl_value = parseInt(this.payload[field]);
  min = parseInt(min);
  let check = !isNaN(pl_value) && !isNaN(min) ? pl_value > min : false;
	return clean({
		validity: check,
		error: `The: '${field}' must be at least ${min}.`
	});
}

Rules.prototype.max = function(field, max) {
  let pl_value = parseInt(this.payload[field]);
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
	let check = values.split(',').includes(this.payload[field]);
	return clean({
		validity: check,
		error: `The selected value is invalid.`
	});
}

Rules.prototype.notIn = function() {}

Rules.prototype.regex = function(field, regex) {
  regex = /\/(.*)\/(.*)/.exec(regex)
  if (regex == null) return false
  const pattern = regex[1]
  , flags = regex[2];
  let check = new RegExp(pattern, flags).test(this.payload[field]);
	return clean({
		validity: check,
		error: `This format is invalid.`
	});
}

Rules.prototype.string = function(field) {
  this.payload[field] = ''+this.payload[field]; // TODO check json;
	return clean({ validity: true });
}
Rules.prototype.number = function(field) {
  this.payload[field] = parseInt(this.payload[field]);
  let check = !isNaN(this.payload[field]);
	return clean({
		validity: check,
		error: `The: '${field}' is not a number`
	});
}
Rules.prototype.json = function(field) {
	let check = true;
  try {
		this.payload[field] = JSON.parse(this.payload[field]);
  	check = true;
  } catch (e) {
		check = false;
	}
	return clean({
		validity: check,
		error: `The: '${field}' must be a valid JSON.`
	});
}
Rules.prototype.array = function(field) {
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
