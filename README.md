# App CMS

The purpose of the CMS is to manage the content for the app, you can add, remove and update the content of the books. 
The CMS is build in React and uses the Firestore database from Firebase.

## Available Scripts

Make sure you are using node 12, we recommend you to use node version manager (nvm).

In the project directory, you can run:

    npx env-cmd -f .env npm start
    npx env-cmd -f .env.development npm start

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

When you are done with the code changes you can run the following command to build the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

    npm run build

Finaly deploy your hosting content and config to the live channel

    firebase deploy -P default|development

## User management

Users can be created and managed in the [firebase console](https://console.firebase.google.com/) in the tab Authentication.

## Import / export data between projects:

To import a backup from another project, define first which backup you would like to import: [backups](https://console.cloud.google.com/storage/browser?project=ambulancezorg-app&prefix=).
Also make sure the IAM roles are [configured correctly](https://firebase.google.com/docs/firestore/manage-data/move-data).
Then run the following command:

    gcloud firestore import gs://ambulancezorg_app_firebase_backup/<backup folder> --async