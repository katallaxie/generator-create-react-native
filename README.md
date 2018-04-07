[![Taylor Swift](https://img.shields.io/badge/secured%20by-taylor%20swift-brightgreen.svg)](https://twitter.com/SwiftOnSecurity)
[![Volkswagen](https://auchenberg.github.io/volkswagen/volkswargen_ci.svg?v=1)](https://github.com/auchenberg/volkswagen)
[![Build Status](https://travis-ci.org/katallaxie/generator-create-react-native.svg?branch=master)](https://travis-ci.org/katallaxie/generator-create-react-native)
[![Greenkeeper badge](https://badges.greenkeeper.io/katallaxie/generator-react-native-preboot.svg)](https://greenkeeper.io/)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# A Yeoman React Native Generator

> I am somewhat sorry, because I know there is an other excellent project to get you start [create-react-native-app](https://github.com/react-community/create-react-native-app)

The generator uses the [Expo SDK](https://github.com/expo/expo-sdk) to bootstrap the application. Installing `watchman` is recommended, you can do so by `brew install watchman`.

Or you should do

```bash
sudo sysctl -w kern.maxfiles=5242880
sudo sysctl -w kern.maxfilesperproc=524288
```

## Getting Started

> We highly recommand to use `nvm` ([NVM](https://github.com/creationix/nvm)) to manage your Node versions, and to use the most recent versions

> You can install `yo`, as you do to use any [Yeoman](http://yeoman.io/) Generator. 

```bash
npm i -g generator-create-react-native
```

Have fun.

```
# create directory
mkdir my-new-app && cd $_ && create-react-native

# or let it do for your
create-react-native my-new-app
```

## Development

We can highly recommend to consult the Yeoman Guide to [write your own Yeoman Generator](http://yeoman.io/authoring/). Most importantly, to use the generator locally, you have to `npm link` the generator.

## License
[MIT](/LICENSE)