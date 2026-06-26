# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui.spec.js >> Login page @ui >> shows error on wrong credentials
- Location: tests\ui.spec.js:45:3

# Error details

```
Error: page.fill: Target page, context or browser has been closed
Call log:
  - waiting for locator('#username')

```

```
Error: browserContext.close: Target page, context or browser has been closed
```