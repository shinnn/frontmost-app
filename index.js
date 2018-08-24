'use strict';

if (process.platform === 'darwin') {
	const {execFile} = require('child_process');

	const pify = require('pify');

	const binPath = require.resolve('./frontmost-app');
	const option = {timeout: 2000};
	const promisifiedExecFile = pify(execFile);

	module.exports = async function frontmostApp(...args) {
		const argLen = args.length;

		if (argLen !== 0) {
			throw new RangeError(`Expected no arguments, but got ${argLen} argument${
				argLen === 1 ? '' : 's'
			}.`);
		}

		const properites = (await promisifiedExecFile(binPath, option)).split('\x07');
		const [localizedName, bundleId, bundlePath, executablePath, isLaunched, pid] = properites;

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
