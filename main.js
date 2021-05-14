let Validator = require('./validator');

let req = {
  test_required: 'i\'am required in the request',
  test_json: '{"animals": ["cat", "dog"]}',
  test_array: '["cat", "dog"]',
  test_string: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
	test_in: 'frog',
	test_not_in: 'ant',
	test_number: 3,
	test_email: 'a@b.com',
	test_timestamp: '441759600000',
	test_boolean: '0',
}

const validator = new Validator(req, [
  { test_required: 'required' },
  { test_json: 'json' },
  { test_array: 'required|array' },
  { test_string: 'string|size:55|regex:/([A-Z])\\w+/gi' },
	{ test_in: 'in:cat,dog,frog' },
	{ test_not_in: 'not_in:cat,dog,frog' },
	{ test_number: 'min:2|max:4|between:2,4' },
	{ test_email: 'email' },
	{ test_timestamp: 'timestamp' },
	{ test_boolean: 'boolean' },
], { debug: true, first_error: false });

console.log(
	'[!]',
	'Is valid:', validator.validate(),
	'errors:', validator.errors(),
	//req
);

module.exports = Validator;
