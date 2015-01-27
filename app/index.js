'use strict';

var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var request = require('request');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var admzip = require('adm-zip');

module.exports = generators.Base.extend({

	constructor: function () {
		// Calling the super constructor
		generators.Base.apply(this, arguments);

		this.argument('appname', {type: String, required: false});
		this.appname = this.appname || path.basename(process.cwd());
		this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

		this.option('version', {type: String, defaults: 'develop'});
	},

	initializing: function () {
		this.pkg = require('../package.json');
		this.cfg = require('../config.json');

		this.srcZip = 'http://github.com/' + this.cfg.repository + '/archive/' + this.options.version + '.zip';
		this.destZip = this.templatePath('sentinel.zip');
		this.destTemplates = this.templatePath('sentinel');
	},

	prompting: function () {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the awe-inspiring ' + chalk.cyan('Sentinel') + ' generator!'
		));

		this.prompt([
			{
				name: 'version',
				message: 'What\'s the version of sentinel you want to use?',
				default: this.options.version
			}
		], function (props) {
			this.options.version = props.version;

			done();
		}.bind(this));
	},

	writing: {
		/* clean: function () {
			var done = this.async();

			this.log('Cleaning templates');

			rimraf(this.destTemplates, function () {
				done();
			});
		},
		download: function () {
			var self = this;
			var done = this.async();

			this.log('Download ' + chalk.cyan(this.srcZip));

			var dl = request
				.get(this.srcZip)
				.on('error', function (err) {
					self.log(chalk.red(err));
				})
				.pipe(fs.createWriteStream(this.destZip));

			dl.on('finish', function () {
				done();
			});
		},
		extract: function () {
			var done = this.async();

			this.log('Extracting templates');
			var zip = new admzip(this.destZip);
			var zipEntries = zip.getEntries();

			zipEntries.forEach(function (entry) {
				try {
					zip.extractEntryTo(entry, this.destTemplates + entry.entryName.substring(entry.entryName.indexOf('/')), false, false);
				}
				catch (e) {
				}
			}, this);

			done();
		}, */
		app: function () {
			this.log('copying templates');

			var files = this.expandFiles('**/*', {cwd: this.sourceRoot(), dot: true});
			var ignores = [
				// files to ignore
			];

			files.forEach(function (file) {
				if (ignores.indexOf(file) !== -1) {
					return;
				}

				this.fs.copy(this.templatePath(file), this.destinationPath(file));
			}, this);
		}
	},

	install: function () {
		this.installDependencies({
			skipInstall: this.options['skip-install']
		});
	}
});
