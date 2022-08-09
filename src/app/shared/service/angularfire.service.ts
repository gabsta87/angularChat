import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { collection, QueryConstraint, Firestore, where, getDocs, addDoc, collectionData, orderBy, setDoc, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { query } from '@firebase/firestore';
import { firstValueFrom, map } from 'rxjs';
import { DataAccess } from './dataAccess';

@Injectable({
  providedIn:'root'
})
export class AngularfireService implements DataAccess{

  constructor(private readonly _dbaccess:Firestore, private readonly _auth:Auth) { }

  private getElements(name:string,...constraint:QueryConstraint[]){
    const myCollection = collection(this._dbaccess,name);

    let data = query(myCollection,...constraint)

    const observableStream = collectionData(data, {idField: 'id'})
    return observableStream;

    // observableStream.pipe(
    //   map(datas => {
    //     // ici je peux manipuler les datas ...

    //     // je n'oublie pas de retourner les data manipulées
    //     return datas;
    //   })
    // )
  }

  getPendingRequests(){
    let requestsList = this.getElements("requests");
    return requestsList;
  }

  getActivities(){
    let activitiesList = this.getElements("activities");
    return activitiesList;
  }

  getActivity(activityId:string){
    let temp = this.getActivities();
    return temp.pipe(map(datas => datas.find(e => e['id'] === activityId)));
  }

  getEvents(){
    let eventsList = this.getElements("events");
    return eventsList;
  }

  getEvent(eventId:string){
    let temp = this.getEvents();
    return temp.pipe(map(datas => datas.find(e => e['id'] === eventId)));
  }

  getUsers(){
    let usersList = this.getElements("users");
    return firstValueFrom(usersList);
  }

  async getUser(userId:string){
    let temp = await this.getUsers();
    return temp.find(e => e['id'] === userId);
  }

  createActivity(name:string){
    return addDoc(collection(this._dbaccess,"activities"),{name:name});
  }

  async createUser(newUser:User){
    let userId = newUser.uid;
    let userStored = await this.getUser(userId);

    if(userStored){
      return
    }

    const docRef = doc(this._dbaccess,'users/'+userId);
    return setDoc(docRef,{name:newUser.displayName});
  }

  getMessages(discussionId:string,count?:number){
    const discussion:QueryConstraint = where("discussionId","==",discussionId);
    const orderByDate:QueryConstraint = orderBy("date","asc");
    let messagesDoc = this.getElements("messages",discussion,orderByDate);
    return messagesDoc;
  }

  writeMessage(discussionId:string,message:string,type:string){
    addDoc(collection(this._dbaccess,"messages"),{content:message,date:Date.now(),discussionId:discussionId,type:type,userId:this._auth.currentUser?.uid});
  }

  createPendingRequest(name: string, userId: string) {
    return addDoc(collection(this._dbaccess,"requests"),{name:name,users:[userId]});
  }

  deletePendingRequest(requestId: string) {
    const docRef = doc(this._dbaccess,`requests/${requestId}`);
    return deleteDoc(docRef);
  }

  createEvent(name: string, creatorId: string, activityId:string ,date: string, location: string) {
    let newEvent = {name:name,creationDate:Date.now(),creatorId:creatorId,activityId:activityId,date:date,position:location};
    return addDoc(collection(this._dbaccess,"events"),newEvent);
  }

  deleteEvent(eventId: string) {
    const docRef = doc(this._dbaccess,`events/${eventId}`);
    return deleteDoc(docRef);
  }

  private addUser(tableName:string,itemId:string){
    const docRef = doc(this._dbaccess, `${tableName}/${itemId}`);
    return updateDoc(docRef, {users: arrayUnion(this._auth.currentUser?.uid)});
  }

  addUserToEvent(eventId:string){
    return this.addUser("events",eventId);
  }

  addUserToRequest(requestId:string){
    return this.addUser("requests",requestId);
  }

  private async removeUser(tableName:string,itemId:string){
    const docRef = doc(this._dbaccess, `${tableName}/${itemId}`);
    return await updateDoc(docRef, {users: arrayRemove(this._auth.currentUser?.uid)});
  }

  removeUserFromRequest(requestId:string){
    return this.removeUser("requests",requestId);
    // TODO remove request if last user unsubcribes
  }

  removeUserFromEvent(eventId:string){
    return this.removeUser("events",eventId);
    // TODO decide in which conditions to remove events
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
