# 04 Keyboard Navigation & Tab Focus

<!-- TOC -->

- [Add autofocus to the Flight Search form](#add-autofocus-to-the-flight-search-form)
- [Focus order](#focus-order)
- [Focus indicator](#focus-indicator)
- [Bonus: Your own Angular app](#bonus-your-own-angular-app)
  <!-- TOC -->

This lab will show you how to control the **tab focus** in your application.

## Add autofocus to the Flight Search form

Switch to your `flight-search.component.ts` and add a focus management.

It should focus the first input field after the route has been activated.

You can add the focus management in the constructor, but first inject the `DOCUMENT` token.

```typescript
private readonly doc = inject(DOCUMENT);
```

```typescript
constructor() {
  [...]

  // add focus management here
  this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
    const input = this.doc.querySelector('input');
    if (input) {
      input.focus();
    }
  });
}
```

That was quite easy, huh?

Please note that we don't have to unsubscribe here since the router completes when the component is being destroyed.

## Focus order

Focus order, or tab order, dictates the sequence in which elements receive keyboard focus on a webpage. It should be logical and match the visual layout, starting typically from the top left to the bottom right. However, adjustments may be needed for languages read from right to left. Naturally focusable HTML elements like links and checkboxes are included by default.

You should not change the order. However, you can add `tabindex=0` to include non-interactive elements or custom components and, you can use `tabindex=-1` to remove elements.

1. Check the tab behavior of the `Flight Search`. There is something wrong, can you find it?

2. Go to the `flight-search.component.html` HTML-template and remove the `tabindex` property from the `input` fields.

3. Now open the `footer.component.html` HTML-template and add a `tabindex="-1"` to it's anchor to remove that item from the tab order.

4. Test the tab order by pressing the `Tab` key. Does it work?

## Focus indicator

Currently, we cannot visually see the focus when navigation through the sidebar. This is bad because the user should be able to see the current focus.

1. Go to the `sidebar.components.scss` stylesheet and remove the unwanted `outline: none`.

2. Now try styling the `outline` to fit the styling of the App.

3. Maybe you also want to change the outline of the `input` fields to be easier to recognize and to look better.

Good luck!

## Bonus: Your own Angular app

Now switch to your own project and check your **tab focus** order.
