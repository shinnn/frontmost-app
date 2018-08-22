'use strict';

const {join} = require('path');

const frontmostApp = require('.');
const clearModule = require('clear-module');
const isNaturalNumber = require('is-natural-number');
const pretendPlatform = require('pretend-platform');
const puppeteer = require('puppeteer');
const test = require('tape');

test('frontmostApp()', async t => {
	const browser = await puppeteer.launch({headless: false});
	const {localizedName, bundleId, bundlePath, executablePath, isLaunched, pid} = await frontmostApp();

	t.equal(
		localizedName,
		'Chromium',
		'should get the name of the frontmost app.'
	);

	t.equal(
		bundleId,
		'org.chromium.Chromium',
		'should get the bundle identifier of the frontmost app.'
	);

	t.equal(
		bundlePath,
		join(puppeteer.executablePath(), '..', '..', '..'),
		'should get the bundle path of the frontmost app.'
	);

	t.equal(
		executablePath,
		puppeteer.executablePath(),
		'should get the executable path of the frontmost app.'
	);

	t.equal(
		isLaunched,
		true,
		'should get the status whether the frontmost app has finished launching.'
	);

	t.equal(
		isNaturalNumber(pid),
		true,
		'should get the process ID the frontmost app.'
	);

	await browser.close();

	try {
		await frontmostApp(0);
		t.fail('Unexpectedly succeeded.');
	} catch (err) {
		t.equal(
			err.toString(),
			'RangeError: Expected no arguments, but got 1 argument.',
			'should fail when it takes an argument.'
		);
	}

	try {
		await frontmostApp(0, 1);
		t.fail('Unexpectedly succeeded.');
	} catch (err) {
		t.equal(
			err.toString(),
			'RangeError: Expected no arguments, but got 2 arguments.',
			'should fail when it takes arguments.'
		);
	}

	t.end();
});

test('frontmostApp() on a non-macOS environment', async t => {
	clearModule('.');
	pretendPlatform('sunos');

	try {
		await require('.')();
	} catch (err) {
		t.equal(
			err.toString(),
			'Error: frontmost-app only supports macOS, but the current platform is Solaris.',
			'should fail.'
		);
	}

	t.end();
});
