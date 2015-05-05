# knockoutjs-express-es6
Sample demonstrating how to implement a Single-Page Application (SPA) with the MVVM pattern using KnockoutJS, Express.js and ECMAScript 6.

The project is using SystemJS (module loading), BabelJS (for ECMAScript 6), and JSPM (for package management) on the frontend (under "wwwroot").

Includes a custom ES6 component loader for KnockoutJS.

ZURB Foundation 5 is used as frontend framework.

The SPA structures is mainly based on that introduced in this blog: https://sumitmaitra.wordpress.com/2014/08/04/part-3-ko-components-routes-and-hashes/

## Install ##

1. Run npm install
2. Run jspm install
3. Run with ExpressJS

Linux:

    DEBUG=myapp npm start
    
Windows:
  
    set DEBUG=myapp & npm start
