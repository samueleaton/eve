var gulp = require("gulp");
var remove = require("gulp-remove-code");
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var uglify = require("gulp-uglify");
var plumber = require("gulp-plumber");
var eslint = require("gulp-eslint");

gulp.task("production", ["linter"], function(){
	gulp.src("src/eve.js")
	.pipe(plumber())
	// .pipe(remove({production: true}))
	// .pipe(replace("//removeIf(development)", ""))
	// .pipe(replace("//endRemoveIf(development)", ""))
	.pipe(gulp.dest("./lib"))
	.pipe(uglify())
	.pipe(rename("eve.min.js"))
	.pipe(gulp.dest("./lib"));
});

// gulp.task("development", ["devLinter"], function(){
// 	gulp.src("src/eve.js")
// 	.pipe(plumber())
// 	.pipe(remove({development: true}))
// 	.pipe(replace("//removeIf(production)", ""))
// 	.pipe(replace("//endRemoveIf(production)", ""))
// 	.pipe(rename("eve.dev.js"))
// 	.pipe(gulp.dest("./lib/dev"))
// 	.pipe(uglify())
// 	.pipe(rename("eve.dev.min.js"))
// 	.pipe(gulp.dest("./lib/dev"));
// });

// gulp.task("devLinter", function(){
// 	console.log("DEV LINTER");
// 	return gulp.src("src/eve.js")
// 	.pipe(plumber())
// 	.pipe(remove({development: true}))
// 	.pipe(replace("//removeIf(production)", ""))
// 	.pipe(replace("//endRemoveIf(production)", ""))
// 	.pipe(eslint({"configFile":".eslintrc"}))
// 	.pipe(eslint.format())
// 	.pipe(eslint.failOnError());
// });

gulp.task("linter", function(){
	console.log("* ESLint ON *");
	return gulp.src("src/eve.js")
	.pipe(plumber())
	.pipe(remove({production: true}))
	.pipe(replace("//removeIf(development)", ""))
	.pipe(replace("//endRemoveIf(development)", ""))
	.pipe(eslint({"configFile":".eslintrc"}))
	.pipe(eslint.format())
	.pipe(eslint.failOnError());
});

gulp.task("watch", function(){
	gulp.watch("src/eve.js", ["production"]);
});

gulp.task("default", ["production", "watch"]);