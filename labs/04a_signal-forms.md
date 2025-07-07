# 04a Signals Forms

[[TOC]]

For this lab, we need Angular v21, so we check out another branch, in the `flight-app`:

```
git add *
git stash
git checkout lab500-enterprise-starter
```

## Set up the Signal Form

In this first part of the lab, you add the **signal form** to your `flight-search` component.

1. Open the file `flight-search.component.ts` `(/libs/tickets/feature-booking/src/lib/flight-search/flight-search.component.ts)` and add a type for the flight search criteria on top of the `@Component` decorator (for the sake of simplicity we don't put the type in it's own file):

   ```typescript
   export type FlightSearchCriteria = {
     from: string;
     to: string;
   }

   @Component({
     // ...
   })
   ```

2. Now, we can add a **signal** to the component class holding the current empty search criteria:

   ```typescript
   protected readonly searchCriteria = signal<FlightSearchCriteria>({
     from: '',
     to: '',
   });
   ```

   Note: Don't forget to add the import for `signal` from `'@angular/core'`.

3. Next, let's add the signal form below that signal:

   ```typescript
   protected readonly searchForm = form(this.searchCriteria);
   ```

   Note: `form` is available starting in Angular v21 and needs to be imported from `'@angular/forms/signals'`.

   ```typescript
   // ...
   import { form } from '@angular/forms/signals';
   // ...
   ```

4. Next, we can connect the created signal form with the two input fields in the component's view template.

   To do so, we need to remove the `ngModel` two-way binding and instead use the new `[control]` property binding:

   ```html
   <div class="form-group">
     <label for="from">From:</label>
     <input [control]="searchForm.from" id="from" name="from" class="form-control" />
   </div>
   <div class="form-group">
     <label for="to">To:</label>
     <input [control]="searchForm.to" id="to" name="to" class="form-control" />
   </div>
   ```

   Note: Make sure to import `Control` in your component:

   ```typescript
   // ...
   import { form, Control } from '@angular/forms/signals';
   // ...

   @Component({
     // ...
     imports: [CommonModule, Control, FormsModule, FlightCardComponent],
   })
   ```

5. Finally, we need to fetch to values from the input fields in our (already existing) `search` function:

   ```typescript
   this.from = this.searchForm().value().from;
   this.to = this.searchForm().value().to;
   console.debug(`Searching flights from ${this.from} to ${this.to} ...`);
   ```

## Add built in validators

In the second lab, we add some built-in validators to our signal form.

1. Open the file `flight-search.component.ts` `(/libs/tickets/feature-booking/src/lib/flight-search/flight-search.component.ts)`.

2. Update the `searchForm` definition to include some built-in validators for the `from` and `to` fields:

   ```typescript
   protected readonly searchForm = form(
     this.searchCriteria,
       (searchCriteria) => {
       required(searchCriteria.from);
       minLength(searchCriteria.from, 3);
       required(searchCriteria.to);
       minLength(searchCriteria.to, 3);
     }
   );
   ```

3. To see your errors, update the component's view template to display validation errors for the `from` field:

   ```html
   <!-- Field level errors -->
   @if (searchForm.from().touched() && searchForm.from().invalid()) {
   <pre>{{ searchForm.from().errors() | json }}</pre>
   }
   ```

4. Repeat the above step for the `to` field:

## Add a custom validator

1. Open the file `flight-search.component.ts` `(/libs/tickets/feature-booking/src/lib/flight-search/flight-search.component.ts)`.

2. Update the `searchForm` validators to include a custom validator for the `from` and `to` fields that only allows searching from/to a predefined list of cities:

   ```typescript
   protected readonly searchForm = form(
     this.searchCriteria,
     (searchCriteria) => {
       // ...
       required(searchCriteria.to);
       minLength(searchCriteria.to, 3);

       const allowedCities = [
         'Berlin',
         'Graz',
         'Hamburg',
         'London',
         'München',
         'Paris',
         'Wien',
         'Zürich',
       ];

       validate(searchCriteria.from, (field) => {
         if (allowedCities.includes(field.value())) {
           return null;
         }

         return customError({
           kind: 'city',
           value: field.value(),
           allowedCities,
         });
       });
     }
   );
   ```

## Put custom validator in a separate file

