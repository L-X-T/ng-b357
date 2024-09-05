import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: 'navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  sidebarVisible = false;
  private readonly doc = inject(DOCUMENT);

  onToggleSidebar(): void {
    const body = this.doc.getElementsByTagName('body')[0];
    const aside = this.doc.getElementsByTagName('aside')[0];

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
