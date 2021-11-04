module.exports = {
  required: `The '{{ field }}' is required.`,
  required_if: `The '{{ field }}' is required when {{ other }} is {{ other_value }}`,
  exists: `The '{{ field }}' already exists.`,
  min: `The '{{ field }}' must be at least '{{ min }}'.`,
  max: `The '{{ field }}' may not be greater than '{{ max }}'.`,
  between: `The '{{ field }}' must be between '{{ min }}' and '{{ max }}'.`,
  in: `The selected '{{ field }}' is invalid.`,
  not_in: `The selected '{{ field }}' is invalid.`,
  gte: `The '{{ field }}' must be greater than or equal '{{ value }}'.`,
  gt: `The '{{ field }}' must be greater than '{{ value }}'.`,
  lte: `The '{{ field }}' must be less than or equal '{{ value }}'.`,
  lt: `The '{{ field }}' must be less than '{{ value }}'.`,
  eq: `The '{{ field }}' must equal '{{ value }}'.`,
  not_eq: `The '{{ field }}' must not equal '{{ value }}'.`,
  regex: `The '{{ field }}' format is invalid.`,
  string: `The '{{ field }}' must be a string.`,
  integer: `The '{{ field }}' must be an integer.`,
  numeric: `The '{{ field }}' must be a number.`,
  json: `The '{{ field }}' must be a valid json.`,
  array: `The '{{ field }}' must be valid array.`,
  timestamp: `The '{{ field }}' must be a valid timestamp.`,
  boolean: `The '{{ field }}' must be boolean (true, false, 1 or 0).`,
  email: `The '{{ field }}' must be valid email.`,
  size: `The '{{ field }}' must be of size '{{ size }}'.`,
  url: `The '{{ field }}' must be valid url.`,
  ip: `The '{{ field }}' must be valid ip address.`,
  ipv6: `The '{{ field }}' must be a valid ipv6 address.`,
  date: `The '{{ field }}' must be a valid date.`,
  image: `The '{{ field }}' must be an image.`,
};
