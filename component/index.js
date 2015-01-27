'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var request = require('request');
var path = require('path');
var fs = require('fs');

module.exports = generators.Base.extend({
	constructor: function () {
		// Calling the super constructor
		generators.Base.apply(this, arguments);

		this.argument('name', {type: String, required: false});
		this.name = this._.dasherize(decapitalize(this.name));
	},

	initializing: function () {
		this.pkg = require('../package.json');
		this.cfg = require('../config.json');

		// Get the component types
		this.types = this._.map(this.cfg.components, function (value, key) {
			return key;
		});
	},

	prompting: function () {
		var self = this;
		var done = this.async();


		// Have Yeoman greet the user.
		this.log(yosay(
			'Let me help you to create your component…'
		));

		this.prompt([
			{
				name: 'name',
				message: 'What\'s the name of your component?',
				default: this.name,
				validate: function validateString(value) {
					return self._.isString(value) && !self._.isBlank(value);
				}
			},
			{
				name: 'type',
				type: 'list',
				message: 'And what\'s your desired type?',
				choices: this.types,
				default: 0
			}
		], function (props) {
			this.name = props.name;
			this.type= props.type;

			done();
		}.bind(this));
	}
});


function decapitalize(str) {
	return str.charAt(0).toLowerCase() + str.slice(1);
};