spyfall
=======

Simple one page website implementation for the card game [Spyfall](http://boardgamegeek.com/boardgame/166384/spyfall)

### Translations
Feel free to fork this project and add new languages! Follow this steps:
* Create a new file in the folder **public/i18n** based in the the file **en.json**
* Translate the file (see others translations for examples)
* Add the new locale to the languages combobox in the file **public/index.html**
* Create the pull request

### Running locally
* Install [node.js](http://nodejs.org/) and [redis](http://redis.io/)
* Clone this repo
```bash
    $ git clone https://github.com/adrianocola/spyfall.git
```
* Enter the directory and install dependencies
```bash
    $ cd spyfall
    $ npm install
```
* Run
```bash
    $ node app.js
```
* The app will be available at http://localhost:4000
