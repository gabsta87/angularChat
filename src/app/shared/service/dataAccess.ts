import { User } from "@angular/fire/auth";

export interface DataAccess{

    // requests
    getPendingRequests():any;

    getPendingRequest(id:string):any;

    createPendingRequest(name:string):any;

    deletePendingRequest(requestId:string):any;

    addUserToRequest(requestId:string):any;

    removeUserFromRequest(requestId:string):any;

    // activities
    getActivities():any;

    getActivity(activityId:string):any;

    createActivity(name:string):any;

    // events
    getEvent(eventId:string):any;

    getUpToDateEvents():any;

    getEventsCreatedBy(userId:string):any;

    getEventsAttendedBy(userId:string):any;

    getEvents():any;

    // createEvent2(name:string, activityId:string, description:string ,date:string, position:{latitude:number,longitude:number}):any;

    createEvent(event:{name:string, activityId:string, description:string, date:string, timeStamp:number, position:{latitude:number,longitude:number}}):any;

    deleteEvent(eventId:string):any;

    updateEvent(eventId:string,eventUpdates:{name:string, activityId:string, description:string,date:string, timeStamp:number}):any;

    addUserToEvent(requestId:string):any;

    removeUserFromEvent(requestId:string):any;

    // getEventsFiltered(location:string,distance:number,...types:string[]):any;
    // getEventsFiltered(name:string,location:string,distance:number,...types:string[]):any;

    // users
    getUsers():any;

    getUser(userId:string):any;

    createUser(newUser:User,userName?:string):any;

    setUser(newName:string):any;

    // messages
    getMessages(discussionId:string,count?:number):any;

    writeMessage(discussionId:string,message:string):any;
}