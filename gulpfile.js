const uglify = require('gulp-uglify');
const include = require('gulp-include');
const babel = require('gulp-babel');
const rename = require("gulp-rename");
const gulp = require('gulp');
//browser
gulp.task('browser', () => {
	return gulp.src('raw/browser.js')
		.pipe(include())
		.on('error', console.log)
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(rename((path)=>{
			path.basename = 'handy';
		}))
		.pipe(gulp.dest('browser'))
		.pipe(uglify())
		.pipe(rename((path) => {
			path.basename = 'handy';
			path.extname = '.min.js';
		}))
		.pipe(gulp.dest('browser'));
});
//server
gulp.task('server', () => {
	return gulp.src('raw/server.js')
		.pipe(include())
		.on('error', console.log)
		.pipe(rename((path)=>{
			path.basename = 'index';
		}))
		.pipe(gulp.dest('server'));
});
gulp.task('watch', () => {
	gulp.watch('raw/**/*.js', ['browser', 'server']);
});
gulp.task('default', ['browser', 'server']);
