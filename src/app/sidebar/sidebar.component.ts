import { Component, ElementRef, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

import { BlinkService } from '../shared/blink.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: 'sidebar.component.html',
  styleUrl: 'sidebar.component.scss',
})
export class SidebarComponent {
  private readonly blinkService = inject(BlinkService);
  private readonly elementRef = inject(ElementRef);

  protected blink(): void {
    this.blinkService.blinkElementsFirstChild(this.elementRef);
  }
}
