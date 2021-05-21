<p align="center">
<a href="https://en.wikipedia.org/wiki/Bevor"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/HJRK_A_79_-_Armour_of_Maximilian_I%2C_c._1485_%28detail_of_bevor%29.jpg/1280px-HJRK_A_79_-_Armour_of_Maximilian_I%2C_c._1485_%28detail_of_bevor%29.jpg" width="200px" alt="Armour of Emperor Maximilian I, part of the set of armour probably depicted in Thun fol. 33v, 67 and 67v.">
</a>
</p>

# Bevor (beta)

**[Bevor](https://en.wikipedia.org/wiki/Bevor)** it's a [laravel validator](https://laravel.com/docs/master/validation) alike to validate requests / payloads. This module is still in **beta** use it on your own risk, if you find an anomaly or an issue you can create a new [Issue](https://github.com/hihebark/bevor/issues) or open new [Pull Request](https://github.com/hihebark/bevor/pulls) are appreciated.

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
## Documentation API

documentation goes here


## TODO
- [ ] refactore the code.
