import { Component, DOCUMENT, inject } from '@angular/core';

@Component({
  selector: '[app-navbar]',
  templateUrl: 'navbar.component.html',
})
export class NavbarComponent {
  private readonly document = inject(DOCUMENT);

  protected sidebarVisible = false;

  protected onToggleSidebar(): void {
    const body = this.document.getElementsByTagName('body')[0];
    const aside = this.document.getElementsByTagName('aside')[0];

    if (!this.sidebarVisible) {
      body.classList.add('nav-open');
      aside.setAttribute('aria-expanded', 'true');
      this.sidebarVisible = true;
    } else {
      body.classList.remove('nav-open');
      aside.setAttribute('aria-expanded', 'false');
      this.sidebarVisible = false;
    }
  }
}
