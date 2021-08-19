<p align="center">
  <a href="https://github.com/hihebark/bevor"><img src="./bevor.svg" width="80px" alt="halmet - source: https://openclipart.org/detail/294739/helmet-10"></a>
</p>

# Bevor

Many API's and application use [express-validator](https://github.com/express-validator/express-validator) as a validator for their HTTP request data. I have been working lately a lot with laravel and when it comes to data validation express-validator can't compete with the built-in validator that come with Laravel especially when you know all the rules.

**Bevor** it's a **Laravel** alike [validator](https://laravel.com/docs/master/validation) to validate incoming data, it was built in the same way, for now not all the rules are defined but it comes with some of the most util one.

> This module is still in **beta** use it at your own risk, if you find an anomaly or an issue you can create a new [Issue](https://github.com/hihebark/bevor/issues) or open a new [Pull Request](https://github.com/hihebark/bevor/pulls).

## Instalation
```
npm install bevor --save
```

## Usage

Bevor cam with a `Validator` instance that accept a payload object, an array of rules to define on each field and options.

Basic usage:

```js
const { Validator } = require('bevor');

const validator = new Validator(
  payload, // payload is an object of data.
  rules,   // rules is an array of rule.
);
```

Options are set-to debug, return the first occurred error, or to set default error message. Example:

```js
const { Validator } = require('bevor');
const validator = new Validator(payload, [
  { required: 'required' },
  { json: 'json' },
], {
  debug: true,
  first_error: true,
  validation_messages: {
    required: 'Ce champ "{{ field }}" est requis.'
  }
});
// code
});

```

The best way to use `validation_messages` option is for multi language API or just to change the default messages.

## Examples

```js
const { Validator } = require('bevor');

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
  { birthdate: ['required', 'date:format,MM-DD-YYYY'] },
  { type: ['required', 'in:particular,professional'] },
  { age: ['nullable', 'integer', 'gte:20', 'lt:40] },
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

```
---

```js
const { Validator } = require('bevor');

  // code
  //...

app.post('/articles', (req, res, next) => {
  const validator = new Validator(req, [
    { 'req.body.name': 'required|string' },
    { 'req.body.price': 'required|numeric|min:100|max:999' },
    { 'req.body.quantity': ['required', 'integer', 'max:10', 'gte:1'] },
    { 'req.file': ['nullable', 'image'] }, // experimental
  ]);
  if (validator.validate() == false)
    return res.status(400).send({ state: false, errors: validator.errors() });
  
  let article = req.body;

});

```

## API documentation

List of all available validation rules:

- [array](#array)
- [bail](#bail)
- [between](#between)
- [boolean](#boolean)
- [date](#date)
- [email](#email)
- [eq](#eq)
- [exists](#exists)
- [gt](#gt)
- [gte](#gte)
- [image](#image) experimental
- [in](#in)
- [integer](#integer)
- [ip](#ip)
- [ipv6](#ipv6)
- [json](#json)
- [lt](#lt)
- [lte](#lte)
- [max](#max)
- [min](#min)
- [not_eq](#not_eq)
- [not_in](#not_in)
- [nullable](#nullable)
- [numeric](#numeric)
- [regex](#regex)
- [required](#required)
- [required_if](#required_if)
- [size](#size)
- [string](#string)
- [timestamp](#timestamp)
- [url](#url)

### array
The field being validated must be a valid [array](https://www.rfc-editor.org/rfc/rfc8259.txt).

### bail
Stop running validation rules after the first failure under the current field.

### between
The field being validated has a maximum and minimum value of the set value. Example: `between:10,2` the `10` is the maximum value and `2` is the minimum value to which the field must be equal.

### boolean
The field being validated must be a valid boolean, it can be `1`, `0`, `true` or `false`.

### date
The field being validated must be a valid date string supported by moment.js [see section string > Supported ISO 8601 strings](https://momentjs.com/docs/#/parsing/string/). Date also supporte format can be used like so: `date:format,DD-MM-YYYY` if the date is valid the validator will set the given format to the field.

### email
The field being validated must be a valid [email address](http://emailregex.com/).

### eq
The field being validated is **eq**ual than to the set value. Example: same as [gte](#gte).

### exists
The field being validated must exist(must be true).

### gt
The field being validated is **g**reater **t**han to the set value. Example: same as [gte](#gte).

### gte
The field being validated is **g**reater **t**han **e**qual to the set value. Example: `gte:2` that mean the field is greater than equal `2`.

### image
The field beign validated must be an image (jpg, jpeg, png, or gif).

### in
The field being validated is included in the list defined in the options separated by `,`. Example: `in:cat,dog,frog`.
> don't use spaces between coma.

### integer
The field being validated must be an integer.

### ip
The field being validated must be a [ipv4 address](https://datatracker.ietf.org/doc/html/rfc791).

### ipv6
The field being validated must be a [ipv6 address](https://datatracker.ietf.org/doc/html/rfc2460).

### json
The field being validated must be a valid [json](https://www.rfc-editor.org/rfc/rfc8259.txt).

### lt
The field being validated is **l**ess **t**han to the set value. Example: same as [gte](#gte).

### lte
The field being validated is **l**ess **t**han to the set value. Example: same as [gte](#gte).

### max
The field being validated has a maximum value of the set value. Example: `max:10` the `10` is the maximum value to which the field must be equal.

### min
The field being validated has a minimum value of the set value. Example: `min:2` the `2` is the minimum value to which the field must be equal.

### not_eq
The field being validated is not **eq**ual than to the set value. Example: same as [gte](#gte).

### not_in
The field being validated is not included in the list defined in the options separated by `,`. Example: `not_in:cat,dog,frog`.

### nullable
The field under validation can have the value `null`, unless `required` is provided the rule `nullable` will be neglected.

### numeric
The field being validated must be a numeric (float or integer).

### regex
The field being validated match the [regex](https://en.wikipedia.org/wiki/Regular_expression) of the set value. Example: `regex:/([A-Z])\\w+/gi` this regex match every word not containing numerique values.
> you need to escape `\` with `\\`.

### required
The field under validation is considered as `required` if it's not equal to undefined, empty string, empty array and an empty object.

### required_if
The field being validated is considered `required` if another field is equal to a specific value. Example: `required_if:role,admin` here the field beign validated is require only when the field `role` is equal to `admin`.

### size
The field being validated must have the length of set value, Example: `size:255` the field length should equal to `255`.

### string
The field being validated must be a string.

### timestamp
The field being validated must be a valid [timestamp](https://datatracker.ietf.org/doc/html/rfc3339#section-1).

### url
The field being validated must be a valid [url](https://datatracker.ietf.org/doc/html/rfc3986).

---

<p align="center">
    made with :heart: by <a href="https://github.com/hihebark">@hihebark</a>
</p>
