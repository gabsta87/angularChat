// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  version:'0.0.2',
  firebase: {
    projectId: 'angularchat-eaffb',
    appId: '1:10970880489:web:882d0eda3c956e463dd378',
    storageBucket: 'angularchat-eaffb.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyAlIEnNPr1aFddmRoOZoZ2QqoPMtXvyHOI',
    authDomain: 'angularchat-eaffb.firebaseapp.com',
    messagingSenderId: '10970880489',
  },
  production: false,
  mapbox: {
    accessToken: "pk.eyJ1IjoiZ2FicmllbG1hcmV0IiwiYSI6ImNsNjNxczR6azBnZ3czY3A0YTZpYXR5Z28ifQ.H_qk45kg2jVa6K0JyEF8XA"
  },
  openweathermap: {
    apiToken : "f924d48800bd45566e4c44591ce4707b"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
