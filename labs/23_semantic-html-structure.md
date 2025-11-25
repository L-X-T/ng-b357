# 23 Semantic HTML & Structure

<!-- TOC -->

- [Pre check](#pre-check)
- [Semantic HTML](#semantic-html)
- [Links `<a>` vs `<button>`](#links-a-vs-button)
  - [Links with `(click)` vs `href`](#links-with-click-vs-href)
- [Names](#names)
  - [Discernible link name](#discernible-link-name)
  - [Accessible button names](#accessible-button-names)
- [Alt Texts for images](#alt-texts-for-images)
- [Heading structure](#heading-structure)
- [Post check](#post-check)
- [ARIA States](#aria-states)
  - [Button pressed state](#button-pressed-state)
- [ARIA Labels](#aria-labels)
- [Bonus: What makes a nav a nav?](#bonus-what-makes-a-nav-a-nav)
- [Bonus: Sidebar expanded state](#bonus-sidebar-expanded-state)
<!-- TOC -->

For a variety of reasons (a11y, SEO, AI, ...) it's strongly recommended to use **semantic HTML 5 tags** in your Angular app. Furthermore, your Angular HTML view templates should create [valid HTML](https://validator.w3.org/) - however, we won't focus on that in this workshop.

**Lab time:** 40–50 minutes

## Pre check

Before you start, navigate to the front page (/home) and check for issues with a tool like Lighthouse!

**Important note:** Tools won't find all the issues!

## Semantic HTML

With over 100 HTML elements, and the ability to create custom elements, there are infinite ways to mark up your content; but some ways—notably semantically—are better than others.

Semantic means "relating to meaning". Writing semantic HTML means using HTML elements to structure your content based on each element's meaning, not its appearance.

Add this HTML tags to your app, replacing some `<div>` tags:

- `<aside>`
- `<header>`
- `<main>`
- `<footer>`
- `<nav>`

Maybe you also find a place to use the `time` tag.

- `<time>`

## Links `<a>` vs `<button>`

Take a look at the home links on top of the sidebar.

What do you think is the correct tag to add a link to home? Replace the wrong tag(s) with the proper one(s).

### Links with `(click)` vs `href`

Can you see the link when you hover it? If no, replace the `(click)` handler with an `href` attribute.

## Names

### Discernible link name

Can you find the link without a name / `alt` text? Add a description as an `alt` attribute.

### Accessible button names

Can you find the button without a name? Add an ARIA description label to the button:

```html
<button [...] aria-label="toggle sidebar" (click)="sidebarToggle()"></button>
```

## Alt Texts for images

Look for other images without `alt` attribute on the front page (/home). Add the missing attributes.

## Heading structure

Your **headings** should also have a correct struture:

- H1
  - H2
    - H3

Can you find the heading element that is not in a sequentially-descending order?

Fix it preserving the current styling of the updated heading.

## Post check

Now check again for issues with your tool of choice! You should find fewer issues.

## ARIA States

ARIA widget attributes help assistive technology presenting the content to your users.

### Button pressed state

Add a pressed state to the sidebar toggle in your `navbar`:

```html
<button [...] aria-label="toggle sidebar" [attr.aria-pressed]="sidebarVisible" [...]></button>
```

## ARIA Labels

We currently have two `<nav>` elements in our base layout:

1. The sidebar (incl. main nav)
2. The navbar (incl. sidebar toggle on small screens)

We need different `aria-label` values for better accessibility because it helps screen readers and other assistive technologies to clearly distinguish the two navs.

So let's add the `aria-label` attribute to both navs:

```html
<nav aria-label="sidebar including main navigation" class="sidebar-wrapper"></nav>
```

```html
<nav aria-label="header including sidebar toggle" class="navbar"></nav>
```

### Bonus: What makes a nav a nav?

The `nav` element is used to define a set of navigation links. It is typically used for the main navigation of a website or application.

- Is our sidebar a navigation element?
- Is our navbar a navigation element?

Reflect on those questions and decide if you want to keep the `nav` element for both.

### Bonus: Sidebar expanded state

Now look for the sidebar itself. It can be either expanded or collapsed.

Try setting to [aria-expanded](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded) of the sidebar to `true` and `false`.

Now check again once more for issues with your tool of choice.
