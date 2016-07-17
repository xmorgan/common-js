var Specification = require('./Specification');

module.exports = (() => {
	class PassSpecification extends Specification {
		constructor(value) {
			super();
		}

		_evaluate(data) {
			return true;
		}

		toString() {
			return '[PassSpecification]';
		}
	}

	return PassSpecification;
})();