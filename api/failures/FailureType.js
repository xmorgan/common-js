const assert = require('./../../lang/assert'),
	Enum = require('./../../lang/Enum'),
	is = require('./../../lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration that describes potential reasons for API failure.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code - The enumeration code (and description).
	 * @param {String} template - The template string for formatting human-readable messages.
	 * @param {Boolean=} severe - Indicates if the failure is severe (default is true).
	 */
	class FailureType extends Enum {
		constructor(code, template, severe) {
			super(code, code);

			assert.argumentIsRequired(template, 'template', String);
			assert.argumentIsOptional(severe, 'severe', Boolean);

			this._template = template;

			if (is.boolean(severe)) {
				this._severe = severe;
			} else {
				this._severe = true;
			}
		}

		/**
		 * The template string for formatting human-readable messages.
		 *
		 * @public
		 * @returns {String}
		 */
		get template() {
			return this._template;
		}

		/**
		 * Indicates if the failure is serious.
		 *
		 * @public
		 * @return {Boolean}
		 */
		get severe() {
			return this._severe;
		}

		/**
		 * One or more data points is missing.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_CONSTRUCTION_FAILURE() {
			return requestConstructionFailure;
		}

		/**
		 * A data point is missing.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_PARAMETER_MISSING() {
			return requestParameterMissing;
		}

		/**
		 * A data point is malformed.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_PARAMETER_MALFORMED() {
			return requestParameterMalformed;
		}

		/**
		 * User identity could not be determined.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_IDENTITY_FAILURE() {
			return requestIdentifyFailure;
		}

		/**
		 * User authorization failed.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_AUTHORIZATION_FAILURE() {
			return requestAuthorizationFailure;
		}

		/**
		 * The request data cannot be parsed or interpreted.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_INPUT_MALFORMED() {
			return requestInputMalformed;
		}

		/**
		 * The request failed for unspecified reasons.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get SCHEMA_VALIDATION_FAILURE() {
			return schemaValidationFailure;
		}

		/**
		 * The request failed for unspecified reasons.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get REQUEST_GENERAL_FAILURE() {
			return requestGeneralFailure;
		}

		/**
		 * Returns an HTTP status code that would be suitable for use with the
		 * failure type.
		 *
		 * @public
		 * @static
		 * @param {FailureType} type
		 * @returns {Number}
		 */
		static getHttpStatusCode(type) {
			assert.argumentIsRequired(type, 'type', FailureType, 'FailureType');

			let returnVal;

			if (type === FailureType.REQUEST_IDENTITY_FAILURE) {
				returnVal = 401;
			} else if (type === FailureType.REQUEST_AUTHORIZATION_FAILURE) {
				returnVal = 403;
			} else {
				returnVal = 400;
			}

			return returnVal;
		}

		toString() {
			return `[FailureType (code=${this.code})]`;
		}
	}

	const requestConstructionFailure = new FailureType('REQUEST_CONSTRUCTION_FAILURE', 'An attempt to {L|root.endpoint.description} failed because some required information is missing.');
	const requestParameterMissing = new FailureType('REQUEST_PARAMETER_MISSING', 'The "{L|name}" field is required.');
	const requestParameterMalformed = new FailureType('REQUEST_PARAMETER_MALFORMED', 'The "{L|name}" field cannot be interpreted.');
	const requestIdentifyFailure = new FailureType('REQUEST_IDENTITY_FAILURE', 'An attempt to {L|root.endpoint.description} failed because your identity could not be determined.');
	const requestAuthorizationFailure = new FailureType('REQUEST_AUTHORIZATION_FAILURE', 'An attempt to {L|root.endpoint.description} failed. You are not authorized to perform this action.');
	const requestInputMalformed = new FailureType('REQUEST_INPUT_MALFORMED', 'An attempt to {L|root.endpoint.description} failed, the data structure is invalid.');
	const schemaValidationFailure = new FailureType('SCHEMA_VALIDATION_FAILURE', 'An attempt to read {U|schema} data failed (found "{L|key}" when expecting "{L|name}")');
	const requestGeneralFailure = new FailureType('REQUEST_GENERAL_FAILURE', 'An attempt to {L|root.endpoint.description} failed for unspecified reason(s).');

	return FailureType;
})();