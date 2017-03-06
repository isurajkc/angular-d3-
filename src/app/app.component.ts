import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <p>Data Visualization with Angular & D3</p>

  <app-chart></app-chart>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
}
