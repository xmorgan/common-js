const assert = require('./assert');

module.exports = (() => {
	'use strict';

	/**
	 * Utilities for working with promises.
	 *
	 * @public
	 * @module lang/promise
	 */
	return {
		timeout(promise, timeout) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(promise, 'promise', Promise, 'Promise');
					assert.argumentIsRequired(timeout, 'timeout', Number);

					if (!(timeout > 0)) {
						throw new Error('Promise timeout must be greater than zero.');
					}

					return this.build((resolveCallback, rejectCallback) => {
						let pending = true;

						let token = setTimeout(() => {
							if (pending) {
								pending = false;

								rejectCallback(`Promise timed out after ${timeout} milliseconds`);
							}
						}, timeout);

						promise.then((result) => {
							if (pending) {
								pending = false;
								clearTimeout(token);

								resolveCallback(result);
							}
						}).catch((error) => {
							if (pending) {
								pending = false;
								clearTimeout(token);

								rejectCallback(error);
							}
						});
					});
				});
		},

		/**
		 * A mapping function that works asynchronously. Given an array of items, each item through
		 * a mapping function, which can return a promise. Then, this function returns a single promise
		 * which is the result of each mapped promise.
		 *
		 * @public
		 * @static
		 * @param {Array} items - The items to map
		 * @param {Function} mapper - The mapping function (e.g. given an item, return a promise).
		 * @param {Number} concurrency - The maximum number of promises that are allowed to run at once.
		 * @returns {Promise<Array>}
		 */
		map(items, mapper, concurrency) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsArray(items, 'items');
					assert.argumentIsRequired(mapper, 'mapper', Function);
					assert.argumentIsOptional(concurrency, 'concurrency', Number);

					const c = Math.max(0, concurrency || 0);

					let mapPromise;

					if (c === 0 || items.length === 0) {
						mapPromise = Promise.all(items.map((item) => Promise.resolve(mapper(item))));
					} else {
						let total = items.length;
						let active = 0;
						let complete = 0;
						let failure = false;

						const results = Array.of(total);

						const executors = items.map((item, index) => {
							return () => {
								return Promise.resolve()
									.then(() => {
										return mapper(item);
									}).then((result) => {
										results[index] = result;
									});
							};
						});

						mapPromise = this.build((resolveCallback, rejectCallback) => {
							const execute = () => {
								if (!(executors.length > 0 && c > active && !failure)) {
									return;
								}

								active = active + 1;

								const executor = executors.shift();

								executor()
									.then(() => {
										if (failure) {
											return;
										}

										active = active - 1;
										complete = complete + 1;

										if (complete < total) {
											execute();
										} else {
											resolveCallback(results);
										}
									}).catch((error) => {
										failure = false;

										rejectCallback(error);
									});

								execute();
							};

							execute();
						});
					}

					return mapPromise;
				});
		},

		/**
		 * Runs a series of functions sequentially (where each function can be
		 * synchronous or asynchronous). The result of each function is passed
		 * to the successive function and the result of the final function is
		 * returned to the consumer.
		 *
		 * @static
		 * @public
		 * @param {Function[]} functions - An array of functions, each expecting a single argument.
		 * @param input - The argument to pass the first function.
		 * @returns {Promise<TResult>}
		 */
		pipeline(functions, input) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsArray(functions, 'functions', Function);

					return functions.reduce((previous, fn) => previous.then((result) => fn(result)), Promise.resolve(input));
				});
		},

		/**
		 * Creates a new promise, given an executor.
		 *
		 * This is a wrapper for the {@link Promise} constructor; however, any error
		 * is caught and the resulting promise is rejected (instead of letting the
		 * error bubble up to the top-level handler).
		 *
		 * @public
		 * @static
		 * @param {Function} executor - A function which has two callback parameters. The first is used to resolve the promise, the second rejects it.
		 * @returns {Promise}
		 */
		build(executor) {
			return new Promise((resolve, reject) => {
				try {
					executor(resolve, reject);
				} catch(e) {
					reject(e);
				}
			});
		}
	};
})();