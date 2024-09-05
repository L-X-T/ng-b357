import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { filter, Observer } from 'rxjs';

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

  @ViewChild('flightSearchForm') private readonly flightSearchForm?: NgForm;

  private readonly destroyRef = inject(DestroyRef);
  private readonly doc = inject(DOCUMENT);
  private readonly flightService = inject(FlightService);
  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly router = inject(Router);

  constructor() {
    if (this.from && this.to) {
      this.onSearch(); // auto search if default test values are set
    }

    // add focus management here
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      const input = this.doc.querySelector('input');
      if (input) {
        input.focus();
      }
    });
  }

  onSearch(): void {
    if (this.flightSearchForm?.invalid) {
      this.markFormGroupDirty(this.flightSearchForm);
      return;
    }

    // 1. my observable
    const flights$ = this.flightService.find(this.from, this.to);

    // 2. my observer
    const flightsObserver: Observer<Flight[]> = {
      next: (flights) => {
        this.flights = flights;
        this.hasSearched = true;
        if (flights.length > 0) {
          this.liveAnnouncer.announce('Found ' + flights.length + ' flights');
          console.log('Found ' + flights.length + ' flights');
        } else {
          this.liveAnnouncer.announce('No flights found');
          console.log('No flights found');
        }
      },
      error: (errResp) => {
        this.hasSearched = true;
        this.liveAnnouncer.announce('Flights could not be loaded');
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

      this.liveAnnouncer.announce('First flight delayed by 10 minutes');
    }
  }

  onEdit(id: number): void {
    this.router.navigate(['/flights/flight-edit', id, { showDetails: true }]);
  }

  private markFormGroupDirty(formGroup: NgForm): void {
    Object.values(formGroup.controls).forEach((control) => control.markAsDirty());
  }
}
