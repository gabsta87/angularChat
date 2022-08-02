import { Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, DocumentData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { query } from '@firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AngularfireService {

  private _myData!:Observable<DocumentData[]>;
  private _dbName:string = "meectivity";

  constructor(private readonly _dbaccess:Firestore) { }

  getMessages(){
    const myCollection = collection(this._dbaccess,this._dbName);
    const q = query(myCollection);
    this._myData = collectionData(q,{idField:'id'});
    return this._myData;
  }

  writeMessage(message:string){
    const id = Date.now();
    const docRef = doc(this._dbaccess,this._dbName+'/'+id);
    setDoc(docRef,{orderValue:message});
  }

  // addOrder(newValue:number){
  //   const id = Date.now();
  //   const docRef = doc(this._dbaccess,this._dbName+'/'+id);
  //   setDoc(docRef,{orderValue:newValue});
  // }

  // async updateOrder(id:string){
  //   const docRef = doc(this._dbaccess, `${this._dbName}/${id}`);
  //   updateDoc(docRef,{done:true});
  // }

  // async deleteOrder(id:string){
  //   const docRef = doc(this._dbaccess,`${this._dbName}/${id}`);
  //   deleteDoc(docRef);
  // }
}
