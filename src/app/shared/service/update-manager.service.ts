import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ToastController, ToastOptions } from '@ionic/angular';
import { map, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UpdateManagerService {

  updateAvailable!:Observable<Boolean|{}>;
  mySubscription!:Subscription;
  // updateAvailable!:Observable<Boolean|{}>;
  closed=new Subject<void>();

  constructor(private updates: SwUpdate,
      private _toast: ToastController
    ){
  }

  private async displayUpdateAlert(){
    console.log("display notif");
    const data = <ToastOptions>{
      message:"new update",
      position:"bottom",
      showCloseButton:true,
      closeButtonText:"update"
    };
    const toast = await this._toast.create(data);
    await toast.present();
    toast.onDidDismiss().then(_ => this.installUpdate());
  }

  installUpdate(){
    if(environment.production){
      this.updates.activateUpdate().then(()=>{location.reload()})
    }
  }

  initUpdate(){
    console.log("Application updater install ",environment.production);
    this.updateAvailable = merge(
      of(false),
      // this.updates.versionUpdates.pipe(
      this.updates.available.pipe(
        map(async _ => await this.displayUpdateAlert()),
        map(() => true)
      ),
      this.closed.pipe(map(()=>false))
    );
    this.updateAvailable.subscribe();
  }
}
