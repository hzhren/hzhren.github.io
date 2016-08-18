/**
 *
 * Created by Administrator on 2016/8/18.
 */
var gulp = require("gulp");
var less = require("gulp-less");
var minify = require("gulp-minify-css");
var prefixer = require("gulp-autoprefixer");

var uglify = require("gulp-uglify");
var transport = require("gulp-seajs-transport");
var clone = require("gulp-clone");
var rename = require("gulp-rename");
var plumber = require("gulp-plumber");

// var projectName = "dyd";
var projectPath = "../hjjrPublic/";

gulp.task("less", function(callback){
    var stream, uncompressStream, compressStream;

    stream = gulp.src("less/*.less")
        .pipe(plumber({
            errorHandler: function(err){
                console.log(err.toString());
                this.emit("end");
            }
        }))
        .pipe(less())
        .pipe(prefixer({
            browsers: [
                "last 2 version",
                "> 2%",
                "opera 12.1",
                "ie 9",
                "ie 8"
            ]
        }));

    uncompressStream = stream.pipe(clone());
    compressStream = stream.pipe(clone());

    uncompressStream.pipe(gulp.dest("css/"));

    compressStream.pipe(rename({ extname: ".min.css" }))
        .pipe(minify())
        .pipe(gulp.dest(projectPath + "css/"))
        .on("end", callback);
});

gulp.task("js", function(callback){
    var stream, uncompressStream, compressStream;

    gulp.src(["javascripts/**/*.js", "!javascripts/config.js"])
        .pipe(plumber({
            errorHandler: function(err){
                console.log(err.toString());
                this.emit("end");
            }
        }))
        .pipe(transport())
        .pipe(uglify({
            preserverComments: false,
            ascii_only: true
        }))
        .pipe(gulp.dest(projectPath + "js/"));

    gulp.src("javascripts/config.js")
        .pipe(plumber({
            errorHandler: function(err){
                console.log(err.toString());
                this.emit("end");
            }
        }))
        .pipe(uglify())
        .pipe(gulp.dest(projectPath + "js/"))
        .on("end", callback);
});

gulp.task("build", ["less", "js"]);

gulp.task("watch", function(callback){

    gulp.watch("less/**/*.less", ["less"]);

    gulp.watch("javascripts/**/*.js", ["js"]);
});

gulp.task('default', ['watch']);



