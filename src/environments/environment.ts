// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    firebase: {
        apiKey: 'AIzaSyDq1sMDkBQ3m09nsgmqa7w8OlFL5mEhWi4',
        authDomain: 'gradient-mat-card.firebaseapp.com',
        databaseURL: 'https://gradient-mat-card.firebaseio.com',
        projectId: 'gradient-mat-card',
        storageBucket: 'gradient-mat-card.appspot.com',
        messagingSenderId: '860777338389'
    }
}

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
