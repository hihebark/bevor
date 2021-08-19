const expect = require("chai").expect
	, payload = {
		required: 'i\'am required in the request',
		json: '{"animals": ["cat", "dog"]}',
		array: '["cat", "dog"]',
		string: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
		in: 'frog',
		not_in: 'ant',
		integer: 3,
    pi: 3.14,
		email: 'a@b.com',
		timestamp: '441759600000',
		url: 'https://example.com/',
		ip: '0.0.0.0',
		ipv6: '::',
		boolean: '0',
		object: { inner_integer: 4 },
		date: '2021-05-16T22:31:39.995Z',
    file: {
      fieldname: 'johndoe',
      originalname: 'johndoe.jpg',
      encoding: '8bit',
      mimetype: 'image/jpeg',
      destination: 'images',
      filename: '64ebe2fa3429036f272f21f2149962df',
      path: 'images/64ebe2fa3429036f272f21f2149962df',
      size: 259739
    },
	}
	, { Validator } = require('../main');

describe("Test payload validation", () => {
	it("Field not in the payload and required", () => {
		const validator = new Validator(payload, [
			{ required_field: 'required' },
		]);
		expect(validator.validate()).to.equal(false);
		expect(validator.errors().required_field).to.be.an('array');
	});
	it("Field in the payload and required", () => {
		const validator = new Validator(payload, [
			{ required: 'required' },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is a json", () => {
		const validator = new Validator(payload, [
			{ json: 'required|json' },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is an array", () => {
		const validator = new Validator(payload, [
			{ array: 'required|array' },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is a string", () => {
		const validator = new Validator(payload, [
			{ string: 'required|string|size:55|regex:/([A-Z])\\w+/gi' },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is a string or nullable", () => {
		const validator = new Validator(payload, [
			{ string: 'nullable|string|size:55|regex:/([A-Z])\\w+/gi' },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is in enum", () => {
		const validator = new Validator(payload, [
			{ in: 'required|in:cat,dog,frog' },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is not in enum", () => {
		const validator = new Validator(payload, [
			{ not_in: ['required', 'not_in:cat,dog,frog'] },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is integer (with conditions)", () => {
		const validator = new Validator(payload, [
			{ integer: [
        'required',
        'integer',
        'min:2',
        'between:2,4',
        'eq:3',
        'gte:3',
        'gt:2',
        'lte:3',
        'lt:4',
        'not_eq:4'
      ] },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is integer or nullable (with conditions)", () => {
		const validator = new Validator(payload, [
			{ nullable_field: [
        'nullable',
        'integer',
        'min:2',
        'between:2,4',
        'eq:3',
        'gte:3',
        'gt:2',
        'lte:3',
        'lt:4',
        'not_eq:4'
      ] },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is numeric", () => {
		const validator = new Validator(payload, [
			{ integer: [ 'nullable', 'numeric' ] },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is not in an email", () => {
		const validator = new Validator(payload, [
			{ email: 'required|email' },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});

	it("Field in the payload is a timestamp", () => {
		const validator = new Validator(payload, [
			{ timestamp: 'required|timestamp' },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is an url", () => {
		const validator = new Validator(payload, [
			{ url: 'required|url' },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is in an ip (ipv4)", () => {
		const validator = new Validator(payload, [
			{ ip: 'required|ip' },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is not an ipv6", () => {
		const validator = new Validator(payload, [
			{ ipv6: 'required|ipv6' },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is boolean", () => {
		const validator = new Validator(payload, [
			{ boolean: 'required|boolean' },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is integer (dot notions)", () => {
		const validator = new Validator(payload, [
			{ 'object.inner_integer': 'bail|required|integer|eq:4' },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is date", () => {
		const validator = new Validator(payload, [
			{ date: 'required|date' },
		], );
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload exist in database", () => {
		const validator = new Validator(payload, [
			{ date: 'required|exists:true' },
		], );
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload and required if other field is equal to", () => {
		const validator = new Validator(payload, [
			{ required: 'required_if:boolean,0' },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
	it("Field in the payload is an image", () => {
		const validator = new Validator(payload, [
			{ file: 'image' },
		]);
		expect(validator.validate()).to.equal(true);
		expect(validator.errors()).to.equal(null);
	});
});
