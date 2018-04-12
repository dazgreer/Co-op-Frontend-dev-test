
/* Gulp requires */
var gulp = require('gulp'),
	less = require('gulp-less'),
	minifycss = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	connect = require('gulp-connect'),
	minify = require('gulp-minify'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	fileinclude = require('gulp-file-include'),
	urlPrefixer = require('gulp-url-prefixer'),
	inject = require('gulp-inject');
 

/* Create webserver */
gulp.task('webserver', function() {
	connect.server({
		livereload: true
	});
});


/* Watch changes */
gulp.task('watch', function () {
	gulp.watch('src/styles/*.less' , ['less']);
	gulp.watch('src/script/*.js' , ['js-core']);
	gulp.watch('src/script/libs/*.js' , ['js-libs']);
	gulp.watch('src/images/**/*.*' , ['images']);
	gulp.watch('src/fonts/**/*.*' , ['fonts']);
	gulp.watch('src/pages/**/*.html' , ['html']);
});


/* LESS
	- compile
	- URL prefixer
	- autoprefixer
	- create source map
	- minify
	- rename
*/
gulp.task('less', function () {

	return gulp.src('src/styles/style.less')

		.pipe(sourcemaps.init())
		.pipe(less().on('error', function (err) {
			console.log(err);
		}))
		.pipe(urlPrefixer.css({
	    	prefix: '../images/'
		}))
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
		.pipe(minifycss().on('error', function(err) {
			console.log(err);
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/css/'))
		.pipe(connect.reload());

});


/* JS - Core
	- create require JS
		- create source map
		- concat require and app (config)
		- minify
	- create require JS
		- create source map
		- concat all plugins and script
		- minify
*/
gulp.task('js-core', function() {

	gulp.src('src/script/app.js')
  		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js/'))
		.pipe(connect.reload());

});

gulp.task('js-libs', function() {
	
	return gulp.src('src/script/libs/*.js')
		
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist/js/libs/'))
		.pipe(connect.reload());

});


/* Images */

gulp.task('images', function(){

 	return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
 		.pipe(cache(imagemin()))
		.pipe(gulp.dest('dist/images'))
		.pipe(connect.reload());

});


/* Fonts */
gulp.task('fonts', function() {
	
	return gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('dist/fonts/'))

});


/* HTML */
gulp.task('html', function(){

	gulp.src('src/pages/*.html')
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(urlPrefixer.html({
	    	prefix: 'images/',
	    	tags: ['img']
		}))
		.pipe(inject(
			gulp.src(['dist/*.html'], {read: false}), {
				transform: function (filepath, file) {
					console.log(filepath)
					if (filepath.slice(-5) === '.html' && filepath !== 'index.html') {
						return '<li><a href="' + filepath + '">' + filepath + '</a></li>';
					}
					// Use the default transform as fallback:
					return inject.transform.apply(inject.transform, arguments);

				},
			
			addRootSlash: false,  // ensures proper relative paths
			ignorePath: '/dist/' // ensures proper relative paths
			}

		))
		.pipe(gulp.dest('dist/'))
		.pipe(connect.reload());

});


/* Default task */
gulp.task('default', ['fonts', 'watch', 'webserver', 'less', 'js-core', 'js-libs', 'images', 'html']);
