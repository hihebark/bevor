let Validator = require('./validator');

let req = {
  email: 'hello@mail.com',
  phone: '+1-555-1856-751',
}

let errors = new Validator(req, [
  { 'email': ['required'] },
  { 'phone': 'required' },
]).exec();

console.log(errors);

module.exports = Validator;
