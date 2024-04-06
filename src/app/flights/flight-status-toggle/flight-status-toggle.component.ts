import { Component, ElementRef, EventEmitter, inject, Input, Output } from '@angular/core';

import { BlinkService } from '../../shared/blink.service';

@Component({
  selector: 'app-flight-status-toggle',
  standalone: true,
  templateUrl: './flight-status-toggle.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightStatusToggleComponent {
  @Input({ required: true }) status = false;
  @Output() readonly statusChange = new EventEmitter<boolean>();

  private readonly blinkService = inject(BlinkService);
  private readonly elementRef = inject(ElementRef);

  onToggleStatus(): void {
    this.statusChange.emit(!this.status);
  }

  blinkFirstChild(): void {
    this.blinkService.blinkElementsFirstChild(this.elementRef);
  }
}
