'use strict';

if (process.platform === 'darwin') {
	const execFile = require('child_process').execFile;

	const pify = require('pify');

	const option = {timeout: 2000};
	const binPath = require.resolve('./frontmost-app');

	const promisifiedExecFile = pify(execFile);

	module.exports = function frontmostApp() {
		return promisifiedExecFile(binPath, option).then(function handle(stdout) { // eslint-disable-line promise/prefer-await-to-then
			const arr = stdout.split('\u0007');

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
		const platformName = require('platform-name');

		const error = new Error(`frontmost-app only supports macOS, but the current platform is ${platformName()}.`);
		error.code = 'ERR_UNSUPPORTED_PLATFORM';

		return Promise.reject(error);
	};

	Object.defineProperty(module.exports, 'supported', {
		value: false,
		enumerable: true
	});
}
