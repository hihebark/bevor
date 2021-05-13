/**
 * Create a new collection
 * @param {String} options.name
 * @param {String} options.text
 * @param {String} options.path
 * @param {String} options.data
 */
function ValidationError (field) {
  let field, errors;
  this.field = field;
  this.errors = [];
}

ValidationError.prototype.push = function(error) {
  this.errors.push(error);
}

ValidationError.prototype.toJson = function() {
  return { [this.field]: this.errors };
}

module.exports = Verror;
