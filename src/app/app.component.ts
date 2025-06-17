import { ChangeDetectionStrategy, Component, computed, effect, Signal, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { JsonPipe } from '@angular/common';

@Component({
  imports: [RouterModule, SidebarComponent, NavbarComponent, FooterComponent, JsonPipe],
  selector: 'app-b357-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly source: WritableSignal<{ foo: string }> = signal({ foo: 'bar' });
  protected readonly computedTest: Signal<string> = computed(() => this.source().foo);

  protected setSource(): void {
    this.source.set({ foo: 'baz' });
  }

  protected updateSource(): void {
    this.source.update((current) => {
      current.foo = 'baz';
      return current;
    });
  }

  constructor() {
    effect(() => console.log('source changed', this.source()));
    effect(() => console.log('computed changed', this.computedTest()));
  }
}
