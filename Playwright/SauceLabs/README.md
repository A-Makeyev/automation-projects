# Playwright & Cloudbeat Example

A Playwright project for testing the Sauce Demo website, with adjusted reporting for Cloudbeat

![Cloudbeat Results](https://github.com/cloudbeat-io/examples-typescript-playwright/blob/main/preview/cloudbeat-results.jpg?raw=true)

## Setup
1. Clone or download this project.
2. Navigate to the project directory: `cd cb-playwright`
3. Run `npm i` to install dependencies.

## Cloudbeat Reporter
At playwright.config.ts update: 

```
reporter: process.env.CB_AGENT ? '@cloudbeat/playwright' : 'html'
```

## Running Tests
- Run all tests: `npx playwright test --headed`
- Run a specific test class: `npx playwright login.spec.ts --project=chromium`


# Playwright & Allure Example

A Playwright project for testing the Sauce Demo website, with reporting adjusted for Allure.

![Cloudbeat Results](https://github.com/cloudbeat-io/examples-typescript-playwright/blob/main/preview/allure-results.jpg?raw=true)

## Setup
1. Clone or download this project.
2. Navigate to the project directory: `cd playwright-allure-example`
3. Run `npm i` to install Playwright dependencies.
4. Install the Allure reporter: `npm install -D allure-playwright`.
5. Install the Allure command-line tool globally: `npm install -g allure-commandline` (or locally if preferred).

## Allure Reporter
The `playwright.config.ts` file is configured to use the Allure reporter alongside the HTML reporter:

```typescript
reporter: [
  ['html'],
  ['allure-playwright'],
],
```

## Run
1. Run all tests with UI
```sh
npx playwright test --headed
allure generate allure-results --clean -o allure-report
allure open allure-report
```

2. Run all tests in headless mode
```sh
npx playwright test
allure generate allure-results --clean -o allure-report
allure open allure-report
```

3. Run a specific test file
```sh
npx playwright test tests/login.test.ts --project=chromium
allure generate allure-results --clean -o allure-report
allure open allure-report
```

### One line option:
```sh
npx playwright test --headed && allure generate allure-results --clean -o allure-report && allure open allure-report
```