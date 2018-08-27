'use strict';

if (process.platform === 'darwin') {
	const {execFile} = require('child_process');
	const {promisify} = require('util');

	const binPath = require.resolve('./frontmost-app');
	const option = {timeout: 2000};
	const promisifiedExecFile = promisify(execFile);

	module.exports = async function frontmostApp(...args) {
		const argLen = args.length;

		if (argLen !== 0) {
			throw new RangeError(`Expected no arguments, but got ${argLen} argument${
				argLen === 1 ? '' : 's'
			}.`);
		}

		const [
			localizedName,
			bundleId,
			bundlePath,
			executablePath,
			isLaunched,
			pid
		] = (await promisifiedExecFile(binPath, option)).stdout.split('\x07');

		return {
			localizedName,
			bundleId,
			bundlePath,
			executablePath,
			isLaunched: !!isLaunched,
			pid: parseInt(pid, 10)
		};
	};

	Object.defineProperty(module.exports, 'supported', {
		value: true,
		enumerable: true
	});
} else {
	const platformName = require('platform-name');

	module.exports = async function frontmostApp() {
		const error = new Error(`frontmost-app only supports macOS, but the current platform is ${platformName()}.`);
		error.code = 'ERR_UNSUPPORTED_PLATFORM';

		throw error;
	};

	Object.defineProperty(module.exports, 'supported', {
		value: false,
		enumerable: true
	});
}
