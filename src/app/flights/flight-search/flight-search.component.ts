import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observer } from 'rxjs';

import { pattern } from '../../shared/global';

import { Flight } from '../../entities/flight';
import { FlightService } from '../flight.service';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FlightStatusToggleComponent } from '../flight-status-toggle/flight-status-toggle.component';
import { FlightValidationErrorsComponent } from '../flight-validation-errors/flight-validation-errors.component';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [FormsModule, FlightCardComponent, FlightStatusToggleComponent, FlightValidationErrorsComponent],
  templateUrl: './flight-search.component.html',
  styleUrl: './flight-search.component.scss',
})
export class FlightSearchComponent {
  from = '';
  to = '';
  hasSearched = false;

  minLength = 3;
  maxLength = 15;
  pattern = pattern;
  private readonly TEN_MINUTES = 10 * 1000 * 60;

  flights: Flight[] = []; // old school

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  private readonly destroyRef = inject(DestroyRef);
  private readonly flightService = inject(FlightService);
  private readonly router = inject(Router);

  constructor() {
    if (this.from && this.to) {
      this.onSearch(); // auto search if default test values are set
    }

    // add focus management here
  }

  onSearch(): void {
    // 1. my observable
    const flights$ = this.flightService.find(this.from, this.to);

    // 2. my observer
    const flightsObserver: Observer<Flight[]> = {
      next: (flights) => {
        this.flights = flights;
        this.hasSearched = true;
        if (flights.length > 0) {
          console.log('Found ' + flights.length + ' flights');
        } else {
          console.log('No flights found');
        }
      },
      error: (errResp) => {
        this.hasSearched = true;
        console.error('Error loading flights', errResp);
      },
      complete: () => {
        // console.log('flight$ completed');
      },
    };

    // 3. my subscription
    flights$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(flightsObserver);
  }

  onDelayFirstFlight(): void {
    // old school
    if (this.flights.length > 0) {
      const flightDate = new Date(this.flights[0].date);
      flightDate.setTime(flightDate.getTime() + this.TEN_MINUTES);

      // Mutable
      this.flights[0].date = flightDate.toISOString();

      // Immutable
      // ?
    }
  }

  onEdit(id: number): void {
    this.router.navigate(['/flights/flight-edit', id, { showDetails: true }]);
  }
}
