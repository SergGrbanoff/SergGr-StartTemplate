var gulp 						= require('gulp'),
		gutil 					= require('gulp-util'),
		sass 						= require('gulp-sass'),
		pug 						= require('gulp-pug'),
		plumber 				= require("gulp-plumber"),
		browserSync 		= require('browser-sync'),
		concat 					= require('gulp-concat'),
		uglify 					= require('gulp-uglify'),
		cleanCSS        = require('gulp-clean-css'),
		rename          = require('gulp-rename'),
		del             = require('del'),
		imagemin        = require('gulp-imagemin'),
		cache           = require('gulp-cache'),
		autoprefixer    = require('gulp-autoprefixer'),
		notify          = require("gulp-notify");

// Работа с Pug
gulp.task('pug', function() {
    return gulp.src('app/pug/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .on("error", notify.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(gulp.dest('app'));
});

// scripts

gulp.task('main-js', function() {
	return gulp.src([
		'app/js/main.js', // Кастомный код JavaScript 
		])
	.pipe(concat('main.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('js', ['main-js'], function() {
	return gulp.src([
		// Библиотеки
		'app/libs/jquery/jquery-3.2.1.min.js',
		'app/js/main.min.js', // Кастомный код JavaScript ==> Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

// end scripts*/

// browser-sync
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
	});
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/main.js'], ['js']);
	gulp.watch('app/pug/**/*.pug', ['pug']);
	gulp.watch('app/*.html', browserSync.reload);
});
// end browser-sync

// style-scss
gulp.task('sass', function() {
	return gulp.src('app/scss/**/*.scss')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});
// end style scss




// нужно доработать!
// Image compression
gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});
// end Image compression

// Task assembly production
gulp.task('build', ['removedist', 'imagemin', 'sass', 'js'], function() {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/main.min.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));
});
// end Task assembly production


// удаление папки продакшн
gulp.task('removedist', function() { return del.sync('dist'); });

// Очистка кеша
gulp.task('clearcache', function () { return cache.clearAll(); });

// Дефолтный таск
gulp.task('default', ['watch']);