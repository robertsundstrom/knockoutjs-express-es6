var path = require("path");
var Builder = require('systemjs-builder');

var builder = new Builder({});
builder.loadConfig('./config.js').then(function () {
	builder.config({ 
		baseURL: 'file:' + process.cwd(), 
		transpiler: 'babel'
	});
	
	return builder.build('app/app + pages/**/* + components/**/*', 'site.js', {minify: false, sourceMaps: true})
	//return builder.buildSFX('app/app', 'dist/site.js', {minify: false, sourceMaps: true});

}).then(function () {
	console.log('Build complete');
})
.catch(function (err) {
	console.log('Build error');
	console.log(err);
});