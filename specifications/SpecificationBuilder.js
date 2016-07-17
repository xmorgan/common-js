var assert = require('./../lang/assert');

var Specification = require('./Specification');
var AndSpecification = require('./AndSpecification');
var OrSpecification = require('./OrSpecification');

module.exports = (() => {
	'use strict';

	class SpecificationBuilder {
		constructor(specification) {
			assert.argumentIsRequired(specification, 'specification', Specification, 'Specification');

			this._specification = specification;
		}

		and(other) {
			return new SpecificationBuilder(AndSpecification(this._specification , other));
		}

		or(other) {
			return new SpecificationBuilder(OrSpecification(this._specification , other));
		}

		build() {
			return this._specification;
		}

		toString() {
			return '[SpecificationBuilder]';
		}

		static startWith(specification) {
			return new SpecificationBuilder(specification);
		}
	}

	return SpecificationBuilder;
})();