import { Component } from '@angular/core';
import { UpdateManagerService } from './shared/service/update-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angularChat';
  constructor(private readonly _updateService : UpdateManagerService){
    this._updateService.displayToastInstall();
  }
}
