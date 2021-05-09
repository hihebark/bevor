/**
 * Create a new collection
 * @param {String} options.name
 * @param {String} options.text
 * @param {String} options.path
 * @param {String} options.data
 */
function Verror (field) {
  let field, errors;
  this.field = field;
  this.errors = [];
}

Verror.prototype.push = function(error) {
  this.errors.push(error);
}

Verror.prototype.toJson = function() {
  return { [this.field]: this.errors };
}

module.exports = Verror;
