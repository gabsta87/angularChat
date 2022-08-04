import { Injectable } from '@angular/core';
import { collection, collectionData, doc, DocumentData, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { query } from '@firebase/firestore';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AngularfireService {

  private _myData!:Observable<DocumentData[]>;
  private _dbName:string = "meectivity";

  constructor(private readonly _dbaccess:Firestore) { }

  activitiesList!:string[];

  async getCollection(name:string){

    const ref = doc(this._dbaccess,this._dbName,"name");
    const myDoc:any = await getDoc(ref);
    const collectionsList = myDoc._document.data.value.mapValue.fields.activitiesList["stringValue"].split(";");

  }

  async getActivities(){
    // const myCollection = collection(this._dbaccess,this._dbName);
    if(!this.activitiesList){
      const messageRef = doc(this._dbaccess,this._dbName,"activities");
      const myDoc:any = await getDoc(messageRef);
      this.activitiesList = myDoc._document.data.value.mapValue.fields.activitiesList["stringValue"].split(";");
    }
    console.log("activities list = ",this.activitiesList);
    

    // const final = doc(this._dbaccess,this._dbName,"activities").coll
    

    // const myDocument = document(this._dbaccess,this._dbName+"/activities/","Foot");
    // const q = query(messageRef);
    // this._myData = await collectionData(q,{idField:'id'}).pipe(
    //   tap(e=>console.log("e = ",e)),
    //   map((value:any[]) => {
    //       return value.map((todo)=> {
    //           const {userId,...data} = todo
    //           return data;
    //       })
    //     }));
    console.log("my data = ",this._myData);
    return this._myData;
  }

  createActivity(name:string){
    console.log("trying to add ",name," into ",this.activitiesList);

    if(!this.activitiesList.includes(name)){
      let tempValue = (this.activitiesList.length > 0?";":"")+name;
      console.log("pushing ",tempValue);
      this.activitiesList.push(tempValue);
      // Add the name to the list, and creates the subcollection
    }
  }

  async getMessages(discussionId:string){
    const myCollection = collection(this._dbaccess,this._dbName,"discussions",discussionId);
    const q = query(myCollection);
    this._myData = await collectionData(q,{idField:'id'});
    return this._myData;
  }

  writeMessage(message:string){
    const id = Date.now();
    const docRef = doc(this._dbaccess,this._dbName+'/'+id);
    setDoc(docRef,{messageContent:message});
  }

  async getMessagesFromDiscussion(discussion:string){
    const myCollection = collection(this._dbaccess,this._dbName,'/discussions/',discussion);
    const q = query(myCollection);
    this._myData = await collectionData(q,{idField:'id'});
    return this._myData;
  }

  writeMessageToDiscussion(discussion:string,message:string){
    const id = Date.now();
    const docRef = doc(this._dbaccess,this._dbName+'/discussions/'+discussion+'/'+id);
    setDoc(docRef,{messageContent:message});
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
