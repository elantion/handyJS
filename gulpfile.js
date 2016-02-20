const uglify = require('gulp-uglify');
const include = require('gulp-include');
const babel = require('gulp-babel');
const rename = require("gulp-rename");
const gulp = require('gulp');
//both
gulp.task('both', ()=>{
	return gulp.src('raw/both/**/*.js')
		.pipe(babel())
		.pipe(gulp.dest('browser/src'))
		.pipe(gulp.dest('server/src'));

});
//browser complies
gulp.task('browser', ()=>{
	return gulp.src('raw/browser/**/*.js')
		.pipe(babel())
		.pipe(gulp.dest('browser/src'));
});

//server complies
gulp.task('server', ()=>{
	return gulp.src('raw/server/**/*.js')
		.pipe(babel())
		.pipe(gulp.dest('server/src'));
});
//browser combine
gulp.task('browser-combine', () => {
	return gulp.src('raw/browser.js')
		.pipe(include())
		.on('error', console.log)
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
gulp.task('server-combine', () => {
	return gulp.src('raw/server.js')
		.pipe(include())
		.on('error', console.log)
		.pipe(rename((path)=>{
			path.basename = 'index';
		}))
		.pipe(gulp.dest('server'));
});
gulp.task('watch', () => {
	gulp.watch('raw/**/*.js', ['both', 'browser', 'server', 'browser-combine', 'server-combine']);
});
gulp.task('default', ['watch']);
