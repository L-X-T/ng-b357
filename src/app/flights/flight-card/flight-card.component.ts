import { Component, ElementRef, inject, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import moment from 'moment';

import { Flight } from '../../entities/flight';
import { CityPipe } from '../../pipes/city.pipe';
import { BlinkService } from '../../shared/blink.service';

@Component({
  selector: 'app-flight-card',
  imports: [CityPipe],
  templateUrl: './flight-card.component.html',
  styleUrl: './flight-card.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlightCardComponent implements OnChanges, OnInit, OnDestroy {
  private debug = false;

  @Input({ required: true }) item!: Flight;
  @Input() selected = false;

  private readonly blinkService = inject(BlinkService);
  private readonly elementRef = inject(ElementRef);

  ngOnChanges(): void {
    if (this.debug) {
      console.warn('[FlightCardComponent - ngOnChanges()]');
      console.log(this.item);
      console.log('selected: ' + this.selected);
    }
  }

  ngOnInit(): void {
    if (this.debug) {
      console.warn('[FlightCardComponent - ngOnInit()]');
      console.log(this.item);
      console.log('selected: ' + this.selected);
    }
  }

  ngOnDestroy(): void {
    if (this.debug) {
      console.warn('[FlightCardComponent - ngOnDestroy()]');
      console.log(this.item);
      console.log('selected: ' + this.selected);
    }
  }

  getDate(item: Flight): string {
    return moment(item.date).format('MM.DD.YYYY HH:mm');
  }

  blinkFirstChild(): void {
    this.blinkService.blinkElementsFirstChild(this.elementRef);
  }
}