1. Create a new file `city.validator.ts` `(/libs/tickets/feature-booking/src/lib/flight-search/validators/city.validator.ts)`.

2. Add the following code to the newly created file:

   ```typescript
   import { customError, FieldPath, validate } from '@angular/forms/signals';

   const allowedCities = ['Berlin', 'Graz', 'Hamburg', 'London', 'München', 'Paris', 'Wien', 'Zürich'];

   export function validateCity(path: FieldPath<string>): void {
     validate(path, (ctx) => {
       if (allowedCities.includes(ctx.value())) {
         return null;
       }

       return customError({
         kind: 'city',
         value: ctx.value(),
         allowedCities,
       });
     });
   }
   ```

3. Open the file `flight-search.component.ts` `(/libs/tickets/feature-booking/src/lib/flight-search/flight-search.component.ts)`.
4. Update the `searchForm` validators to include our custom validator for the `from` and `to` fields:

   ```typescript
   protected readonly searchForm = form(
     this.searchCriteria,
       (searchCriteria) => {
       required(searchCriteria.from);
       minLength(searchCriteria.from, 3);
       required(searchCriteria.to);
       minLength(searchCriteria.to, 3);
       validateCity(searchCriteria.from);
       validateCity(searchCriteria.to);
     }
   );
   ```

## Add a submit function

1. Open the file `flight-search.component.ts` `(/libs/tickets/feature-booking/src/lib/flight-search/flight-search.component.ts)`.
2. Update the existing search function to use the `submit` helper from Angular Signal Forms instead of the `this.flightService.find()` call directly:

   ```typescript
   /*this.flightService.find(this.from, this.to).subscribe({
      next: (flights) => {
        this.flights = flights;
      },
      error: (errResp) => {
        console.error('Error loading flights', errResp);
      },
   });*/

   submit(this.searchForm, async (form) => {
     try {
       this.flights = await firstValueFrom(
         this.flightService.find(form().value().from, form().value().to).pipe(delay(1_000)), // simulate network delay
       );
       console.debug('Flights loaded', this.flights);
     } catch (error) {
       console.error('Error searching flights', error);
       return {
         kind: 'processing_error',
         error: error,
       };
     }

     return null;
   });
   ```

3. Now, update the search button in the component's view template to reflect the submitting state:

   ```html
   <button
     class="btn btn-default"
     type="submit"
     [ariaBusy]="searchForm().submitting()"
     [disabled]="searchForm().submitting()"
     (click)="search()">
     @if (searchForm().submitting()) { Searching ... } @else { Search }
   </button>
   ```

4. Finally, add some CSS to visually indicate the disabled state of the button. You can add this to the component's CSS file `(/libs/tickets/feature-booking/src/lib/flight-search/flight-search.component.css)`:

   ```css
   button[disabled] {
     cursor: not-allowed;
     opacity: 0.5;
   }
   ```

## Bonus: Create a signal form schema for reusing validators

1. Extract the `FlightSearchCriteria` type to a separate file `flight-search-criteria.type.ts` `(/libs/tickets/feature-booking/src/lib/flight-search/flight-search-criteria.type.ts)`.

   ```typescript
   export type FlightSearchCriteria = {
     from: string;
     to: string;
   };
   ```

2. Create a new file `flight-schema.ts` `(/libs/tickets/feature-booking/src/lib/flight-search/flight-schema.ts)`.

   ```typescript
   export const flightSchema = schema<string>((city) => {
     required(city);
     minLength(city, 3);
     validateCity(city);
   });
   ```

   Make sure to import `validateCity` from the previously created validator file.

3. Also, create a new file `flight-search-schema.ts` `(/libs/tickets/feature-booking/src/lib/flight-search/flight-search-schema.ts)` and add the `flightSearchSchema`.

   ```typescript
   export const flightSearchSchema = schema<FlightSearchCriteria>((path) => {
     apply(path.from, flightSchema);
     apply(path.to, flightSchema);
   });
   ```

   Make sure to import `flightSchema` from the just created file.

4. Finally, open the file `flight-search.component.ts` `(/libs/tickets/feature-booking/src/lib/flight-search/flight-search.component.ts)` and update the `searchForm` schema to use the just created `flightSearchSchema`:

   ```typescript
   protected readonly searchForm = form(this.searchCriteria, flightSearchSchema);
   ```
