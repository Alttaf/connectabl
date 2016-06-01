# node

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 3.7.4.

This was used as it is a good way to boostrap quickly and I have used it in hackathons in the past.  

a great place to download node if you are on mac is the node website, no need for any home brew stuff :)

https://nodejs.org/en/

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7
- [Bower](bower.io) (`npm install --global bower`)
- [Ruby](https://www.ruby-lang.org) and then `gem install sass`
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `bower install` to install front-end dependencies.

3. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running  ###THIS IS VERY IMPORTANT,
Change the /server/config/local-env - /server/config/environment/development.js and test.js files to your mongo db url.

4. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `grunt build` for building and `grunt serve` for preview.

## Testing

Running `npm test` will run the unit tests with karma.
