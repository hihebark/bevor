<p align="center">
<a href="https://en.wikipedia.org/wiki/Bevor"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/HJRK_A_79_-_Armour_of_Maximilian_I%2C_c._1485_%28detail_of_bevor%29.jpg/1280px-HJRK_A_79_-_Armour_of_Maximilian_I%2C_c._1485_%28detail_of_bevor%29.jpg" width="200px" alt="Armour of Emperor Maximilian I, part of the set of armour probably depicted in Thun fol. 33v, 67 and 67v.">
</a>
</p>

# Bevor (beta)

**[Bevor](https://en.wikipedia.org/wiki/Bevor)** it's a [laravel validator](https://laravel.com/docs/master/validation) alike to validate requests / payloads. This module is still in **beta** use it at on your own risk, if you find an anomaly or an issue you can create a new [Issue](https://github.com/hihebark/bevor/issues) or open new [Pull Request](https://github.com/hihebark/bevor/pulls) are appreciated.

## Instalation
```
npm install bevor --save
```

## Usage

```js
const { Validator } = require('bevor');

let payload = {
  required: 'i\'am required in the request',
  json: '{"animals": ["cat", "dog"]}',
  array: '["cat", "dog"]',
  string: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  in: 'frog',
  not_in: 'ant',
  number: 3,
  email: 'a@b.com',
  timestamp: '441759600000',
  url: 'https://example.com/',
  ip: '0.0.0.0',
  ipv6: '::',
  boolean: '0',
}

const validator = new Validator(payload, [
  { required: 'required' },
  { json: 'json' },
  { array: 'required|array' },
  { string: 'string|size:55|regex:/([A-Z])\\w+/gi' },
  { in: 'in:cat,dog,frog' },
  { not_in: 'not_in:cat,dog,frog' },
  { number: 'min:2|max:4|between:2,4|eq:3' },
  { email: 'email' },
  { timestamp: 'timestamp' },
  { url: 'url' },
  { ip: 'ip' },
  { ipv6: 'ipv6' },
  { boolean: 'boolean' },
], { debug: true });

console.log(
  '[!]',
  'Is valid:', validator.validate(),
  'errors:', validator.errors(),
);

```
OR

```js
const { Validator } = require('bevor');

...

app.post('/my_route', (req, res, next) => {
  const validator = new Validator(req.body, [
    { required: 'required' },
    { json: 'json' },
    { array: 'required|array' },
    { string: 'string|size:55|regex:/([A-Z])\\w+/gi' },
    { in: 'in:cat,dog,frog' },
    { not_in: 'not_in:cat,dog,frog' },
    { number: 'min:2|max:4|between:2,4|eq:3' },
    { email: 'email' },
    { timestamp: 'timestamp' },
    { url: 'url' },
    { ip: 'ip' },
    { ipv6: 'ipv6' },
    { boolean: 'boolean' },
  ]);
  if (validator.validate() == false)
    return res.status(400).send({ state: false, errors: validator.errors() });
  
  // code

});

```

## Documentation

List of all available validation rules:

- [required](#required)
- [min](#min)
- [max](#max)
- [between](#between)
- [in](#in)
- [not_in](#not_in)
- [gte](#gte)
- [gt](#gt)
- [lte](#lte)
- [lt](#lt)
- [eq](#eq)
- [not_eq](#not_eq)
- [regex](#regex)
- [string](#string)
- [number](#number)
- [json](#json)
- [array](#array)
- [timestamp](#timestamp)
- [date](#date)
- [boolean](#boolean)
- [email](#email)
- [size](#size)
- [url](#url)
- [ip](#ip)
- [ipv6](#ipv6)


### required:
The field under validation is considered as `required` if it's not equal to undefined, empty string, empty array and an empty object.

### min
The field being validated has a minimum value of the set value. Example: `min:2` the `2` is the minimum value to which the field must be equal.
### max
The field being validated has a maximum value of the set value. Example: `max:10` the `10` is the maximum value to which the field must be equal.
### between
The field being validated has a maximum and minimum value of the set value. Example: `between:10,2` the `10` is the maximum value and `2` is the minimum value to which the field must be equal.
### in
The field being validated is included in the list defined in the options separated by `,`. Example: `in:cat,dog,frog`.
### not_in
The field being validated is not included in the list defined in the options separated by `,`. Example: `not_in:cat,dog,frog`.
### gte
The field being validated is **g**reater **t**han **e**qual to the set value. Example: `gte:2` that mean the field is greater than equal `2`.
### gt
The field being validated is **g**reater **t**han to the set value. Example: same as [gte](#gte).
### lte
The field being validated is **l**ess **t**han to the set value. Example: same as [gte](#gte).
### lt
The field being validated is **l**ess **t**han to the set value. Example: same as [gte](#gte).
### eq
The field being validated is **eq**ual than to the set value. Example: same as [gte](#gte).
### not_eq
The field being validated is not **eq**ual than to the set value. Example: same as [gte](#gte).
### size
The field being validated must have the length of set value, Example: `size:255` the field length should equal to `255`.
### regex
The field being validated match the [regex](https://en.wikipedia.org/wiki/Regular_expression) of the set value. Example: `regex:/([A-Z])\\w+/gi` this regex match every word not containing numerique values.
<footnote>Note to the escaped `\` with two `\\`.</footnote>
### string
The field being validated must be a string.
### number
The field being validated must be a number.
### json
The field being validated must be a valid [json](https://www.rfc-editor.org/rfc/rfc8259.txt).
### array
The field being validated must be a valid [array](https://www.rfc-editor.org/rfc/rfc8259.txt).
### timestamp
The field being validated must be a valid [timestamp](https://datatracker.ietf.org/doc/html/rfc3339#section-1).
### date
The field being validated must be a valid [date](https://datatracker.ietf.org/doc/html/rfc3339#section-1).
### boolean
The field being validated must be a valid boolean, it can be 1 or 0 for true and false respectively.
### email
The field being validated must be a valid [email address](http://emailregex.com/).
### url
The field being validated must be a [url(link)](https://datatracker.ietf.org/doc/html/rfc3986).
### ip
The field being validated must be a [ipv4 address](https://datatracker.ietf.org/doc/html/rfc791).
### ipv6
The field being validated must be a [ipv6 address](https://datatracker.ietf.org/doc/html/rfc2460).

Bevor accept also options, those options are set-to debug, return the first occurred error, or to set défaut error message. Example:
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
The options `validation_messages` is useful for error message translation, the accepted parameters are `{{ field }}` and `{{ value }}` for all rules except `min`, `max` and `between` rules you can use the `{{ min }}` to get the min value, `{{ max }}` to get the max, and `{{ min }} {{ max }}` in between rule to get the min and the max.

---

## TODO
- [ ] refactore the code.
