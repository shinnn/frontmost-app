'use strict';

if (process.platform === 'darwin') {
	const {execFile} = require('child_process');

	const pify = require('pify');

	const option = {timeout: 2000};
	const binPath = require.resolve('./frontmost-app');

	const promisifiedExecFile = pify(execFile);

	module.exports = function frontmostApp(...args) {
		const argLen = args.length;

		if (argLen !== 0) {
			return Promise.reject(new RangeError(`Expected no arguments, but got ${argLen} argument${
				argLen === 1 ? '' : 's'
			}.`));
		}

		return promisifiedExecFile(binPath, option).then(stdout => { // eslint-disable-line promise/prefer-await-to-then
			const [localizedName, bundleId, bundlePath, executablePath, isLaunched, pid] = stdout.split('\x07');

			return {
				localizedName,
				bundleId,
				bundlePath,
				executablePath,
				isLaunched: !!isLaunched,
				pid: parseInt(pid, 10)
			};
		});
	};

	Object.defineProperty(module.exports, 'supported', {
		value: true,
		enumerable: true
	});
} else {
	const platformName = require('platform-name');

	module.exports = function frontmostApp() {
		const error = new Error(`frontmost-app only supports macOS, but the current platform is ${platformName()}.`);
		error.code = 'ERR_UNSUPPORTED_PLATFORM';

		return Promise.reject(error);
	};

	Object.defineProperty(module.exports, 'supported', {
		value: false,
		enumerable: true
	});
}
