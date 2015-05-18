var gulp = require("gulp");
var watch = require("gulp-watch");
var del = require('del');

var paths = [ 'src/**/*.js', "!node_modules/**/*", "!gulpfile.js", "!wwwroot/**/*", "wwwroot/css/**/*", "wwwroot/img/**/*", "wwwroot/js/**/*" ];

gulp.task("clean", function () {
  del(["dist"], { force: true });
});


gulp.task("build", ["clean"], function () {
    
});

gulp.task("default", ["build", "watch"], function () {
    
});
