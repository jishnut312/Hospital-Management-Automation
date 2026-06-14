# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui.spec.js >> Patients section @ui >> search shows empty state for no match
- Location: tests\ui.spec.js:181:3

# Error details

```
Error: browserContext.close: Test ended.
Browser logs:

<launching> C:\Users\user\AppData\Local\ms-playwright\firefox-1522\firefox\firefox.exe -no-remote -headless -profile C:\Users\user\AppData\Local\Temp\playwright_firefoxdev_profile-MJZ2RW -juggler-pipe -silent
<launched> pid=16260
[pid=16260][err] *** You are running in headless mode.
[pid=16260][err] JavaScript warning: resource://services-settings/Utils.sys.mjs, line 119: unreachable code after return statement
[pid=16260][out] 
[pid=16260][out] Juggler listening to the pipe
[pid=16260][out] Crash Annotation GraphicsCriticalError: |[0][GFX1-]: RenderCompositorSWGL failed mapping default framebuffer, no dt (t=10.2868) [GFX1-]: RenderCompositorSWGL failed mapping default framebuffer, no dt
[pid=16260][err] JavaScript error: chrome://juggler/content/Helper.js, line 82: NS_ERROR_FAILURE: Component returned failure code: 0x80004005 (NS_ERROR_FAILURE) [nsIWebProgress.removeProgressListener]
[pid=16260][out] console.warn: services.settings: #fetchAttachment: Forcing fallbackToDump to false due to Utils.LOAD_DUMPS being false
[pid=16260][out] console.error: (new NotFoundError("Could not find fa0fc42c-d91d-fca7-34eb-806ff46062dc in cache or dump", "resource://services-settings/Attachments.sys.mjs", 48))
[pid=16260][out] console.warn: "Unable to find the attachment for" "fa0fc42c-d91d-fca7-34eb-806ff46062dc"
[pid=16260][out] console.error: "Error fetching remote settings base url from CDN. Falling back to https://firefox-settings-attachments.cdn.mozilla.net/" (new SyntaxError("XMLHttpRequest.open: '/' is not a valid URL.", (void 0), 126))
[pid=16260][err] JavaScript error: chrome://juggler/content/Helper.js, line 82: NS_ERROR_FAILURE: Component returned failure code: 0x80004005 (NS_ERROR_FAILURE) [nsIWebProgress.removeProgressListener]
[pid=16260][out] console.error: services.settings: 
[pid=16260][out]   Message: EmptyDatabaseError: "main/nimbus-desktop-experiments" has not been synced yet
[pid=16260][out]   Stack:
[pid=16260][out]     EmptyDatabaseError@resource://services-settings/Database.sys.mjs:19:5
[pid=16260][out] list@resource://services-settings/Database.sys.mjs:96:13
[pid=16260][out] 
[pid=16260][out] console.error: [Exception... "Component returned failure code: 0x80070057 (NS_ERROR_ILLEGAL_VALUE) [nsIWinTaskbar.getTaskbarProgress]"  nsresult: "0x80070057 (NS_ERROR_ILLEGAL_VALUE)"  location: "JS frame :: moz-src:///browser/components/downloads/DownloadsTaskbar.sys.mjs :: #windowsAttachIndicator :: line 183"  data: no]
[pid=16260][out] console.warn: LoginRecipes: "Falling back to a synchronous message for: http://localhost:4000."
[pid=16260][err] JavaScript error: chrome://juggler/content/Helper.js, line 82: NS_ERROR_FAILURE: Component returned failure code: 0x80004005 (NS_ERROR_FAILURE) [nsIWebProgress.removeProgressListener]
[pid=16260][out] console.error: [Exception... "Component returned failure code: 0x80070057 (NS_ERROR_ILLEGAL_VALUE) [nsIWinTaskbar.getTaskbarProgress]"  nsresult: "0x80070057 (NS_ERROR_ILLEGAL_VALUE)"  location: "JS frame :: moz-src:///browser/components/downloads/DownloadsTaskbar.sys.mjs :: #windowsAttachIndicator :: line 183"  data: no]
[pid=16260][out] console.warn: LoginRecipes: "Falling back to a synchronous message for: http://localhost:4000."
[pid=16260][out] console.error: [Exception... "Component returned failure code: 0x80070057 (NS_ERROR_ILLEGAL_VALUE) [nsIWinTaskbar.getTaskbarProgress]"  nsresult: "0x80070057 (NS_ERROR_ILLEGAL_VALUE)"  location: "JS frame :: moz-src:///browser/components/downloads/DownloadsTaskbar.sys.mjs :: #windowsAttachIndicator :: line 183"  data: no]
[pid=16260][out] console.warn: LoginRecipes: "Falling back to a synchronous message for: http://localhost:4000."
[pid=16260][err] JavaScript error: chrome://juggler/content/Helper.js, line 82: NS_ERROR_FAILURE: Component returned failure code: 0x80004005 (NS_ERROR_FAILURE) [nsIWebProgress.removeProgressListener]
[pid=16260][err] JavaScript error: chrome://juggler/content/Helper.js, line 82: NS_ERROR_FAILURE: Component returned failure code: 0x80004005 (NS_ERROR_FAILURE) [nsIWebProgress.removeProgressListener]
[pid=16260][out] console.error: [Exception... "Component returned failure code: 0x80070057 (NS_ERROR_ILLEGAL_VALUE) [nsIWinTaskbar.getTaskbarProgress]"  nsresult: "0x80070057 (NS_ERROR_ILLEGAL_VALUE)"  location: "JS frame :: moz-src:///browser/components/downloads/DownloadsTaskbar.sys.mjs :: #windowsAttachIndicator :: line 183"  data: no]
[pid=16260][err] JavaScript warning: resource://gre/modules/UpdateService.sys.mjs, line 4031: unreachable code after return statement
[pid=16260][out] console.warn: LoginRecipes: "Falling back to a synchronous message for: http://localhost:4000."
[pid=16260][err] JavaScript error: chrome://juggler/content/Helper.js, line 82: NS_ERROR_FAILURE: Component returned failure code: 0x80004005 (NS_ERROR_FAILURE) [nsIWebProgress.removeProgressListener]
[pid=16260][out] console.error: [Exception... "Component returned failure code: 0x80070057 (NS_ERROR_ILLEGAL_VALUE) [nsIWinTaskbar.getTaskbarProgress]"  nsresult: "0x80070057 (NS_ERROR_ILLEGAL_VALUE)"  location: "JS frame :: moz-src:///browser/components/downloads/DownloadsTaskbar.sys.mjs :: #windowsAttachIndicator :: line 183"  data: no]
[pid=16260][out] console.warn: LoginRecipes: "Falling back to a synchronous message for: http://localhost:4000."
[pid=16260][err] JavaScript error: chrome://juggler/content/Helper.js, line 82: NS_ERROR_FAILURE: Component returned failure code: 0x80004005 (NS_ERROR_FAILURE) [nsIWebProgress.removeProgressListener]
```