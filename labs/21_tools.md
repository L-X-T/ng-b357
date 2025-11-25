# 21 Accessibility Tools

<!-- TOC -->

- [Install: Chrome extensions](#install-chrome-extensions)
- [How to identify issues](#how-to-identify-issues)
  - [How to know what to fix](#how-to-know-what-to-fix)
  - [Setup: Manual testing](#setup-manual-testing)
    - [Screen readers](#screen-readers)
    - [Other tools](#other-tools)
  - [Setup: Automated testing](#setup-automated-testing)
    - [Angular ESLint](#angular-eslint)
    - [Lighthouse Chrome Dev Tools](#lighthouse-chrome-dev-tools)
    - [Web Accessibility Evaluation Tool](#web-accessibility-evaluation-tool)
- [Exercise: Run tests](#exercise-run-tests)
- [Bonus: Accessibility Insights](#bonus-accessibility-insights)
- [Bonus: Test your own Angular app](#bonus-test-your-own-angular-app)
<!-- TOC -->

In this lab, you will learn how to use some of the most popular **accessibility testing tools**.

These tools will help you identify accessibility issues in your Angular app.

**Lab time:** 30–40 minutes

## Install: Chrome extensions

It's strongly recommended to use a **Chromium** browser for this workshop!

Before we start we please **add** the following **extensions** for your browser:

- [**WAVE**](https://chromewebstore.google.com/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh) Chrome extension
- [Accessibility Insights](https://chromewebstore.google.com/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni) (optional, for automated testing)
- [axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd) (optional, for automated testing)
- [HeadingsMap](https://chromewebstore.google.com/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi) (optional, for heading structure)

You may need to restart your browser now to see the just added extensions.

In the workshop, we'll focus on the accessibility of the existing app features...

## How to identify issues

You will start by identifying accessibility issues in your app, then turn the 🛑 into a ✅ by implementing a solution.

### How to know what to fix

Start each lab by recognizing the accessibility issue using a mixture of manual and automated testing. In the current state of the web, manually testing is mandatory.

You have tools that can identify accessibility issues, but no tool can certify that an app is fully accessible. Manual testing ensures that you test for a breadth of a11y concepts that include logical content order and feature parity.

### Setup: Manual testing

To manually test accessibility in this course, you primarily navigate through your app with keyboard navigation. Additionally, you can turn on our computer's screen reader. This is not necessary all the time, but it's a good practice to get familiar with screen readers.

#### Screen readers

You can use any one this screen readers:

- [**NVDA**](https://nvda.bhvd.de) (Windows, free, okay)
- [Speech Output, Narrator](https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1) (Windows, built-in, bad)
- Jaws (Windows, paid, better)
- [**Voice Over**](https://en.wikipedia.org/wiki/VoiceOver) (Mac/iOS, built-in)
- [**Talkback**](https://support.google.com/accessibility/android/answer/6283677?hl=en&sjid=14818511639127973246-EU) (Android, built-in)
- [**Orca**](https://www.a11yproject.com/posts/getting-started-with-orca/) (Linux, free)

Practice by turning on the screen reader (on windows download and install NVDA first) and navigating the screen.

In the workshop, you primarily test issues manually, and use automated tools to assist in checking specific automatable features.

#### Other tools

- [whocanuse.com](https://www.whocanuse.com) Website for color contrasts

### Setup: Automated testing

You also use a few development tools to automate and audit your app. These tools allow you to quickly and easily check things like the presence of alt text on an image or the contrast ratio of a text color. You can think of these tools as linters; they can recognize that alt text is present, but you must manually check that the content is logical and provides value.

#### Angular ESLint

You can use the Angular ESLint package to lint your code for automatable a11y attributes. In eslint.json, make sure to add the a11y ruleset plugin `@angular-eslint/template/accessibility` to your HTML templates:

To add Angular ESLint to your own Angular app, simply run:

```shell
ng add @angular-eslint/schematics
```

Then, in your `.eslintrc.json` file, add the following plugin to the `overrides` section:

```js
{
  "overrides": [
    /* [...] */
    {
      "files": ["*.html"],
      "extends": [
        "plugin:@angular-eslint/template/recommended",
        /* add the following line */
        "plugin:@angular-eslint/template/accessibility"
      ],
      "rules": {
         /* [...] */
      }
    }
  ]
}
```

Note, that starting with version 17 the plugin `@angular-eslint/template/accessibility` is included per default.

Note, that with ESLint v9 the new flat config in `eslint.config.js` looks a bit different:

```js
module.exports = tseslint.config(
  /* [...] */
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      /* [...] */
    },
  },
);
```

For more information, see the latest [Angular ESLint](https://github.com/angular-eslint/angular-eslint/tree/main/packages/eslint-plugin-template) rules on GitHub.

#### Lighthouse Chrome Dev Tools

1. Open your DevTools and select the Lighthouse tab.
2. The options `Navigation` and `Mobile` (or `Desktop`) are okay.
3. Select the `Accessibility` checkbox and deselect all other checkboxes.
4. Click `Generate report` to run a Lighthouse A11y audit.
5. Check the results of your audit.

#### Web Accessibility Evaluation Tool

- If you want to check a public web property, you can also try the [WAVE](https://wave.webaim.org/) online tool.
- If your Angular app is only available locally, you can use the [WAVE Chrome extension](https://wave.webaim.org/extension/).

## Exercise: Run tests

If you haven't done so already, serve this app on `localhost:4200` and run these automated tests

1. `ng lint` with ESLint A11y.
2. `ng serve`, open in Chrome and then test with Lighthouse Accessibility.
3. `ng serve`, open in Chrome and then test with WAVE Chrome extension.

### Bonus: Accessibility Insights

1. If you haven't done so already, install the [Accessibility Insights](https://chromewebstore.google.com/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni) Chrome extension.
2. Open it by clicking on the extension icon and selecting Accessibility Insights.
3. Click `FastPass` to run a quick first test of your page.

### Bonus: Test your own Angular app

1. Now set up and run ESLint A11y, Lighthouse, WAVE for your own project.
2. If possible, prepare to share some findings with the group.
