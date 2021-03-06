const Tree = require('./../../../collections/Tree');

describe('When a Tree is constructed', () => {
	'use strict';

	let root;
	let one;

	beforeEach(() => {
		root = new Tree(one = { });
	});

	it('should be the root node', () => {
		expect(root.getIsRoot()).toEqual(true);
	});

	it('should be a leaf node', () => {
		expect(root.getIsLeaf()).toEqual(true);
	});

	it('should have to correct node value', () => {
		expect(root.getValue()).toBe(one);
	});

	describe('and the root node is retrieved from root node', () => {
		it('should be itself', () => {
			expect(root.getRoot()).toBe(root);
		});
	});

	describe('and a child is added', () => {
		let child;
		let two;

		beforeEach(() => {
			child = root.addChild(two = { });
		});

		it('should be a leaf node', () => {
			expect(child.getIsLeaf()).toEqual(true);
		});

		it('should have to correct node value', () => {
			expect(child.getValue()).toBe(two);
		});

		it('should should be the child of the root node', () => {
			expect(child.getParent()).toBe(root);
		});

		it('should not have a parent which is considered a leaf node', () => {
			expect(root.getIsLeaf()).toEqual(false);
		});

		it('should be in the parents collection of children', () => {
			expect(root.getChildren().find((c) => c === child)).toBe(child);
		});

		describe('and a second child is added', () => {
			let secondChild;
			let three;

			beforeEach(() => {
				secondChild = root.addChild(three = { });
			});

			describe('and the second child is severed', () => {
				beforeEach(() => {
					secondChild.sever();
				});

				it('the severed tree should no longer have a parent', () => {
					expect(secondChild.getIsRoot()).toEqual(true);
				});

				it('the original tree should only contain one child', () => {
					expect(root.getChildren().length).toEqual(1);
				});

				it('the original tree should not be the severed node', () => {
					expect(root.getChildren()[0]).not.toBe(secondChild);
				});
			});

			describe('and the tree is converted to a JavaScript object', () => {
				let object;

				beforeEach(() => {
					object = root.toJSObj();
				});

				it('should have the correct root value', () => {
					expect(object.value).toBe(one);
				});

				it('should have two children', () => {
					expect(object.children.length).toEqual(2);
				});

				it('should have the correct value for the first child', () => {
					expect(object.children[0].value).toBe(two);
				});

				it('should have the correct value for the second child', () => {
					expect(object.children[1].value).toBe(three);
				});
			});
		});

		describe('and the root node is retrieved from the child', () => {
			it('should be the root node', () => {
				expect(child.getRoot()).toBe(root);
			});
		});
	});
});