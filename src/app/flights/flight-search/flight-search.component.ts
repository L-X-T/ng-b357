import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  ɵgetComponentDef as getComponentDef,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { Combobox, ComboboxInput, ComboboxPopup, ComboboxPopupContainer } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';

import { BehaviorSubject, filter, Observer } from 'rxjs';

import { BlinkService } from '../../shared/blink.service';
import { pattern } from '../../shared/global';

import { Flight } from '../../entities/flight';
import { FlightService } from '../flight.service';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FlightStatusToggleComponent } from '../flight-status-toggle/flight-status-toggle.component';
import { FlightValidationErrorsComponent } from '../flight-validation-errors/flight-validation-errors.component';

@Component({
  selector: 'app-flight-search',
  imports: [
    CommonModule,
    FormsModule,
    FlightCardComponent,
    FlightStatusToggleComponent,
    FlightValidationErrorsComponent,
    RouterLink,
    Combobox,
    ComboboxInput,
    ComboboxPopup,
    ComboboxPopupContainer,
    Listbox,
    Option,
    OverlayModule,
  ],
  templateUrl: './flight-search.component.html',
  styleUrl: './flight-search.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightSearchComponent {
  protected from = '';
  protected to = '';
  protected hasSearched = false;

  protected minLength = 3;
  protected maxLength = 15;
  protected pattern = pattern;
  private readonly TEN_MINUTES = 10 * 1000 * 60;

  protected oldSchoolFlights: Flight[] = []; // old school
  protected readonly flightsSubject = new BehaviorSubject<Flight[]>([]); // RxJS
  protected readonly flights = signal<Flight[]>([]); // Signal

  protected readonly flightsLength = computed(() => this.flights().length); // to demo computed

  protected basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  protected trips = [
    { value: 'fast', label: 'Fast trip' },
    { value: 'slow', label: 'Slow trip' },
    { value: 'round', label: 'Round trip' },
  ];
  protected trip = signal<string>('');
  /*protected displayTrip = computed(() => {
    const values = this.listbox()?.values() || [];
    return values.length ? this.trips.find((aTrip) => aTrip.value === values[0])?.label : 'Select a trip';
  });*/
  protected displayTrip = computed(() => {
    const trip = this.trip();
    return trip ? this.trips.find((aTrip) => aTrip.value === trip)?.label : 'Select a trip';
  });

  /** The combobox listbox popup. */
  listbox = viewChild<Listbox<string>>(Listbox);
  /** The options available in the listbox. */
  options = viewChildren<Option<string>>(Option);
  /** A reference to the ng aria combobox. */
  combobox = viewChild<Combobox<string>>(Combobox);

  private readonly flightSearchForm = viewChild.required<NgForm>('flightSearchForm');

  private readonly blinkService = inject(BlinkService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly doc = inject(DOCUMENT);
  private readonly elementRef = inject(ElementRef);
  private readonly flightService = inject(FlightService);
  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly router = inject(Router);

  constructor() {
    console.log(getComponentDef(FlightSearchComponent)?.id);

    effect(() => console.log('update: ', this.flights())); // to demo effect

    if (this.from && this.to) {
      this.onSearch(); // auto search if default test values are set
    }

    // add focus management here
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      const input = this.doc.querySelector('app-flight-search input') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    });
  }

  protected onSearch(): void {
    if (this.flightSearchForm()?.invalid) {
      this.flightSearchForm().form.markAllAsDirty();
      return;
    }

    // 1. my observable
    const flights$ = this.flightService.find(this.from, this.to);

    // 2. my observer
    const flightsObserver: Observer<Flight[]> = {
      next: (flights) => {
        this.setFlights(flights);
        this.hasSearched = true;
        if (flights.length > 0) {
          this.announceAndLog('Found ' + flights.length + ' flights');
        } else {
          this.announceAndLog('No flights found');
        }
      },
      error: (errResp) => {
        this.hasSearched = true;
        this.announceAndLog('Flights could not be loaded');
      },
      complete: () => {
        // console.log('flight$ completed');
      },
    };

    // 3. my subscription
    flights$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(flightsObserver);
  }

  private setFlights(flights: Flight[]): void {
    this.oldSchoolFlights = flights;
    this.flightsSubject.next(flights);
    this.flights.set(flights);
  }

  private announceAndLog(message: string): void {
    this.liveAnnouncer.announce(message);
    console.log(message);
  }

  protected onReset(): void {
    this.setFlights([]);
    this.hasSearched = false;
  }

  protected onDelayFirstFlight(): void {
    // old school
    if (this.oldSchoolFlights.length > 0) {
      const flightDate = new Date(this.oldSchoolFlights[0].date);
      flightDate.setTime(flightDate.getTime() + this.TEN_MINUTES);

      // Mutable
      this.oldSchoolFlights[0].date = flightDate.toISOString();

      // Immutable
      // ?

      this.liveAnnouncer.announce('First flight delayed by 10 minutes');
    }

    // RxJS
    if (this.flightsSubject.value.length > 0) {
      const flights = this.flightsSubject.value;
      const flightDate = new Date(flights[0].date);
      flightDate.setTime(flightDate.getTime() + this.TEN_MINUTES);

      // Mutable
      flights[0].date = flightDate.toISOString();

      // Immutable
      // flights[0] = { ...flights[0], date: flightDate.toISOString() };

      this.flightsSubject.next(flights);
    }

    // Signal
    if (this.flights().length > 0) {
      // Update
      this.flights.update((flights) => {
        const flightDate = new Date(flights[0].date);
        flightDate.setTime(flightDate.getTime() + this.TEN_MINUTES);

        // Mutable
        flights[0].date = flightDate.toISOString();

        // Immutable
        // flights[0] = { ...flights[0], date: flightDate.toISOString() };

        return flights;
      });
    }
  }

  protected blinkFirstChild(): void {
    this.blinkService.blinkElementsFirstChild(this.elementRef);
  }
}
