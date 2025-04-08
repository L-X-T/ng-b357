import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, input, viewChild } from '@angular/core';

import { ChartsDataService } from './charts-data.service';
import { BlinkService } from '../../shared/blink.service';

import 'anychart';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly id = input(0);
  readonly data = input('data1');

  readonly container = viewChild<ElementRef>('container');

  private chart?: anychart.charts.Pie | null;

  private readonly chartsDataService = inject(ChartsDataService);
  private readonly blinkService = inject(BlinkService);
  private readonly elementRef = inject(ElementRef);

  ngOnInit(): void {
    // Default data set mapping, hardcoded here.
    this.chart = anychart.pie(this.chartsDataService.getData(this.data()));
  }

  ngAfterViewInit(): void {
    const container = this.container();
    if (this.chart && container) {
      this.chart.container(container.nativeElement);
      this.chart.draw();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  }

  blink(): void {
    this.blinkService.blinkElementsFirstChild(this.elementRef);
  }
}
