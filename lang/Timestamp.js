const assert = require('./assert'),
	is = require('./is');

const moment = require('moment-timezone');

module.exports = (() => {
	'use strict';

	/**
	 * A data structure encapsulates (and lazy loads) a moment (see https://momentjs.com/).
	 *
	 * @public
	 * @param {Number} timestamp
	 * @param {String=} timezone
	 */
	class Timestamp {
		constructor(timestamp, timezone) {
			assert.argumentIsValid(timestamp, 'timestamp', is.large, 'is an integer');
			assert.argumentIsOptional(timezone, 'timezone', String);

			this._timestamp = timestamp;
			this._timezone = timezone || null;

			this._moment = null;
		}

		/**
		 * The timestamp.
		 *
		 * @public
		 * @returns {Number}
		 */
		get timestamp() {
			return this._timestamp;
		}

		/**
		 * The moment instance.
		 *
		 * @public
		 * @returns {moment}
		 */
		get moment() {
			if (this._moment === null) {
				this._moment = moment(this._timestamp);

				if (this._timezone !== null) {
					this.moment.tz(this._timezone);
				}
			}

			return this._moment;
		}

		/**
		 * Returns the JSON representation.
		 *
		 * @public
		 * @returns {Number}
		 */
		toJSON() {
			return this.timestamp;
		}

		/**
		 * Clones a {@link Timestamp} instance.
		 *
		 * @public
		 * @static
		 * @param {Timestamp} value
		 * @returns {Timestamp}
		 */
		static clone(value) {
			assert.argumentIsRequired(value, 'value', Timestamp, 'Timestamp');

			return new Timestamp(value._timestamp, value._timezone);
		}

		/**
		 * Parses the value emitted by {@link Timestamp#toJSON}.
		 *
		 * @public
		 * @param {Number} value
		 * @returns {Timestamp}
		 */
		static parse(value) {
			return new Timestamp(value);
		}

		/**
		 * Returns a new {@link Timestamp} instance, representing the current moment.
		 *
		 * @public
		 * @returns {Timestamp}
		 */
		static now() {
			return new Timestamp((new Date()).getTime());
		}

		toString() {
			return '[Timestamp]';
		}
	}

	return Timestamp;
})();
