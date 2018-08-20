# frontmost-app

[![npm version](https://img.shields.io/npm/v/frontmost-app.svg)](https://www.npmjs.com/package/frontmost-app)
[![Build Status](https://travis-ci.com/shinnn/frontmost-app.svg?branch=master)](https://travis-ci.com/shinnn/frontmost-app)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/frontmost-app.svg)](https://coveralls.io/github/shinnn/frontmost-app?branch=master)

Get information of the frontmost app – the app that receives key events

```javascript
const frontmostApp = require('frontmost-app');

(async () => {
  await frontmostApp(); /*=> {
    localizedName: 'Safari',
    bundleId: 'com.apple.Safari',
    bundlePath: '/Applications/Safari.app',
    executablePath: '/Applications/Safari.app/Contents/MacOS/Safari',
    isLaunched: true,
    pid: 30096
  } */
})();
```

*This module only supports macOS.*

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install frontmost-app
```

## API

```javascript
const frontmostApp = require('frontmost-app');
```

### frontmostApp()

Return: `Promise<Object>`

The resultant object has the following properties:

#### localizedName

Type: `string`

The localized name of the frontmost application.

#### bundleId

Type: `string`

The bundle identifier of the frontmost application.

#### bundlePath

Type: `string`

The path to the frontmost application's bundle.

#### executablePath

Type: `string`

The path to the frontmost application's executable.

#### isLaunched

Type: `boolean`

Whether the frontmost application has finished launching.

#### pid

Type: `integer`

The process identifier of the frontmost application.

## License

[ISC License](./LICENSE) © 2018 Shinnosuke Watanabe
