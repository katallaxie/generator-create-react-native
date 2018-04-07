'use strict';

var _yosay = require('yosay');

var _yosay2 = _interopRequireDefault(_yosay);

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _yeomanGenerator = require('yeoman-generator');

var _yeomanGenerator2 = _interopRequireDefault(_yeomanGenerator);

var _underscore = require('underscore.string');

var _templates = require('./templates');

var _templates2 = _interopRequireDefault(_templates);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// cwd


// load configs
// deps
const cwd = _process2.default.cwd();

// generator
class ReactNativeGenerator extends _yeomanGenerator2.default {

  constructor(args, options) {
    super(args, options);

    // this allows to directly pass in the name of the application
    this.argument('appname', {
      desc: `The name of the application (e.g. 'Hello World')`,
      type: String,
      optional: true,
      default: _path2.default.basename(_process2.default.cwd())
    });

    this.appName = this.appname;
  }

  // we use a property, because this is executed first
  get initializing() {

    function hello() {
      // say yo, to any new gopher
      this.log((0, _yosay2.default)(`Greetings! Let's get your next great app started.`));
    }

    return {
      hello
    };
  }

  // set necessary paths
  paths() {
    // set new source path
    this.sourceRoot(_path2.default.resolve(this.sourceRoot(), '../../templates/'));
  }

  // prompting the user for inputs
  prompting() {

    // async
    const done = this.async();

    const prompts = [{
      type: 'input',
      name: 'app',
      message: `What is the name of your new app?`,
      default: this.appName,
      store: true
    }, {
      type: 'confirm',
      name: 'install',
      message: 'Would you like to install the dependencies?',
      default: true,
      store: true
    }];

    this.prompt(prompts).then(({ app, install }) => {
      this.appName = app;
      this.install = install;
      done();
    });
  }

  // just in case
  configuring() {
    return;
  }

  // writing our files
  writing() {

    // write package.json
    const packageJson = {
      name: (0, _underscore.dasherize)(this.appName),
      version: '0.1.0',
      private: true,
      repository: {
        type: 'git',
        url: this.repoUrl
      },
      main: './node_modules/react-native-scripts/build/bin/crna-entry.js',
      scripts: {
        start: 'react-native-scripts start',
        eject: 'react-native-scripts eject',
        android: 'react-native-scripts android',
        ios: 'react-native-scripts ios',
        test: 'node node_modules/jest/bin/jest.js --watchAll'
      },
      jest: {
        preset: 'jest-expo'
      }
    };
    _fs2.default.writeFileSync(_path2.default.resolve(cwd, 'package.json'), JSON.stringify(packageJson, null, 2));

    // write app.json
    const appJson = {
      name: this.appName,
      displayName: (0, _underscore.camelize)(this.appName),
      expo: {
        sdkVersion: _config.sdkVersion,
        name: this.appName
      }
    };
    _fs2.default.writeFileSync(_path2.default.resolve(cwd, 'app.json'), JSON.stringify(appJson, null, 2));

    // parse templates
    _templates2.default.forEach(template => {
      this.fs.copyTpl(this.templatePath(template.from), this.destinationPath(template.to), this);
    });
  }

  // install
  install() {

    // install deps
    if (this.install) {
      this.npmInstall(_config.deps, { 'save': true, loglevel: 'silent', progress: true });
      this.npmInstall(_config.devDeps, { 'save-dev': true, loglevel: 'silent', progress: true });
    }
  }
}

// exporting generator as CommonJS module
module.exports = ReactNativeGenerator;