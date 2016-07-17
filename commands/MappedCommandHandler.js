var assert = require('./../lang/assert');
var CommandHandler = require('./CommandHandler');

module.exports = (() => {
	'use strict';

	class MappedCommandHandler extends CommandHandler {
		constructor(nameExtractor) {
			super();

			assert.argumentIsRequired(nameExtractor, 'nameFunction', Function);

			this._handlerMap = {};
			this._defaultHandler = null;

			this._nameExtractor = nameExtractor;
		}

		addCommandHandler(name, commandHandler) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsRequired(commandHandler, 'commandHandler', CommandHandler, 'CommandHandler');


			if (this._handlerMap.hasOwnProperty(name)) {
				throw new Error('A handler with the same name already exists in the map');
			}

			if (commandHandler === this) {
				throw new Error('Recursive use of mapped command handlers is prohibited');
			}

			this._handlerMap[name] = commandHandler;

			return this;
		}

		setDefaultCommandHandler(commandHandler) {
			assert.argumentIsRequired(commandHandler, 'commandHandler', CommandHandler, 'CommandHandler');

			this._defaultHandler = commandHandler;

			return this;
		}

		_process(data) {
			var handlerName = this._nameExtractor(data);
			var handler = this._handlerMap[handlerName] || this._defaultHandler;

			var returnRef;

			if (handler) {
				returnRef = handler.process(data);
			} else {
				returnRef = null;
			}

			return returnRef;
		}

		toString() {
			return '[MappedCommandHandler]';
		}
	}

	return MappedCommandHandler;
})();