# 22 Angular Router

<!-- TOC -->

- [Define unique page titles in your SPA](#define-unique-page-titles-in-your-spa)
  - [Set the page title depending on route params](#set-the-page-title-depending-on-route-params)
  - [Add a global page title suffix](#add-a-global-page-title-suffix)
- [Set aria-current to page in the sidebar nav](#set-aria-current-to-page-in-the-sidebar-nav)
- [Bonus: Your own Angular routes](#bonus-your-own-angular-routes)
<!-- TOC -->

In this lab, you will learn how to improve the **accessibility** of your Angular app by setting unique page titles and adding the `aria-current` attribute to the sidebar navigation.

**Lab time:** 30–45 minutes

## Define unique page titles in your SPA

Clear page titles aid users, especially those with visual impairments, to grasp a web page's essence swiftly. This is especially true for Angular apps and their **single-page** nature.

With Angular v14's Router update, developers can now easily assign distinct page titles, enhancing **A11y** and **UX**.

Simply switch to your `app.routes.ts` routes definition and add a `title` to each route.

<details>
<summary>Show Example</summary>
<p>

```typescript
export const appRoutes: Route[] = [
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home - NG A11y'
  },
  [...]
]

```

</p>
</details>

Do the same in the `flights.routes.ts`.

### Set the page title depending on route params

Try to set the page title depending on the route params, i.e. in the `FlightEditComponent` set the title to for the Flight Edit depending on the flight id.

1. Inject the `Title`:

```typescript
private readonly title = inject(Title);
```

2. Set the id of the route:

```typescript
this.title.setTitle(`Edit Flight #${this.id} - NG A11y`);
```

### Add a global page title suffix

You can also add a global page title suffix to your app. This is useful if you want to have a consistent title format across all pages. To address this, you need to extend _Angular's_ abstract `TitleStrategy` class and implement your custom page title strategy:

```typescript
// [imports]

@Injectable()
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  updateTitle(routerState: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(routerState);
    if (pageTitle) {
      this.title.setTitle(`${pageTitle} – NG A11y`);
    } else {
      this.title.setTitle('NG A11y');
    }
  }
}
```

Then add the custom title strategy to your app.config.ts:

```typescript
// [imports]
import { PageTitleStrategy } from './page-tite-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    { provide: TitleStrategy, useClass: PageTitleStrategy }, // add this line
  ],
};
```

## Set aria-current to page in the sidebar nav

A non-null [aria-current](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current) state on an element indicates that this element represents the current item within a container or set of related elements.

Switch to your `sidebar.component.html` and add `ariaCurrentWhenActive="page"` to each nav item.

<details>
<summary>Show Example</summary>
<p>

```html
<li routerLinkActive="active" ariaCurrentWhenActive="page">
  <a routerLink="/home">
    <p>Home</p>
  </a>
</li>
```

</p>
</details>

## Bonus: Your own Angular routes

1. Now switch to your own project and add some unique page titles and set the `aria-current` attribute.
2. If possible, prepare to share your implementation with the group.
