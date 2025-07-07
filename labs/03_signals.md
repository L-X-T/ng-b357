# 03 Signals

[[TOC]]

For this lab, we need Angular v21, so we check out another repository and the branch `lab503-signals-starter`:

```bash
git clone https://github.com/angular-architects/flight-app --branch lab503-signals-starter
cd flight-app
npm i
```

## Converting to Signals

1. Open the file `flight-search.component.ts` (`apps/flights/src/app/domains/ticketing/feature-booking/flight-search/flight-search.component.ts`) and convert all properties to Signals:

   <details>
   <summary>Show Code</summary>

   ```diff
   -import { Component, ElementRef, NgZone, inject } from '@angular/core';
   +import { Component, ElementRef, NgZone, inject, signal } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { FormsModule } from '@angular/forms';
    import { FlightCardComponent } from '../flight-card/flight-card.component';

   [...]

      private flightService = inject(FlightService);

   -  from = 'Paris';
   -  to = 'London';
   -  flights: Array<Flight> = [];
   +  from = signal('Paris');
   +  to = signal('London');
   +  flights = signal<Flight[]>([]);

   -  basket: Record<number, boolean> = {
   +  basket = signal<Record<number, boolean>>({
        3: true,
        5: true,
   -  };
   +  });

      search(): void {
   -    this.flightService.find(this.from, this.to).subscribe({
   +    this.flightService.find(this.from(), this.to()).subscribe({
          next: (flights) => {
   -        this.flights = flights;
   +        this.flights.set(flights);
          },
          error: (errResp) => {
            console.error('Error loading flights', errResp);

   [...]

      }

      delay(): void {
   -    this.flights = this.toFlightsWithDelays(this.flights, 15);
   +    this.flights.update((flights) => this.toFlightsWithDelays(flights, 15));
      }

      toFlightsWithDelays(flights: Flight[], delay: number): Flight[] {

   [...]

        return [newFlight, ...flights.slice(1)];
      }

   +  updateBasket(flightId: number, selected: boolean): void {
   +    this.basket.update((basket) => ({
   +      ...basket,
   +      [flightId]: selected,
   +    }));
   +  }
   +
      blink() {
        // Dirty Hack used to visualize the change detector
        this.element.nativeElement.firstChild.style.backgroundColor = 'crimson';
   ```

   </details><br>

2. Switch to the file `flight-search.component.html` (`apps/flights/src/app/domains/ticketing/feature-booking/flight-search/flight-search.component.html`) and adjust the bindings so that the Signals' getters are called:

   <details>
   <summary>Show Code</summary>

   ```diff
    </form>

    <div class="row">
   -  @for (f of flights; track f.id) {
   +  @for (f of flights(); track f.id) {
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
   -    <app-flight-card [item]="f" [(selected)]="basket[f.id]">
   -      <p class="middle"><i>Delays are possible!</i></p>
   -      <p class="bottom"><small>Statement without guarantee!</small></p>
   +    <app-flight-card
   +      [item]="f"
   +      [selected]="basket()[f.id]"
   +      (selectedChange)="updateBasket(f.id, $event)"
   +    >
        </app-flight-card>
      </div>
      }

   [...]

    <p>&nbsp;</p>

    <div>
   -  <pre>{{ basket | json }}</pre>
   +  <pre>{{ basket() | json }}</pre>
    </div>
   ```

   </details><br>

   **Remarks:** You must not to call the getters for two-way bindings

3. Try out your changes.

## Visualize Change Detection

1. Open the file `flight-card.component.html` (`apps/flights/src/app/domains/ticketing/feature-booking/flight-card/flight-card.component.html`) and data bind the `blink` method to visualize the change detection:

   <details>
   <summary>Show Code</summary>

   ```diff
        <ng-content select=".bottom"></ng-content>
      </div>
    </div>
   +
   +{{ blink() }}
   ```

   </details><br>

2. Try out your solution. You should see that after each keystroke and after clicking delay, all the flight cards are checked for changes.

