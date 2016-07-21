var Specification = require('./../../../specifications/Specification');
var OrSpecification = require('./../../../specifications/OrSpecification');

describe('When an OrSpecification is constructed', function() {
	'use strict';

	var SpecPass;
	var SpecFail;

	beforeEach(function() {
		SpecPass = Specification.extend({
			init: function() {
				this._super();

				this._spy = jasmine.createSpy('spyPass').and.returnValue(true);
			},

			_evaluate: function(data) {
				return this._spy (data);
			},
		});

		SpecFail = Specification.extend({
			init: function() {
				this._super();

				this._spy = jasmine.createSpy('spyPass').and.returnValue(false);
			},

			_evaluate: function(data) {
				return this._spy (data);
			},
		});
	});

	describe('with two specifications that will pass', function() {
		var specification;

		var specPassOne;
		var specPassTwo;

		var data;
		var result;

		beforeEach(function() {
			specification = new OrSpecification(specPassOne = new SpecPass(), specPassTwo = new SpecPass());

			result = specification.evaluate(data = {});
		});

		it('should call the first specification', function() {
			expect(specPassOne._spy).toHaveBeenCalledWith(data);
		});

		it('should not call the second specification', function() {
			expect(specPassTwo._spy).not.toHaveBeenCalledWith(data);
		});

		it('should evaluate to false', function() {
			expect(result).toEqual(true);
		});
	});

	describe('with two specifications that will fail', function() {
		var specification;

		var specPassOne;
		var specPassTwo;

		var data;
		var result;

		beforeEach(function() {
			specification = new OrSpecification(specPassOne = new SpecFail(), specPassTwo = new SpecFail());

			result = specification.evaluate(data = {});
		});

		it('should call the first specification', function() {
			expect(specPassOne._spy).toHaveBeenCalledWith(data);
		});

		it('should call the second specification', function() {
			expect(specPassTwo._spy).toHaveBeenCalledWith(data);
		});

		it('should evaluate to false', function() {
			expect(result).toEqual(false);
		});
	});
});