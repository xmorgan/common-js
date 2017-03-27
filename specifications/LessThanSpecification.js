const assert = require('./../lang/assert');

const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	class LessThanSpecification extends Specification {
		constructor(value) {
			super();

			assert.argumentIsRequired(value, 'value', Number);

			this._value = value;
		}

		_evaluate(data) {
			assert.argumentIsRequired(data, 'data', Number);

			return data < this._value;
		}

		toString() {
			return '[LessThanSpecification]';
		}
	}

	return LessThanSpecification;
})();