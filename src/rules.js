/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
/**
 * @param {Object} options.payload
 * @param {Array} options.rules
 */
const _ = require("lodash"),
  { regexp } = require("./commons");

function Rules(payload, rules, options) {
  this.payload = payload ? payload : {};
  this.rules = rules;
  this.options = options;
  this.is_required = rules.findIndex((v) => v.name === "required") !== -1;

  let nullable_index = rules.findIndex((v) => v.name === "nullable");
  let bail_index = rules.findIndex((v) => v.name === "bail");

  this.is_bail = bail_index !== -1;
  this.is_nullable = !this.is_required && nullable_index !== -1;

  if (bail_index !== -1) this.rules.splice(bail_index, 1);
  if (nullable_index !== -1) this.rules.splice(nullable_index, 1);
}

const clean = (obj) => {
  if (obj.validity === true) return { validity: true };
  return JSON.parse(JSON.stringify(obj));
};

Rules.prototype.check = function (field) {
  let rules_checker = [],
    is_valid = true;
  for (let rule of this.rules) {
    let rule_checker = this[rule.name](field, rule.options);

    rule_checker["rule_name"] = rule.name;
    is_valid = rule_checker.validity && is_valid;

    if (this.options.debug === true)
      console.log(
        `[${Date.now()}][VALIDATOR:debug]`,
        `field: ${field}`,
        `rule: ${rule.name} =>`,
        rule_checker.validity
      );

    if (
      (this.is_bail === true || this.options.first_error === true) &&
      rule_checker.validity === false
    )
      return { rules_checker: [rule_checker], is_valid };

    rules_checker.push(rule_checker);
  }
  return { rules_checker, is_valid };
};

Rules.prototype.get_value = function (field) {
  return _.get(this.payload, field, undefined);
};

Rules.prototype.required = function (field) {
  let value = this.get_value(field),
    check =
      value !== undefined &&
      value !== "" &&
      value.length !== 0 &&
      (typeof value === "object" ? Object.keys(value).length != 0 : true);
  return clean({
    validity: check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.required_if = function (field, condition) {
  let value = this.get_value(field),
    other_value = this.get_value(condition[0]),
    other_condition = condition[1],
    check = true;
  if (other_value == other_condition)
    check =
      value !== undefined &&
      value != "" &&
      value.length != 0 &&
      (typeof value == "object" ? Object.keys(value).length != 0 : true);

  return clean({
    validity: check,
    attributes: {
      field,
      value,
      other: condition[0],
      other_value: other_condition,
    },
  });
};

Rules.prototype.exists = function (field, value) {
  return clean({
    validity: value == "true",
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.custom = function (field, callback) {
  let check = callback(this.get_value(field), field, this.payload);
  check = check != true ? false : true; // if the user is returning a string, we assume it's false
  return clean({
    validity: check,
    attributes: {
      field,
    },
  });
};

Rules.prototype.min = function (field, min) {
  let value = this.get_value(field),
    check = this.is_nullable;
  min = parseInt(min);
  if (typeof value == "string" && !isNaN(min)) check = value.length >= min;
  else if (typeof value == "number" && !isNaN(min)) check = value >= min;

  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      min,
      value,
    },
  });
};

Rules.prototype.max = function (field, max) {
  let value = this.get_value(field),
    check = this.is_nullable;
  max = parseInt(max);
  if (typeof value == "string" && !isNaN(max)) check = value.length <= max;
  else if (typeof value == "number" && !isNaN(max)) check = value <= max;

  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      max,
      value,
    },
  });
};

Rules.prototype.between = function (field, values) {
  let min = Math.min(...values),
    max = Math.max(...values),
    value = this.get_value(field),
    check_max = this.max(field, Math.max(...values)),
    check_min = this.min(field, Math.min(...values));
  return clean({
    validity: check_max.validity && check_min.validity,
    attributes: {
      field,
      min,
      max,
      value,
    },
  });
};

Rules.prototype.in = function (field, values) {
  let value = this.get_value(field),
    check = values.includes(value);
  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      values,
      value,
    },
  });
};

Rules.prototype.not_in = function (field, values) {
  let value = this.get_value(field),
    check = !values.includes(value);

  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      values,
      value,
    },
  });
};

