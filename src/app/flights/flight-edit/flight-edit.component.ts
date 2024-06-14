import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  Input,
  OnChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { debounceTime, delay, distinctUntilChanged } from 'rxjs/operators';

import { pattern } from '../../shared/global';

import { FlightService } from '../flight.service';
import { Flight } from '../../entities/flight';

@Component({
  selector: 'app-flight-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './flight-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightEditComponent implements OnChanges {
  @Input() flight?: Flight;

  protected id = input<number>(0);
  protected showDetails = input<boolean>(false);

  protected message = '';
  protected pattern = pattern;
  protected editForm!: FormGroup;

  private readonly DEBOUNCE_MS = 250;
  private readonly DELAY_MS = 2_500;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly flightService = inject(FlightService);

  constructor() {
    effect(() => this.loadFlight(this.id()));

    this.setupEditForm();
    this.setupSubscriptions();
  }

  ngOnChanges(): void {
    this.patchFormValue();
  }

  onSave(): void {
    this.message = 'Is saving ...';

    const flightToSave: Flight = this.editForm.value;

    this.flightService
      .save(flightToSave)
      .pipe(delay(this.DELAY_MS), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (flight) => {
          // console.warn('FlightEditComponent - onSave()');
          // console.log(flight);
          this.flight = flight;
          this.patchFormValue();
          this.message = 'Success saving! Navigating ...';

          setTimeout(() => inject(Router).navigate(['/flights/flight-search']), this.DELAY_MS);
        },
        error: (errResponse) => {
          console.error(errResponse);
          this.message = 'Error saving!';
        },
      });
  }

  private setupEditForm(): void {
    this.editForm = inject(FormBuilder).group({
      id: [0, Validators.required],
      from: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(15),
            Validators.pattern(this.pattern),
          ],
          updateOn: 'blur',
        },
      ],
      to: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(15),
            Validators.pattern(this.pattern),
          ],
          updateOn: 'blur',
        },
      ],
      date: ['', [Validators.required, Validators.minLength(33), Validators.maxLength(33)], []],
    });
  }

  private setupSubscriptions(): void {
    this.editForm.valueChanges
      .pipe(
        debounceTime(this.DEBOUNCE_MS),
        distinctUntilChanged((a, b) => a.id === b.id && a.from === b.from && a.to === b.to && a.date === b.date),
        takeUntilDestroyed(),
      )
      .subscribe((value) => {
        console.log(value);
      });

    this.flightService
      .findById('' + this.id())
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (flight) => {
          this.flight = flight;
          this.patchFormValue();
          this.message = 'Success loading!';
        },
        error: (errResponse) => {
          if (this.showDetails()) {
            console.error(errResponse);
          }
          this.message = 'Error Loading!';
        },
      });
  }

  private patchFormValue(): void {
    if (this.editForm && this.flight) {
      this.editForm.patchValue(this.flight);
    }

    this.cdr.markForCheck();
  }

  private loadFlight(flightId: number) {
    if (flightId) {
      this.flightService
        .findById('' + flightId)
        .pipe(delay(this.DELAY_MS), takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (flight) => {
            console.warn('FlightEditComponent - loadFlight()');
            console.log(flight);
            this.flight = flight;
            this.patchFormValue();
            this.message = 'Success loading!';
          },
          error: (errResponse) => {
            if (this.showDetails()) {
              console.error(errResponse);
            }
            this.message = 'Error Loading!';
          },
        });
    }
  }
}
