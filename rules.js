/**
 * @param {Object} options.payload
 */
const _ = require('lodash');

function Rules (payload) {
  this.payload = payload ? payload : {};
}

const clean = (obj) => {
  if (obj.validity === true) return { validity: true };
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

Rules.prototype.getRules = function() {
  return [
    'required', 'required_if', 'exists', 'in', 'not_in',
    'min', 'max', 'between', 'size', 'gte', 'gt', 'lte', 'lt', 'eq', 'not_eq',
    'regex', 'string', 'number', 'json', 'array', 'timestamp', 'boolean', 'date',
    'email', 'url', 'ip', 'ipv6'
  ]
}

Rules.prototype.required = function(field) {
  let value = _.get(this.payload, field, false)
  , check = value && value != '' && value.length != 0
    && (typeof value == 'object' ? Object.keys(value).length != 0 : true);
  return clean({
    validity: check,
    attributes: {
      field,
      value,
    }
  });
}

Rules.prototype.required_if = function(field, condition) {
  condition = condition.split(',');
  let value = _.get(this.payload, field, false)
  , other_value = _.get(this.payload, condition[0], undefined)
  , other_condition = condition[1]
  , check = other_value == other_condition;
  if (check)
    check = value && value != '' && value.length != 0
      && (typeof value == 'object' ? Object.keys(value).length != 0 : true);

  return clean({
    validity: check,
    attributes: {
      field,
      value,
      other: condition[0],
      other_value: other_condition
    }
  });
}

Rules.prototype.exists = function(field, check) {
  return clean({
    validity: check == 'true',
    attributes: {
      field,
      value: _.get(this.payload, field, undefined)
    }
  });
}

Rules.prototype.min = function(field, min) {
  let value = _.get(this.payload, field, undefined), check = false;
  min = parseInt(min);
  if (typeof value == 'string' && !isNaN(min))
    check = value.length >= min;
  else if (typeof value == 'number' && !isNaN(min))
    check = value >= min;
  return clean({
    validity: check,
    attributes: {
      field,
      min,
      value,
    }
  });
}

Rules.prototype.max = function(field, max) {
  let value = _.get(this.payload, field, undefined), check = false;
  max = parseInt(max);
  if (typeof value == 'string' && !isNaN(max))
    check = value.length <= max;
  else if (typeof value == 'number' && !isNaN(max))
    check = value <= max;
  return clean({
    validity: check,
    attributes: {
      field,
      max,
      value,
    }
  });
}

Rules.prototype.between = function(field, values) {
  values = values.split(',');
  let min = Math.min(...values)
    , max = Math.max(...values)
    , value = _.get(this.payload, field, undefined)
    , check_max = this.max(field, Math.max(...values))
    , check_min = this.min(field, Math.min(...values));
  return clean({
    validity: check_max.validity && check_min.validity,
    attributes: {
      field,
      min,
      max,
      value
    }
  });
}

Rules.prototype.in = function(field, values) {
  let check = values.split(',').includes(_.get(this.payload, field, undefined));
  return clean({
    validity: check,
    attributes: {
      field,
      enum: values,
      value: _.get(this.payload, field, undefined)
    }
  });
}

Rules.prototype.not_in = function(field, values) {
  let check = !values.split(',').includes(_.get(this.payload, field, undefined));
  return clean({
    validity: check,
    attributes: {
      field,
      enum: values,
      value: _.get(this.payload, field, undefined)
    }
  });
}

Rules.prototype.gte = function(field, value) {
  let pl_value = parseInt(_.get(this.payload, field, undefined));
  value = parseInt(value);
  let check = !isNaN(pl_value) && !isNaN(value) ? pl_value >= value : false;
  return clean({
    validity: check,
    attributes: {
      field,
      gte: value,
      value: _.get(this.payload, field, undefined)
    }
  });
}

Rules.prototype.gt = function(field, value) {
  let pl_value = parseInt(_.get(this.payload, field, undefined));
  value = parseInt(value);
  let check = !isNaN(pl_value) && !isNaN(value) ? pl_value > value : false;
  return clean({
    validity: check,
    attributes: {
      field,
      gt: value,
      value: _.get(this.payload, field, undefined)
    }
  });
}

Rules.prototype.lte = function(field, value) {
  let pl_value = parseInt(_.get(this.payload, field, undefined));
  value = parseInt(value);
  let check = !isNaN(pl_value) && !isNaN(value) ? pl_value <= value : false;
  return clean({
    validity: check,
    attributes: {
      field,
      lte: value,
      value: _.get(this.payload, field, undefined)
    }
  });
}

Rules.prototype.lt = function(field, value) {
  let pl_value = parseInt(_.get(this.payload, field, undefined));
  value = parseInt(value);
  let check = !isNaN(pl_value) && !isNaN(value) ? pl_value < value : false;
  return clean({
    validity: check,
    attributes: {
      field,
      lt: value,
      value: _.get(this.payload, field, undefined)
    }
  });
}

Rules.prototype.eq = function(field, value) {
  let pl_value = parseInt(_.get(this.payload, field, undefined));
  value = parseInt(value);
  let check = !isNaN(pl_value) && !isNaN(value) ? pl_value == value : false;
  return clean({
    validity: check,
    attributes: {
      field,
      eq: value,
      value: _.get(this.payload, field, undefined)
    }
  });
}

Rules.prototype.not_eq = function(field, value) {
  let pl_value = parseInt(_.get(this.payload, field, undefined));
  value = parseInt(value);
  let check = !isNaN(pl_value) && !isNaN(value) ? pl_value != value : false;
  return clean({
    validity: check,
    attributes: {
      field,
      not_eq: value,
      value: _.get(this.payload, field, undefined)
    }
  });
}

Rules.prototype.regex = function(field, regex) {
  regex = /\/(.*)\/(.*)/.exec(regex);
  if (regex == null)
    return clean({
      validity: false,
      attributes: {
        field,
        regex,
        value: _.get(this.payload, field, undefined)
      }
    });
  const pattern = regex[1]
    , flags = regex[2];
  let check = new RegExp(pattern, flags).test(_.get(this.payload, field, undefined));
  return clean({
    validity: check,
    attributes: {
      field,
      regex,
      value: _.get(this.payload, field, undefined)
    }
  });
}

Rules.prototype.string = function(field) {
  let check = typeof _.get(this.payload, field, false) == 'string';
  return clean({
    validity: check,
    attributes: {
      field,
      value: _.get(this.payload, field, undefined)
    }
  });
}

Rules.prototype.number = function(field) {
  let check = false
    , value = parseInt(_.get(this.payload, field, undefined));
  if (!isNaN(parseInt(value))) {
    check = true;
    _.set(this.payload, field, value);
  }
  return clean({
    validity: check,
    attributes: {
      field,
      value
    }
  });
}

Rules.prototype.json = function(field) {
  let value = _.get(this.payload, field, undefined)
    , check = typeof value == 'object';
  try {
    if (typeof value == 'string')
      _.set(this.payload, field, JSON.parse(value));
    check = true;
  } catch (e) {
    check = false;
  }
  return clean({
    validity: check,
    attributes: {
      field,
      value: _.get(this.payload, field)
    }
  });
}

Rules.prototype.array = function(field) {
  let value = _.get(this.payload, field, undefined)
    , check = typeof value == 'object';
  try {
    if (typeof value == 'string')
      _.set(this.payload, field, JSON.parse(value));
    check = Array.isArray(_.get(this.payload, field));
  } catch (e) {
    check = false;
  }
  return clean({
    validity: check,
    attributes: {
      field,
      value: _.get(this.payload, field)
    }
  });
}

Rules.prototype.file = function() {
}

Rules.prototype.image = function() {
}

Rules.prototype.date = function(field) {
  let check = false
    , value = _.get(this.payload, field, undefined);
  if (value != undefined) {
    const moment = require('moment');
    if (moment(value, true).isValid()) {
      _.set(this.payload, field, moment(value));
      check = true;
    }
  }
  return clean({
    validity: check,
    attributes: {
      field,
      value: _.get(this.payload, field)
    }
  });
}

Rules.prototype.timestamp = function(field) {
  let check = false
    , value = _.get(this.payload, field, undefined);
  if (!isNaN(value)) {
    _.set(this.payload, field, Date.parse(new Date(value)));
    check = true;
  }

  return clean({
    validity: check,
    attributes: {
      field,
      value: _.get(this.payload, field)
    }
  });
}

Rules.prototype.boolean = function(field) {
  let value = _.get(this.payload, field, undefined)
    , check = [
      true, false, 1, 0, 'true', 'false', '1', '0'
    ].includes(value);

  if (check === true)
    _.set(this.payload, field, [true, 'true', 1].includes(value) ? true : false);

  return clean({
    validity: check,
    attributes: {
      field,
      value: _.get(this.payload, field)
    }
  });
}

Rules.prototype.email = function(field) {
  const { email } = require('./commons').regexp;
  let value = _.get(this.payload, field, undefined)
    , check = new RegExp(email).test(value);
  return clean({
    validity: check,
    attributes: {
      field,
      value: _.get(this.payload, field)
    }
  });
}

Rules.prototype.size = function(field, size) {
  let value = _.get(this.payload, field, 0)
    , check = value.length == parseInt(size) && !isNaN(parseInt(size));
  return clean({
    validity: check,
    attributes: {
      field,
      size,
      value
    }
  });
}

Rules.prototype.url = function(field) {
  // NOTE source: https://mathiasbynens.be/demo/url-regex
  const { url } = require('./commons').regexp;
  let value = _.get(this.payload, field, undefined)
    , check = new RegExp(url).test(value);
  return clean({
    validity: check,
    attributes: {
      field,
      value
    }
  });
}

Rules.prototype.ip = function(field) {
  const { ip } = require('./commons').regexp;
  let value = _.get(this.payload, field, undefined)
    , check = new RegExp(ip).test(value);
  return clean({
    validity: check,
    attributes: {
      field,
      value
    }
  });
}

Rules.prototype.ipv6 = function(field) {
  // NOTE source: https://home.deds.nl/~aeron/regex/
  const { ipv6 } = require('./commons').regexp;
  let value = _.get(this.payload, field, undefined)
    , check = new RegExp(ipv6).test(value);
  return clean({
    validity: check,
    attributes: {
      field,
      value
    }
  });
}

module.exports = Rules;
