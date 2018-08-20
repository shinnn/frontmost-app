'use strict';

var PinkiePromise = require('pinkie-promise');

if (process.platform === 'darwin') {
	var execFile = require('child_process').execFile;

	var pify = require('pify');

	var option = {timeout: 2000};
	var binPath = require.resolve('./frontmost-app');

	var promisifiedExecFile = pify(execFile, {promiseModule: PinkiePromise});

	module.exports = function frontmostApp() {
		return promisifiedExecFile(binPath, option).then(function handle(stdout) { // eslint-disable-line promise/prefer-await-to-then
			var arr = stdout.split('\u0007');

			return {
				localizedName: arr[0],
				bundleId: arr[1],
				bundlePath: arr[2],
				executablePath: arr[3],
				isLaunched: !!arr[4],
				pid: parseInt(arr[5], 10)
			};
		});
	};

	Object.defineProperty(module.exports, 'supported', {
		value: true,
		enumerable: true
	});
} else {
	module.exports = function getChromeTabs() {
		var platformName = require('platform-name');

		var error = new Error('frontmost-app only supports macOS, but the current platform is ' + platformName() + '.');
		error.code = 'ERR_UNSUPPORTED_PLATFORM';

		return PinkiePromise.reject(error);
	};

	Object.defineProperty(module.exports, 'supported', {
		value: false,
		enumerable: true
	});
}
