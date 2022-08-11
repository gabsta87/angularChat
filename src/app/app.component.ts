import { Component } from '@angular/core';
import { InstallIosManagerService } from './shared/service/install-ios-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angularChat';
  constructor(private readonly _installService : InstallIosManagerService){
    this._installService.displayToastInstall();
  }
}
