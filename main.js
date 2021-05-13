let Validator = require('./validator');

let req = {
  test_required: 'i\'am required in the request',
  test_json: '{"animals": ["cat", "dog"]}',
  test_regex: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
	test_in: 'frog',
	test_number: 6,
}

const validator = new Validator(req, [
  { test_required: 'required' },
  { test_json: 'json' },
  { test_regex: 'regex:/([A-Z])\w+/gi' }, // TODO WHY didnt match?
	{ test_in: 'in:cat,dog' },
	{ test_number: 'min:2|max:4|between:2,4' },
], { debug: true, first_error: false });

console.log(
	'[!]',
	'Is valid:', validator.validate(),
	'errors:', validator.errors()
);

module.exports = Validator;
