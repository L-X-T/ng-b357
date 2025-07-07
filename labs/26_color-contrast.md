# 26 Color & Contrast

<!-- TOC -->

- [Find contrast issues](#find-contrast-issues)
- [Fix insufficient contrast](#fix-insufficient-contrast)
- [Fix too small text](#fix-too-small-text)
- [Bonus: Final checks](#bonus-final-checks)
- [Bonus: Manual checks](#bonus-manual-checks)
<!-- TOC -->

In this lab, you will learn how to improve the **accessibility** of your Angular app by fixing **color & contrast** issues.

**Lab time:** 30–45 minutes

## Find contrast issues

Before you start, check for issues with your preferred tool (e.g. Lighthouse)! You should find some issues.

## Fix insufficient contrast

Fix insufficient contrast by changing the colors.

Additionally, think about adding a `text-decoration: underline` to your links. This is generally considered to be a good practice, because links without underline might not be easily recognizable.

Also, since must users nowadays use touch devices, the hover state plays a less important role.

## Fix too small text

Mak e sure your text is at least `14px` if not `16px` large (using `html { font-size: 100% }`).

**Hint**: You can use this JavaScript snippet to find all elements with a font size smaller than `15px`:

```javascript
(() => {
  document.querySelectorAll('*').forEach((node) => {
    const fontSize = parseFloat(window.getComputedStyle(node).getPropertyValue('font-size'));
    if (fontSize < 15) {
      console.log(node);
    }
  });
})();
```

## Bonus: Final checks

Now run all your tools once more (on both pages) to find some leftover issues:

- ESLint
- Lighthouse or WAVE DevTools
- and - last but not least - your favorite screen reader

Congratulations, you addressed common web accessibility issues in your Angular app! 🎉

![a11y-100.png](./a11y-100.png)

## Bonus: Manual checks

Now run the Lighthouse A11y test once more and check this section **ADDITIONAL ITEMS TO MANUALLY CHECK (10)**.

If you find an issue, please let me know 😏
