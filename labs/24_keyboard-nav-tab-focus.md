# 24 Keyboard Navigation & Tab Focus

<!-- TOC -->

- [Add autofocus to the Flight Search form](#add-autofocus-to-the-flight-search-form)
- [Focus order](#focus-order)
- [Focus indicator](#focus-indicator)
- [Bonus: Create a skip link](#bonus-create-a-skip-link)
- [Bonus: Your own Angular app](#bonus-your-own-angular-app)
<!-- TOC -->

In this lab, you will learn how to improve the **keyboard navigation** and **tab focus** in your Angular app.

**Lab time:** 30–40 minutes

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
    const input = this.doc.querySelector('app-flight-search input') as HTMLInputElement;
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
2. Now try styling the `outline` to fit the styling of the App or by adding `tabindex=0`.
3. Maybe you also want to change the outline of the `input` fields to be easier to recognize and to look better.

Good luck!

## Bonus: Create a skip link

1. Add a skip link to the `sidebar.component.html` HTML-template:

   ```html
   <!-- Skip Link -->
   <button class="skip-link" type="button" (click)="onSkipToMainContent()">Skip to main content</button>

   <nav class="sidebar-wrapper">...</nav>
   ```

2. Add styles to the `sidebar.component.scss` stylesheet:

   ```css
   .skip-link {
     position: absolute;
     top: 0.75rem;
     left: 0.875rem;
     background: #f4f3ef; // same as main content
     color: #2c2c2c; // same as main content
     outline-color: peru;
     padding: 0.5rem 0.75rem;
     border-radius: 0.25rem;
     z-index: 1000; // should be high enough ;-)
     transform: translateY(-200%);
   }

   .skip-link:focus {
     transform: translateY(0);
   }
   ```

3. The skip link should jump to the main content via the `onSkipToMainContent` method in the `sidebar.component.ts` class file:

   ```typescript
   export class SidebarComponent {
     // ...
     private readonly document = inject(DOCUMENT);
     private readonly focusableSelector = `
       a[href], button:not([disabled]):not(.navbar-toggler), textarea:not([disabled]),
       input:not([disabled]):not([type="hidden"]),
       select:not([disabled]), [tabindex]:not([tabindex="-1"])
     `;

     // ...

     protected onSkipToMainContent(): void {
       const mainElements = this.document.getElementsByTagName('main');
       if (!mainElements.length) {
         console.warn('No main element found');
         return;
       }

       const focusableElements = mainElements[0].querySelectorAll<HTMLElement>(this.focusableSelector);
       if (focusableElements.length) {
         console.log(focusableElements);
         focusableElements[0].focus();
       } else {
         console.warn('No focusable elements found in main');
       }
     }
   }
   ```

4. Test the skip link by pressing the `Tab` key. Does it work?

## Bonus: Your own Angular app

1. Now switch to your own project and check your **tab focus** order.
2. If possible, prepare to share your findings with the group.
