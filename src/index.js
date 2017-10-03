// deps
import yosay from 'yosay';
import proc from 'process';
import path from 'path';
import fs from 'fs';
import Generator from 'yeoman-generator';
import { camelize } from 'underscore.string';

// load configs
import templates from './templates';
import {
  deps,
  sdkVersion
} from './config';

// cwd
const cwd = proc.cwd();

// generator
class ReactNativeGenerator extends Generator {

  constructor(args, options) {
    super(args, options);

    // this allows to directly pass in the name of the application
    this.argument('appname', {
      desc: `The name of the application (e.g. 'hello-world')`,
      type: String,
      optional: true,
      default: path.basename(proc.cwd()),
    });

    this.appName = this.appname;
  }

  // we use a property, because this is executed first
  get initializing() {

      function hello() {
        // say yo, to any new gopher
        this.log(yosay(`Greetings! Let's get your next great app started.`));
      }

      return {
        hello
      }
  }

  // set necessary paths
  paths() {
    // set new source path
    this.sourceRoot(path.resolve(this.sourceRoot(), '../../templates/'));
  }

  // prompting the user for inputs
  prompting() {

    // async
    const done = this.async();

    const prompts = [{
      type    : 'input',
      name    : 'app',
      message : `What is the name of your new app?`,
      default : this.appName,
      store   : true,
    }, {
      type    : 'confirm',
      name    : 'install',
      message : 'Would you like to install the dependencies?',
      default : true,
      store   : true
    }];

    this.prompt(prompts).then(({app, install}) => {
      this.appName = app;
      this.install = install
      done();
    });

  }

  // just in case
  configuring() { return; };

  // writing our files
  writing() {

    // write package.json
    const packageJson = {
      name: this.appName,
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
        test: 'node node_modules/jest/bin/jest.js --watchAll',
      },
      jest: {
        preset: 'jest-expo'
      }
    };  
    fs.writeFileSync(path.resolve(cwd, 'package.json'), JSON.stringify(packageJson, null, 2));

    // write app.json
    const appJson = {
      name: this.appName,
      displayName: camelize(this.appName),
      expo: { 
        sdkVersion,
        name: this.appName
      },
    };
    fs.writeFileSync(path.resolve(cwd, 'app.json'), JSON.stringify(appJson, null, 2));

    // parse templates
    templates.forEach(template => {
      this.fs.copyTpl(
        this.templatePath(template.from),
        this.destinationPath(template.to),
        this
      );
    });

  }

   // install
   install() {
    
    // install deps
    if (this.install) {
      this.npmInstall(deps, { loglevel: 'silent', progress: true } );
    }

   }
}

// exporting generator as CommonJS module
module.exports = ReactNativeGenerator;
