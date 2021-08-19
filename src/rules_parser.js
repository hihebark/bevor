/*
 * RulesParser: generate a parsed rules.
 * @param {Mixed} rules
 *
 */

const known_rules = [
  'required', 'required_if', 'exists', 'in', 'not_in', 'bail', 'nullable',
  'min', 'max', 'between', 'size', 'gte', 'gt', 'lte', 'lt', 'eq', 'not_eq',
  'regex', 'string', 'integer', 'numeric', 'json', 'array', 'timestamp',
  'boolean', 'date', 'email', 'url', 'ip', 'ipv6', 'image',
];

function RulesParser (rules) {
  this.rules = rules;
}

RulesParser.prototype.get_options_from_rule = function (rule) {
  let implicit_attribute = rule.split(':')
  , name = implicit_attribute[0]
  , options = implicit_attribute.length > 0 ? implicit_attribute[1] : null;
  if (options != null)
    options = options.includes(',') ? options.split(',') : options;
  return { name, options };
}

RulesParser.prototype.generator = function () {
  let implicit_attributes = [];

  if (typeof this.rules === 'string' || Array.isArray(this.rules)) {
    let rules = Array.isArray(this.rules) ? this.rules : this.rules.split('|');
    for (let rule of rules) {
      let name, options;
      if (rule.includes(':')) {
        let implicit_attribute = rule.split(':');
        name = implicit_attribute[0]
        options = implicit_attribute.length > 0 ? implicit_attribute[1] : null;
        if (options != null)
          options = options.includes(',') ? options.split(',') : options;
      } else {
        name = rule;
        options = true;
      }
      if (!known_rules.includes(name))
        throw new RulesParserError(`Rule "${name}" not defined`);
      implicit_attributes.push({
        name: name,
        options: options,
      });
    }
  }

  return implicit_attributes;
}

class RulesParserError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'BevorRulesParser';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = RulesParser;
