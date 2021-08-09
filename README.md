# Ambulance App CMS

The purpose of the CMS is to manage the content from the Ambulance app, like the instruction manual, regulations, decision tree and calculation info. 
The CMS is build in React and uses the Firestore database from Firebase.

## Available Scripts

Make sure you are using node 12, we recommend you to use node version manager (nvm).

In the project directory, you can run:

    npm start

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

When you are done with the code changes you can run the following command to build the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

    npm run build

Finaly deploy your hosting content and config to the live channel

    firebase deploy

## User management

Users can be created and managed in the [firebase console](https://console.firebase.google.com/) in the tab Authentication.