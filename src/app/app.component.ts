import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InstallIosManagerService } from './shared/service/install-ios-manager.service';
import { UpdateManagerService } from './shared/service/update-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angularChat';
  constructor(private readonly _installService : InstallIosManagerService,
    private readonly _updateService: UpdateManagerService){
      console.log("Version : ",environment.version);
      
      this._installService.displayToastInstall();
      this._updateService.initUpdate();
  }
}
