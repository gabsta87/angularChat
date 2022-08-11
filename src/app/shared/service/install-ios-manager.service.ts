import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InstallIosManagerService {

  constructor(private _toastCtrl: ToastController) {
    this.displayToastInstall();
  }

  async displayToastInstall(){
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    }
    const isInStandaloneMode = () => ('standalone' in (window as any).navigator) && ((window as any).navigator.standalone)
    if(isIos() && !isInStandaloneMode()){
      const toast = await this._toastCtrl.create({
        message:"MoveOn is not installed. If you want to install it, click on the button below"
      });
      await toast.present();
    }
  }
}
