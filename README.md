# thymio-js-api-demo

This simple javascript application showcases how to use the Thymio API from a browser or a node-based app


## Getting started

### Install the switch

TODO

### Install npm

Npm is a package manager for JavaScript, you will need it to work with the Thymio API

[Learn more here](https://docs.npmjs.com/getting-started/installing-node#install-npm--manage-npm-versions).

Note that despite depending on Node to install and build the Thymio JS API, it is fully compatible with browsers
and Node.

### Install the dependencies

Run `npm i` in the cloned directory to install the required dependencies.

### Launch the web app

Run `npm run browser`, then open `dist/index.html` in your browser.
The web-based version outputs in the browser's console.

## Launch the Node-based application

Run `npm start`


## How does it work?

The thymio API is distributed as a [npm package](https://www.npmjs.com/package/@mobsya/thymio-api).
It can be installed with `npi -i @mobsya/thymio-API`.

This demo project also depends on:
* Webpack to orchestrate the bundling of the application for both node and browser
* Babel to convert the code in a flavor of Javascript compatible with older versions of web browsers

The code is in `src` and gets compiled into `dist`.

## What next.

You can copy this project or get inspiration from it to start working on web-applications compatible with thymio.

* [Thymio JS API](https://readthedocs.org/projects/aseba/)
* [Webpack](https://webpack.js.org/)
* [NPM](https://docs.npmjs.com/)
* [Babel](https://babeljs.io/)
