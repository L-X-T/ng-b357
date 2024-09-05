import { Component, ElementRef, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';

import { BlinkService } from '../shared/blink.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: 'sidebar.component.html',
  styleUrl: 'sidebar.component.scss',
})
export class SidebarComponent {
  private readonly blinkService = inject(BlinkService);
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject(ElementRef);
  private readonly focusableSelector = `
    a[href], button:not([disabled]):not(.navbar-toggler), textarea:not([disabled]),
    input:not([disabled]):not([type="hidden"]),
    select:not([disabled]), [tabindex]:not([tabindex="-1"])
  `;

  protected blink(): void {
    this.blinkService.blinkElementsFirstChild(this.elementRef);
  }

  protected onSkipToMainContent(): void {
    const mainElements = this.document.getElementsByTagName('main');
    if (!mainElements.length) {
      return;
    }

    const focusableElements = mainElements[0].querySelectorAll<HTMLElement>(this.focusableSelector);
    if (focusableElements.length) {
      console.log(focusableElements);
      focusableElements[0].focus();
    }
  }
}
