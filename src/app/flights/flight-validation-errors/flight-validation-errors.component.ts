import { Component, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-flight-validation-errors',
  templateUrl: './flight-validation-errors.component.html',
  styleUrl: './flight-validation-errors.component.scss',
})
export class FlightValidationErrorsComponent {
  readonly errors = input.required<ValidationErrors | null>();
  readonly fieldLabel = input('Field');
}
