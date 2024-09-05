# 01 Accessibility Tools

<!-- TOC -->

- [Install Chrome extensions](#install-chrome-extensions)
- [Identify issues](#identify-issues)
  - [How to know what to fix](#how-to-know-what-to-fix)
  - [Manual testing](#manual-testing)
    - [Screen reader](#screen-reader)
  - [Automated testing](#automated-testing)
    - [Angular ESLint](#angular-eslint)
    - [Lighthouse and Chrome Developer Tools](#lighthouse-and-chrome-developer-tools)
    - [Axe](#axe)
    - [Bonus: Accessibility Insights](#bonus-accessibility-insights)
    - [Bonus: WAVE](#bonus-wave)
  - [Run tests](#run-tests)
  <!-- TOC -->

This lab will get you started with some important **Testing Tools**.

## Install Chrome extensions

It's strongly recommended to use a **Chromium** browser for this workshop!

Before we start we please **add** the following **extensions** for your browser:

- [WAVE](https://chromewebstore.google.com/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh) Testing Tool
- [Accessibility Insights](https://chromewebstore.google.com/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni) Testing Tool
- [axe DevTools](https://chromewebstore.google.com/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd) Testing Tool
- [Read Aloud](https://chromewebstore.google.com/detail/read-aloud-a-text-to-spee/hdhinadidafjejdhmfkjgnolgimiaplp) Screen Reader
- [HeadingsMap](https://chromewebstore.googe.com/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi) (optional, for headings structure)
- [Web Developer](https://chromewebstore.google.com/detail/web-developer/bfbameneiokkgbdmiekhjnmfkcnldhhm) (optional, but handy toolset)

You may need to restart your browser now, to see the just added extensions.

In the workshop, we'll focus on the accessibility of the existing app features...

## Identify issues

You will start by identifying accessibility issues in your app, then turn the 🛑 into a ✅ by implementing a solution.

### How to know what to fix

Start each lab by recognizing the accessibility issue using a mixture of manual and automated testing. In the current state of the web, manually testing is mandatory.

You have tools that can identify accessibility issues, but no tool can certify that an app is fully accessible. Manual testing ensures that you test for a breadth of a11y concepts that include logical content order and feature parity.

### Manual testing

To manually test accessibility in this course, you turn on our computer's built-in screen reader and navigate through your app with keyboard navigation. Practice by turning on the screen reader and navigating the screen.

#### Screen reader

You can use any one this screen readers:

- [NVDA](https://nvda.bhvd.de) (Windows, free)
- [Narrator](https://support.microsoft.com/en-us/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1) (Windows, built-in)
- Jaws (Windows, expansive)
- [Voice Over](https://en.wikipedia.org/wiki/VoiceOver) (Mac/iOS, built-in)
- [Orca](https://www.a11yproject.com/posts/getting-started-with-orca/) (Linux, free)
- [Talkback](https://support.google.com/accessibility/android/answer/6283677?hl=en&sjid=14818511639127973246-EU) (Android, built-in)
- [Read Aloud](https://chromewebstore.google.com/detail/read-aloud-a-text-to-spee/hdhinadidafjejdhmfkjgnolgimiaplp) Chrome Extension

In the workshop, you primarily test issues manually, and use automated tools to assist in checking specific automatable features.

### Automated testing

You also use a few development tools to automate and audit your app. These tools allow you to quickly and easily check things like the presence of alt text on an image or the contrast ratio of a text color. You can think of these tools as linters; they can recognize that alt text is present, but you must manually check that the content is logical and provides value.

#### Angular ESLint

You can use the Angular ESLint package to lint your code for automatable a11y attributes. In eslint.json, make sure to add the a11y ruleset plugin `@angular-eslint/template/accessibility` to your HTML templates:

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

To add Angular ESLint to your own Angular app, simply run:

```shell
ng add @angular-eslint/schematics
```

Note, that with the newest version the plugin `@angular-eslint/template/accessibility` is included per default.

For more information, see the latest [Angular ESLint](https://github.com/angular-eslint/angular-eslint/tree/main/packages/eslint-plugin-template) rules on GitHub.

#### Lighthouse and Chrome Developer Tools

1. Open your DevTools and select the Lighthouse tab.
2. The options `Navigation` and `Mobile` (or `Desktop`) are okay.
3. Select the `Accessibility` checkbox and deselect all other checkboxes.
4. Click `Generate report` to run a Lighthouse A11y audit.
5. Check the results of your audit.

#### Axe

1. If you haven't done so already, install the [axe DevTools](https://chromewebstore.google.com/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd) Chrome extension.
2. Open your DevTools and select the axe DevTools tab.
3. Click `Scan all of my page` to run an axe DevTools scan.

#### Bonus: Accessibility Insights

1. If you haven't done so already, install the [Accessibility Insights](https://chromewebstore.google.com/detail/accessibility-insights-fo/pbjjkligggfmakdaogkfomddhfmpjeni) Chrome extension.
2. Open it by clicking on the extension icon and selecting Accessibility Insights.
3. Click `FastPass` to run a quick first test of your page.

#### Bonus: WAVE

If you want to check a public web property you can also try the [WAVE](https://wave.webaim.org/) Web Accessibility Evaluation Tool.

### Run tests

If you haven't done so already, run some automated tests!
