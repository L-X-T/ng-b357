# 25 Forms & Live Announcer

<!-- TOC -->

- [Associate label with form elements](#associate-label-with-form-elements)
- [Add type attribute to inputs & buttons](#add-type-attribute-to-inputs--buttons)
- [Add missing required attribute](#add-missing-required-attribute)
- [Hide errors initially & enable submit button to show them](#hide-errors-initially--enable-submit-button-to-show-them)
- [Add aria-invalid and aria-describedby](#add-aria-invalid-and-aria-describedby)
- [Allow form submit](#allow-form-submit)
- [Allow form reset](#allow-form-reset)
- [Add LiveAnnouncer](#add-liveannouncer)
- [Bonus: Screen Reader](#bonus-screen-reader)
- [Bonus: Your own Angular forms](#bonus-your-own-angular-forms)
<!-- TOC -->

In this lab, you will learn how to improve the accessibility of your Angular forms.

**Lab time:** 40–50 minutes

## Associate label with form elements

Make sure all form elements labels are associated correctly. This is important for screen readers and keyboard navigation.

1. Open the `flight-search.component.html` HTML-template and add a `for` attribute to the `label` elements.
2. Add the `id` attribute to the corresponding `input` elements and make sure is unique.
3. Make sure the `for` attribute matches the `id` attribute by clicking on the label. If implemented correctly the associated input should be focused automatically.

```html
<label for="from">From</label> <input name="from" id="from" [...] />
```

Note: the `id` will often be the same as the `name` attribute. However, If you have multiple forms on the same page, you have to use unique `id` attributes.

## Add type attribute to inputs & buttons

Make sure all to add correct types to all `input` and `button` elements.

```html
<label for="from">From</label> <input type="text" name="from" id="from" [...] />
```

Note: the `<button type="submit">` will be activated when hitting enter in a form.

## Add missing required attribute

When the HTML elements `<input>`, `<select>`, or `<textarea>` must have a value, they should have the `required` attribute applied to it.

The HTML `required` attribute disables submitting the form unless the required form controls have valid values, while ensuring those navigating with the aid of assistive technologies understand which semantic form controls need valid content.

Add the `required` attribute to both `input` fields since they are required. Also, add the `*` as an **additional** required indicator.

```html
<label for="from">From (*)</label> <input type="text" name="from" id="from" required [...] />
```

## Hide errors initially & enable submit button to show them

We don't want to show the errors immediately when displaying the form!

A better approach is to show them after user interaction with the form.

1. Add the `dirty` (or the `touched` if you prefer) state as a requirement to show the errors.

```html
@if (flightSearchForm.controls['from'] && flightSearchForm.controls['from'].dirty) {
<app-flight-validation-errors [errors]="flightSearchForm.controls['from'].errors" fieldLabel="From" />
}
```

Now, if you don't know the form, you might think it's ready to submit.

Allowing click on submit to show the error messages is a good idea.

2. Remove the `disabled` attribute of button if form is `invalid` (it's okay for the pending state).

```html
<button type="submit" class="btn btn-default" [disabled]="flightSearchForm.pending" (click)="onSearch()"></button>
```

3. Add a required `viewChild` query signal for the form to your `FlightSearchComponent`.

```typescript
private readonly flightSearchForm = viewChild.required<NgForm>('flightSearchForm');
```

4. Finally, add some logic in the beginning of the `onSearch()` method to prevent submitting an invalid form and instead showing the error messages.

    <details>
    <summary>Show Code for onSearch</summary>
    <p>

   ```typescript
   if (this.flightSearchForm().invalid) {
     this.flightSearchForm().form.markAllAsTouched();
     return;
   }
   ```

    </p>
    </details>

## Add aria-invalid and aria-describedby

In case of an error on your `input`, add the `aria-invalid=true` attribute and the `aria-describedby` attribute with the `id` of the error message(s).

```html
<input type="text" name="from" id="from" required aria-invalid="true" aria-describedby="from_error" [...] />
```

## Allow form submit

It's always a good idea for A11y and UX to allow easily submitting the form with the `enter` button.

You can quickly achieve this by adding the `type="submit"` attribute to the submit button.

## Allow form reset

Add another button with `type="reset"` to easily reset the form.

Note that no extra code was needed to clear the form.

## Add LiveAnnouncer

Your visually impaired users might not immediately see the search results.

So it's a good idea to make use of the Angular CDK's [LiveAnnouncer](https://material.angular.io/cdk/a11y/overview#liveannouncer).

1. Inject the `LiveAnnouncer` into your `flight-search.component.html`.

   <details>
   <summary>Show Code</summary>
   <p>

   ```typescript
   private readonly liveAnnouncer = inject(LiveAnnouncer);
   ```

   </p>
   </details>

   Make sure the import has been added.

2. Announce the result of in your `next` of the observer in the `onSearch()` method.

   <details>
   <summary>Show Code</summary>
   <p>

   ```typescript
   if (flights.length > 0) {
     this.liveAnnouncer.announce('Found ' + flights.length + ' flights');
     console.log('Found ' + flights.length + ' flights');
   } else {
     this.liveAnnouncer.announce('No flights found');
     console.log('No flights found');
   }
   ```

   </p>
   </details>

3. Also implement the announcement for the `error` case.

For more information on the Angular CDK `A11y` package visit: https://material.angular.io/cdk/a11y/overview.

## Bonus: Screen Reader

Test the `LiveAnnouncer` implementation of the previous lab with your **screen reader** of choice.

My recommendations:

- [**NVDA**](https://nvda.bhvd.de) (Windows, free download)
- [**Voice Over**](https://en.wikipedia.org/wiki/VoiceOver) (Mac/iOS, built-in)
- [**Orca**](https://www.a11yproject.com/posts/getting-started-with-orca/) (Linux, free)
- [**Talkback**](https://support.google.com/accessibility/android/answer/6283677?hl=en&sjid=14818511639127973246-EU) (Android, built-in)

## Bonus: Your own Angular forms

1. Now switch to your own forms and check for the above issues.
2. If possible, prepare to share your findings with the group.
