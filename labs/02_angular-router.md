# 02 Angular Router

<!-- TOC -->

- [Define unique page titles in your SPA](#define-unique-page-titles-in-your-spa)
  - [Bonus: Set the page title depending on route params](#bonus-set-the-page-title-depending-on-route-params)
- [Set aria-current to page in the sidebar nav](#set-aria-current-to-page-in-the-sidebar-nav)
- [Bonus: Your own Angular routes](#bonus-your-own-angular-routes)
  <!-- TOC -->

This lab will show you the basic work to be done in **Angular Routing**.

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

Do the same in the `flight-booking.routes.ts`.

### Bonus: Set the page title depending on route params

Try to set the page title depending on the route params, i.e. in the `FlightEditComponent` set the title to for the Flight Edit depending on the flight id.

1. Inject the `Title`:

```typescript
private readonly title = inject(Title);
```

2. Set the id of the route:

```typescript
this.title.setTitle(`Edit Flight #${this.id} - NG A11y`);
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

Now switch to your own project and add some unique page titles and set the `aria-current` attribute.
