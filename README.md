spyfall
=======

React + Firebase implementation for the card game [Spyfall](http://boardgamegeek.com/boardgame/166384/spyfall)

### Localizations
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/adrianocola-spyfall/localized.svg)](https://crowdin.com/project/adrianocola-spyfall)

Access [crowdin's](https://crowdin.com/project/adrianocola-spyfall) page to request new translations or help translating existing ones.

### Running the project

- Install [node.js](https://nodejs.org/)
- Install [firebase-tools](https://firebase.google.com/docs/cli)
- Clone this project, enter the cloned folder and install dependencies with `npm install`
- Setup a new firebase project with the `firebase init` command and follow the instructions (select only the feature `database`. Use the default values for everything and don't overwrite anything)
- Create a new web app with the command `firebase apps:create WEB`. The command will output the created `App Id`
- Execute the command `firebase apps:sdkconfig WEB <created app id>` to get the complete app configuration
- Create a copy of the file `env/_sample.js` named `env/dev.js` and fill it with the firebase configuration. You don't need to fill all fields.
- Access your firebase project in the [firebase console](https://console.firebase.google.com/) and enable anonymous authentication (Authentication → Sign-in method → Anonymous)
- Deploy firebase database security rules `firebase deploy --only database`
- Run the project with `npm run start` and access it at `http://localhost:4000`
