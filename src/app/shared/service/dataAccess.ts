import { User } from "@angular/fire/auth";

export interface DataAccess{

    // requests
    getPendingRequests():any;

    createPendingRequest(name:string, userId:string):any;

    deletePendingRequest(requestId:string):any;

    // activities
    getActivities():any;

    getActivity(activityId:string):any;

    createActivity(name:string):any;

    // events
    getEvent(eventId:string):any;

    getEvents():any;

    createEvent(name:string,creatorId:string,date:string,location:string):any;

    deleteEvent(eventId:string):any;

    // getEventsFiltered(location:string,distance:number,...types:string[]):any;
    // getEventsFiltered(name:string,location:string,distance:number,...types:string[]):any;

    // users
    getUsers():any;

    getUser(userId:string):any;

    createUser(newUser:User):any;

    // messages
    getMessages(discussionId:string,count?:number):any;

    writeMessage(discussionId:string,message:string,type:string,user:User|null):any;
}