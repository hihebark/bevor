const Validator = require('./src/validator');

let payload = {
  username: 'johndoe',
  email: 'johndoe@gmail.com',
  password: 'secret',
  birthdate: '1970-01-01T20:42:35.827Z',
  type: 'particular',
  setting: { notification: { email: false } },
}

const validator = new Validator(payload, [
  { username: ['required', 'string'] },
  { email: ['required', 'email'] },
  { password: ['required', 'string', 'min:6', 'max:32'] },
  { birthdate: ['required', 'date'] },
  { type: ['required', 'in:particular,professional'] },
  { age: ['nullable', 'integer', 'gte:20', 'lt:40'] },
  { "setting.notification.email": ['boolean'] },
], {
  debug: false,
  validation_messages: {
    'required': 'You need to make sure that this: "{{ field }}" is defined',
  }
});

console.log(
  '[!]',
  'Is valid:', validator.validate(),
  'errors:', validator.errors(),
);

module.exports.Validator = require('./src/validator');
