let Validator = require('./validator');

let req = {
  email: 'hello@mail.com',
  phone: '+1-555-1856-751',
  price: '][',
  test: 'aaaa ssss'
}

let errors = new Validator(req, [
  { email: ['required'] },
  { phone: 'required' },
  { price: 'json' },
  { test: 'regex:/([A-Z])\w+/gi' }
]).exec();

console.log(errors);

module.exports = Validator;
