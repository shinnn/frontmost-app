@import AppKit;

int main() {
	NSRunningApplication *frontmostApplication = [NSWorkspace sharedWorkspace].frontmostApplication;
	printf(
		"%s\a%s\a%s\a%s\a%s\a%d\a",
		[frontmostApplication.localizedName UTF8String],
		[frontmostApplication.bundleIdentifier UTF8String],
		[frontmostApplication.bundleURL.path UTF8String],
		[frontmostApplication.executableURL.path UTF8String],
		frontmostApplication.isFinishedLaunching ? "1" : "",
		frontmostApplication.processIdentifier
	);

	return 0;
}
