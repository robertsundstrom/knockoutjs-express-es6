# knockoutjs-express-es6
Sample demonstrating how to implement a Single-Page Application (SPA) with the MVVM pattern using KnockoutJS, Express.js and ECMAScript 6.

## Main features ##

* Single-Page Application (SPA)
* ECMAScript 6 (ES6) (with BabelJS)
* KnockoutJS for MVVM
* Knockout-ES5 (for binding to ES5 properties). 
* Custom binding provider (for ko-* attributes).
* ES6 component loader (SystemJS)
* Uses JSPM
* Based on ZURB Foundation 5
* ExpressJS server

## Details ##

The project is using SystemJS (module loading), BabelJS (for ECMAScript 6), and JSPM (for package management) on the frontend (under "wwwroot").

Includes a custom ES6 component loader for KnockoutJS.

ZURB Foundation 5 is used as frontend framework.

The SPA structures is mainly based on that introduced in this blog: https://sumitmaitra.wordpress.com/2014/08/04/part-3-ko-components-routes-and-hashes/

### ECMA Script 6 ###

Using BabelJS to compile ES6 features (and some proposed for ES7) to plain ES5 that can be executed in todays browsers.

* **ES6:** Classes, String interpolation and more.

* **ES7:** Async-Await and Decorators.

*This is mostly compatible with TypeScript as well.*

### SystemJS ###

Using the SystemJS and JSPM systems to handle ES6 modules.

Compiling all files into a bundle with SystenJS Builder.

### Binding provider ###

#### Binding attributes (ko-*) ####

Introducing ko-prefixed binding:

    <h2 ko-text="name"></h2>

#### String interpolation ####

The string interpolation syntax is borrowed from the ES6 specification.

    <h2>${user.name}</h2>

*Note:* Does not yet support multiple such in a text node.

## Install ##

1. Run npm install
2. Run jspm install
3. Run with ExpressJS

Linux:

    DEBUG=myapp npm start
    
Windows:
  
    set DEBUG=myapp & npm start
    

Open browser and navigate to: http://localhost:3000/    

    
*Note:* You can just run the batch-files.

## Bundling ##

How to pack all dependencies into one precompiled bundle targeting ES5 (a.k.a. "the JavaScript of today") and SystemJS.

    cd wwwroot
    node builder.js
    
All ES6 code and templates get compiled and all referenced dependencies like jQuery get imported, and stripped of unecessary code.

Just add a reference to the output file in index.html. This one will be loaded instead of the raw files (uncompiled) existing on server.
