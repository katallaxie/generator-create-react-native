// deps
import yosay from 'yosay'
import proc from 'process'
import path from 'path'
import fs from 'fs'
import Generator from 'yeoman-generator'
import { camelize, dasherize } from 'underscore.string'

// load configs
import templates from './templates'
import { deps, devDeps, sdkVersion } from './config'

// cwd
const cwd = proc.cwd()

// generator
class ReactNativeGenerator extends Generator {
  constructor(args, options) {
    super(args, options)

    // this allows to directly pass in the name of the application
    this.argument('appname', {
      desc: `The name of the application (e.g. 'Hello World')`,
      type: String,
      optional: true,
      default: path.basename(cwd)
    })

    this.appName = this.options.appname
  }

  // we use a property, because this is executed first
  get initializing() {
    // setup
    function setup() {
      // do no create the path
      if (path.basename(cwd) === this.appName) {
        return
      }

      const destinationPath = path.resolve(cwd, this.appName)
      // try to create
      try {
        fs.mkdirSync(destinationPath)
      } catch (err) {
        if (err.code !== 'EEXIST') throw err
      }

      // set to the new destination
      this.destinationRoot(destinationPath)
    }

    // say hello
    function hello() {
      // say yo, to any new gopher
      this.log(yosay(`Greetings! Let's get your project started.`))
    }

    return {
      setup,
      hello
    }
  }

  // set necessary paths
  paths() {
    // set new source path
    this.sourceRoot(path.resolve(__dirname, '../../templates/'))
  }

  // prompting the user for inputs
  prompting() {
    // async
    const done = this.async()

    const prompts = [
      {
        type: 'input',
        name: 'app',
        message: `What is the name of your new app?`,
        default: this.appName,
        store: true
      },
      {
        type: 'list',
        name: 'sdkVersion',
        message: 'Which Expo SDK would like to use?',
        choices: sdkVersion,
        store: true,
        pageSize: 5
      },
      {
        type: 'confirm',
        name: 'install',
        message: 'Would you like to install the dependencies?',
        default: true,
        store: true
      }
    ]

    this.prompt(prompts).then(({ app, install, sdkVersion }) => {
      this.sdkVersion = sdkVersion
      this.appName = app
      this.install = install
      done()
    })
  }

  // just in case
  configuring() {
    return
  }

  // writing our files
  writing() {
    // write package.json
    const packageJson = {
      name: dasherize(this.appName),
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
    }
    fs.writeFileSync(
      path.resolve(this.destinationRoot(), 'package.json'),
      JSON.stringify(packageJson, null, 2)
    )

    // write app.json
    const appJson = {
      name: this.appName,
      displayName: camelize(this.appName),
      expo: {
        sdkVersion: this.sdkVersion,
        name: this.appName
      }
    }
    fs.writeFileSync(
      path.resolve(this.destinationRoot(), 'app.json'),
      JSON.stringify(appJson, null, 2)
    )

    // parse templates
    templates.forEach(template => {
      this.fs.copyTpl(
        this.templatePath(template.from),
        this.destinationPath(template.to),
        this
      )
    })
  }

  // install
  install() {
    if (!this.install) {
      return
    }

    this.npmInstall(
      deps[this.sdkVersion],
      {
        save: true,
        loglevel: 'silent',
        progress: true
      },
      {
        cwd: this.destinationRoot()
      }
    )
    this.npmInstall(
      devDeps,
      {
        'save-dev': true,
        loglevel: 'silent',
        progress: true
      },
      {
        cwd: this.destinationRoot()
      }
    )
  }
}

// exporting generator as CommonJS module
module.exports = ReactNativeGenerator
