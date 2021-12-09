# App CMS

The purpose of the CMS is to manage the content for the app, you can add, remove and update the content of the books. 
The CMS is build in React and uses the Firestore database from Firebase.

## Local development & deployment

Make sure you are using node 12, we recommend you to use node version manager (nvm).

### Functions

Go to the functions directory, then make sure you copy the secrets to a json file in order to invoke it locally: 

    cd functions && firebase functions:config:get -P development > .runtimeconfig.json
    cd functions && firebase functions:config:get -P academie-voor-ambulancezorg > .runtimeconfig.json

Then start the emulator:

    firebase emulators:start --only functions -P development
    firebase emulators:start --only functions -P academie-voor-ambulancezorg

In a separate terminal run typescript in the background:

    tsc --watch

When ready run the following commands to deploy the functions to Firebase:

    npm run build

    firebase deploy --only functions:cms -P development
    firebase deploy --only functions:cms -P academie-voor-ambulancezorg

### Hosting

In the project directory, you can run:

    npx env-cmd -f .env.development npm start
    npx env-cmd -f .env.academie-voor-ambulancezorg npm start   # customer specific

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

When you are done with the code changes you can run the following command to build the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

    npx env-cmd -f .env.development npm run build
    npx env-cmd -f .env.academie-voor-ambulancezorg npm run build   # customer specific

Deploy finally your hosting content and config to the live channel

    npx env-cmd -f .env.development firebase deploy -P development --only hosting
    npx env-cmd -f .env.academie-voor-ambulancezorg firebase deploy -P academie-voor-ambulancezorg --only hosting

## User management

Users can be created and managed in the [firebase console](https://console.firebase.google.com/) in the tab Authentication.

## Import / export data between projects:

To import a backup from another project, define first which backup you would like to import: [backups](https://console.cloud.google.com/storage/browser?project=ambulancezorg-app&prefix=).
Also make sure the IAM roles are [configured correctly](https://firebase.google.com/docs/firestore/manage-data/move-data) (also in the project from where you perform the export).
Then run the following command:

    gcloud config set project <project-id> # make sure the cli is configured to the right project
    gcloud firestore import gs://ambulancezorg_app_firebase_backup/<backup folder> --async