3. Open the file `flight-card.component.ts` (`apps/flights/src/app/domains/ticketing/feature-booking/flight-card/flight-card.component.ts`) and activate `OnPush`:

   <details>
   <summary>Show Code</summary>

   ```diff
    import {
   +  ChangeDetectionStrategy,
      Component,
      ElementRef,
      EventEmitter,

   [...]

      imports: [CommonModule, CityPipe, StatusToggleComponent, RouterLink],
      templateUrl: './flight-card.component.html',
      styleUrls: ['./flight-card.component.css'],
   +  changeDetection: ChangeDetectionStrategy.OnPush,
    })
    export class FlightCardComponent {
      private element = inject(ElementRef);
   ```

   </details><br>

4. Also in `flight-search.component.ts`, activate `OnPush`:

   <details>
   <summary>Show Code</summary>

   ```diff
   -import { Component, ElementRef, NgZone, inject, signal } from '@angular/core';
   +import {
   +  ChangeDetectionStrategy,
   +  Component,
   +  ElementRef,
   +  NgZone,
   +  inject,
   +  signal,
   +} from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { FormsModule } from '@angular/forms';
    import { FlightCardComponent } from '../flight-card/flight-card.component';

   [...]

      templateUrl: './flight-search.component.html',
      styleUrls: ['./flight-search.component.css'],
      imports: [CommonModule, FormsModule, CityPipe, FlightCardComponent],
   +  changeDetection: ChangeDetectionStrategy.OnPush,
    })
    export class FlightSearchComponent {
      private element = inject(ElementRef);
   ```

   </details><br>

5. Try out your changes.

## Adding Computed Signals and Effects

Now, let's add ...

- a computed Signal `route` concatenating `from` and `to`.
- an effect displaying this route whenever it's changed.
- a further effect displaying a toast (Angular Material Snackbar) with a warning when `from` and `to` have the same values.

