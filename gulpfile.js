var gulp = require("gulp");
var remove = require("gulp-remove-code");
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var uglify = require("gulp-uglify");
var plumber = require("gulp-plumber");

gulp.task("production", function(){
	gulp.src("src/eve.js")
	.pipe(plumber())
	.pipe(remove({production: true}))
	.pipe(replace("//removeIf(development)", ""))
	.pipe(replace("//endRemoveIf(development)", ""))
	.pipe(gulp.dest("./lib/production"))
	.pipe(uglify())
	.pipe(rename("eve.min.js"))
	.pipe(gulp.dest("./lib/production"));
});

gulp.task("development", function(){
	gulp.src("src/eve.js")
	.pipe(plumber())
	.pipe(remove({development: true}))
	.pipe(replace("//removeIf(production)", ""))
	.pipe(replace("//endRemoveIf(production)", ""))
	.pipe(rename("eve.dev.js"))
	.pipe(gulp.dest("./lib/dev"))
	.pipe(uglify())
	.pipe(rename("eve.dev.min.js"))
	.pipe(gulp.dest("./lib/dev"));
});

gulp.task("watch", function(){
	gulp.watch("src/eve.js", ["production", "development"]);
});

gulp.task("default", ["production", "development", "watch"]);