Rules.prototype.gte = function (field, value) {
  let pl_value = parseInt(this.get_value(field));
  value = parseInt(value);
  let check = !isNaN(pl_value) && !isNaN(value) ? pl_value >= value : false;

  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.gt = function (field, value) {
  let pl_value = parseInt(this.get_value(field));
  value = parseInt(value);
  let check = !isNaN(pl_value) && !isNaN(value) ? pl_value > value : false;

  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.lte = function (field, value) {
  let pl_value = parseInt(this.get_value(field));
  value = parseInt(value);
  let check = !isNaN(pl_value) && !isNaN(value) ? pl_value <= value : false;

  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.lt = function (field, value) {
  let pl_value = parseInt(this.get_value(field));
  value = parseInt(value);
  let check = !isNaN(pl_value) && !isNaN(value) ? pl_value < value : false;

  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.eq = function (field, value) {
  let pl_value = parseInt(this.get_value(field));
  value = parseInt(value);
  let check = !isNaN(pl_value) && !isNaN(value) ? pl_value == value : false;

  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.not_eq = function (field, value) {
  let pl_value = parseInt(this.get_value(field));
  value = parseInt(value);
  let check = !isNaN(pl_value) && !isNaN(value) ? pl_value != value : false;

  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.regex = function (field, regex) {
  let check = false,
    value = this.get_value(field);
  regex = /\/(.*)\/(.*)/.exec(regex);

  if (regex != null) {
    const pattern = regex[1],
      flags = regex[2];
    check = new RegExp(pattern, flags).test(value);
  }

  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      regex,
      value,
    },
  });
};

Rules.prototype.string = function (field) {
  let value = this.get_value(field),
    check = typeof value == "string";
  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value: this.get_value(field),
    },
  });
};

Rules.prototype.integer = function (field) {
  let check = false,
    value = _.toInteger(this.get_value(field));
  if (!isNaN(value)) {
    check = true;
    _.set(this.payload, field, parseInt(value));
  }
  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.numeric = function (field) {
  let check = false,
    value = _.toNumber(this.get_value(field));
  if (!isNaN(value)) {
    check = true;
    _.set(this.payload, field, value);
  }
  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.json = function (field) {
  let value = this.get_value(field),
    check = false;
  if (value !== undefined) {
    try {
      if (typeof value == "string")
        _.set(this.payload, field, JSON.parse(value));
      check = true;
    } catch (e) {}
  }
  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.array = function (field) {
  let value = this.get_value(field),
    check = false;
  if (value !== undefined) {
    try {
      if (typeof value == "string")
        _.set(this.payload, field, JSON.parse(value));
      check = Array.isArray(_.get(this.payload, field));
    } catch (e) {}
  }
  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.image = function (field) {
  let value = this.get_value(field),
    check =
      value != undefined && value.mimetype != undefined
        ? new RegExp(regexp.image).test(value.mimetype)
        : false;
  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
    },
  });
};

Rules.prototype.date = function (field) {
  let check = false,
    value = this.get_value(field);
  if (value != undefined) check = new RegExp(regexp.date).test(value);

  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.timestamp = function (field) {
  let check = false,
    value = parseInt(this.get_value(field));
  if (!isNaN(value)) {
    _.set(this.payload, field, Date.parse(new Date(value)));
    check = true;
  }

  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.boolean = function (field) {
  let value = this.get_value(field),
    check = [true, false, 1, 0, "true", "false", "1", "0"].includes(value);

  if (check === true)
    _.set(
      this.payload,
      field,
      [true, "true", 1].includes(value) ? true : false
    );

  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.email = function (field) {
  let value = this.get_value(field),
    check = new RegExp(regexp.email).test(value);
  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.size = function (field, size) {
  let value = _.get(this.payload, field, 0),
    check =
      this.is_nullable ||
      (value.length == parseInt(size) && !isNaN(parseInt(size)));
  return clean({
    validity: check,
    attributes: {
      field,
      size,
      value,
    },
  });
};

Rules.prototype.url = function (field) {
  // NOTE source: https://mathiasbynens.be/demo/url-regex
  let value = this.get_value(field),
    check = new RegExp(regexp.url).test(value);
  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.ip = function (field) {
  let value = this.get_value(field),
    check = new RegExp(regexp.ip).test(value);
  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

Rules.prototype.ipv6 = function (field) {
  // NOTE source: https://home.deds.nl/~aeron/regex/
  let value = this.get_value(field),
    check = new RegExp(regexp.ipv6).test(value);
  return clean({
    validity: this.is_nullable || check,
    attributes: {
      field,
      value,
    },
  });
};

module.exports = Rules;