1. Open the file `main.ts` (`apps/flights/src/main.ts`) and the providers needed for animations:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { provideHttpClient } from '@angular/common/http';
    import { importProvidersFrom } from '@angular/core';
    import { MatDialogModule } from '@angular/material/dialog';
    import { bootstrapApplication } from '@angular/platform-browser';
   +import { provideAnimations } from '@angular/platform-browser/animations';
    import { provideRouter } from '@angular/router';
    import { AppComponent } from './app/app.component';
    import { APP_ROUTES } from './app/app.routes';

   [...]

        provideRouter(APP_ROUTES),
        importProvidersFrom(NextFlightsModule),
        importProvidersFrom(MatDialogModule),
   -
   +    provideAnimations(),
        provideLogger(
          {
            level: LogLevel.DEBUG,
   ```

   </details><br>

   **Hint:** You can use `provideAnimations()` from `@angular/platform-browser/animations`.
   **Remarks:** The Angular Material Snackbar needs these providers.

2. Open the file `flight-search.component.ts` (`apps/flights/src/app/domains/ticketing/feature-booking/flight-search/flight-search.component.ts`) and add the above-mentioned computed Signal and effects:

   <details>
   <summary>Show Code</summary>

   ```diff
    import {
      Component,
      ElementRef,
      NgZone,
   +  computed,
   +  effect,
      inject,
      signal,
    } from '@angular/core';

   [...]

    import { CityPipe } from '@demo/shared/ui-common';
    import { Flight, FlightService } from '@demo/ticketing/data';
    import { addMinutes } from 'date-fns';
   +import { MatSnackBar } from '@angular/material/snack-bar';

    @Component({
      selector: 'app-flight-search',

   [...]

      private zone = inject(NgZone);

      private flightService = inject(FlightService);
   +  private snackBar = inject(MatSnackBar);

      from = signal('Paris');
      to = signal('London');
      flights = signal<Flight[]>([]);

   +  route = computed(() => this.from() + ' to ' + this.to());
   +
      basket = signal<Record<number, boolean>>({
        3: true,
        5: true,
      });

   +  constructor() {
   +    effect(() => {
   +      console.log('route', this.route());
   +    });
   +
   +    effect(() => {
   +      if (this.from() === this.to()) {
   +        this.snackBar.open('Round Trips are not supported', 'Ok', {
   +          duration: 3000,
   +        });
   +      }
   +    });
   +  }
   +
      search(): void {
        this.flightService.find(this.from(), this.to()).subscribe({
          next: (flights) => {
   ```

   </details><br>

3. Switch to the file `flight-search.component.html` (`apps/flights/src/app/domains/ticketing/feature-booking/flight-search/flight-search.component.html`) and display the route Signal:

   <details>
   <summary>Show Code</summary>

   ```diff
    </div>
    </form>

   +<p>
   +  <i>Route: {{ route() }}</i>
   +</p>
   +
    <div class="row">
      @for (f of flights(); track f.id) {
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
   ```

   </details><br>

4. Try out your changes.

## Deriving State with Computed

Now, let's introduce a Signal `delayTime` with the current delay. Instead of updating the `flights`, the `delay` method should just update this `delayTime` Signal. After this, you can introduce a computed Signal `flightsWithDelays` that combines the `flights` with `delayTime`.

1. Now, in the same file, implement the above-mentioned changes:

   <details>
   <summary>Show Code</summary>

   ```diff
    export class FlightSearchComponent {
      from = signal('Paris');
      to = signal('London');

      flights = signal<Flight[]>([]);

   +  delayTime = signal(0);

   +  flightsWithDelays = computed(() =>
   +    this.toFlightsWithDelays(this.flights(), this.delayTime())
   +  );

      route = computed(() => this.from() + ' to ' + this.to());

   [...]

      }

      delay(): void {
   -    this.flights.update((flights) => this.toFlightsWithDelays(flights, 15));
   +    this.delayTime.update((delayTime) => delayTime + 15);
      }

      toFlightsWithDelays(flights: Flight[], delay: number): Flight[] {
   ```

   </details><br>

2. Switch to the file `flight-search.component.html` (`apps/flights/src/app/domains/ticketing/feature-booking/flight-search/flight-search.component.html`) and bind `flightsWithDelays` instead of `flights`:

   <details>
   <summary>Show Code</summary>

   ```diff
    </p>

    <div class="row">
   -  @for (f of flights(); track f.id) {
   +  @for (f of flightsWithDelays(); track f.id) {
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <app-flight-card
          [item]="f"
   ```

   </details><br>

3. Try out your changes.

## Using httpResource

Let's improve our solution by leveraging the `httpResource` found in `@angular/common/http`:

- Add a method `createResource` to your `FlightService` that is returning the `httpResource`.
- Use this method in your Flight `SearchComponent`.

   <details>
   <summary>Solution (FlightService)</summary>

  ```ts
  import { httpResource } from '@angular/common/http';

  [...]

  export type Criteria = {
     from: string;
     to: string;
  };

  @Injectable({
     providedIn: 'root',
  })
  export class FlightService {
     private http = inject(HttpClient);
     private configService = inject(ConfigService);

     createResource(criteria: Signal<Criteria>) {
       return httpResource<Flight[]>(
         () => ({
           url: `${this.configService.config.baseUrl}/flight`,
           headers: {
             Accept: 'application/json',
           },
           params: {
             from: criteria().from,
             to: criteria().to,
           },
         }),
         { defaultValue: [] }
       );
     }

     [...]
  }
  ```

   </details>

   <details>
   <summary>Solution (FlightSearchComponent)</summary>

  ```ts
   import {
     Component,
     ElementRef,
     NgZone,
     computed,
     inject,
     signal,
     effect,
   } from '@angular/core';
   import { CommonModule } from '@angular/common';
   import { FormsModule } from '@angular/forms';
   import { FlightCardComponent } from '../flight-card/flight-card.component';
   import { Flight, FlightService } from '@demo/ticketing/data';
   import { addMinutes } from 'date-fns';

   @Component({
     selector: 'app-flight-search',
     standalone: true,
     templateUrl: './flight-search.component.html',
     styleUrls: ['./flight-search.component.css'],
     imports: [CommonModule, FormsModule, FlightCardComponent],
   })
   export class FlightSearchComponent {
     [...]

     private flightService = inject(FlightService);

     from = signal('Paris');
     to = signal('London');

     flightRoute = computed(() => this.from() + ' to ' + this.to());

     // Compute Criteria
     criteria = computed(() => ({
       from: this.from(),
       to: this.to(),
     }));

     // Create Resource
     flightResource = this.flightService.createResource(this.criteria);

     // Get flights Signal from Resource
     flights = this.flightResource.value;

     // Get further Signals from Resource
     errors = this.flightResource.error;
     isLoading = this.flightResource.isLoading;

     delayInMinutes = signal(0);

     flightsWithDelay = computed(() =>
       this.toFlightsWithDelays(this.flights(), this.delayInMinutes())
     );

     basket = signal<Record<number, boolean>>({
       3: true,
       5: true,
     });

     selected = computed(() => this.flights().filter((f) => this.basket()[f.id]));

     [...]

     search(): void {
       this.flightResource.reload();
     }

     [...]
   }

  ```

   </details>

## Bonus: rxResource \*\*

Now, in your `FlightService`, switch out your resource by an `rxResource` found in the namespace `@angular/core/rxjs-interop`.

   <details>
   <summary>Solution (FlightService)</summary>

```ts

import { rxResource } from '@angular/core/rxjs-interop';

[...]

 @Injectable({
   providedIn: 'root',
 })
 export class FlightService {

   [...]

   createResource(criteria: Signal<Criteria>) {
     return rxResource({
       params: criteria,
       stream: (loaderParams) => {
         const c = loaderParams.params;
         return this.find(
           c.from,
           c.to
         );
       },
       defaultValue: [],
     });
   }

   [...]

}

```

   </details>

## Bonus: Debouncing with RxJS-Interop \*\*

Besides the `rxResource`, the `@angular/core/rxjs-interop` packages also contains two functions for converting between Signals and Observables: `toSignal` and `toObservable`.

Use them, to convert the criteria Signal to an Observable, debounce it by 300 msec, and to convert it back to a Signal.

If you want, you can extract this logic to a generic `debounceSignal` function:

```ts
export function debounceSignal<T>(source: Signal<T>, timeMsec: number): Signal<T> {
  // Your Code here ...
}
```

   <details>
   <summary>Solution (debounceSignal)</summary>

```ts
import { Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

export function debounceSignal<T>(source: Signal<T>, timeMsec: number): Signal<T> {
  const debounced$ = toObservable(source).pipe(debounceTime(timeMsec));
  return toSignal(debounced$, {
    initialValue: source(),
  });
}
```

   </details>

   <details>
   <summary>Solution (FlightSearchComponent)</summary>

```ts
 @Component([...])
 export class FlightSearchComponent {
   private element = inject(ElementRef);
   private zone = inject(NgZone);

   private flightService = inject(FlightService);

   from = signal('Paris');
   to = signal('London');
   flightRoute = computed(() => this.from() + ' to ' + this.to());

   criteria = computed(() => ({
     from: this.from(),
     to: this.to(),
   }));

   // Add debouncing:
   debouncedCriteria = debounceSignal(this.criteria, 300);

   // Use debounced Signal to create resource
   flightResource = this.flightService.createResource(this.debouncedCriteria);

   flights = this.flightResource.value;

   [...]
 }
```

   </details>

## Bonus: (Basis) Resource \*\*\*

Both the `httpResource` and the `rxResource` have a common foundation: The Promise-based (basis) Resource. As an application developer you will not often directly use it. From our perspective, it works like the `rxResource`, however, it is supposed to return a `Promise`. Also, as it only returns one value, its loader is simply called `loader` and not `stream`.

To give it a test drive, update your FlightService so that it creates such a resource with the function `resource` found in `@angular/core`.

   <details>
   <summary>Solution (FlightService)</summary>

```ts
import { resource } from '@angular/core';

[...]

 @Injectable({
   providedIn: 'root',
 })
 export class FlightService {

   [...]

   createResource(criteria: Signal<Criteria>) {
      return rxResource({
         params: criteria,
         stream: (loaderParams) => {
            const c = loaderParams.params;
            return this.find(c.from, c.to);
         },
         defaultValue: [],
      });
   }

   [...]

}
```

   </details>
