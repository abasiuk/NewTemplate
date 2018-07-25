var gulp = require('gulp'),
	uncss = require('gulp-uncss'),
	minifyCSS = require('gulp-minify-css'),
	notify = require('gulp-notify'),
	prefix = require('gulp-autoprefixer'),
	livereload = require('gulp-livereload'),
	connect = require('gulp-connect'),
	imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
	sass = require('gulp-sass'),
    zip = require('gulp-zip'),
	concatCss = require('gulp-concat-css');

gulp.task('connect', function () {
	connect.server({
		root: 'app',
		livereload: true
	});
});

gulp.task('toZip', function () {
    gulp.src(['app/**/*.*', '!app/*.zip'])
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('app'))
});

gulp.task('html', function () {
	gulp.src('start/index.html')
	.pipe(gulp.dest('app'))
	.pipe(connect.reload());
});

gulp.task('css', function () {
  return gulp.src('start/css/*.sass')
    .pipe(sass())
    .pipe(prefix('last 10 versions'))
    .pipe(gulp.dest('start/css'))
    .pipe(connect.reload());
});

gulp.task('allcss', function () {
    gulp.src(['start/css/style.css', 'start/css/media.css'])
    .pipe(concatCss("style.css"))
    .pipe(gulp.dest('app/css'))
    .pipe(connect.reload());
});

gulp.task('allcss2', function () {
    gulp.src(['start/css/*.css', '!start/css/style.css', '!start/css/media.css'])
    .pipe(concatCss("libs.css"))
    .pipe(gulp.dest('app/css'))
    .pipe(connect.reload());
});

gulp.task('unusedCss', function () {
    gulp.src('app/css/style.css')
        .pipe(uncss({
            html: ['app/index.html']
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(connect.reload());
});

gulp.task('image', function () {
    gulp.src('start/images/**/*.*') //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest('app/images')) //И бросим в build
        .pipe(connect.reload());
});

gulp.task('fonts', function () {
    gulp.src('start/fonts/*.*')
    .pipe(gulp.dest('app/fonts'))
    .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src('start/js/*.js')
    .pipe(gulp.dest('app/js'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
	gulp.watch('start/css/*.sass', ['css'])
	gulp.watch('start/css/*.css', ['allcss', 'allcss2'])
	gulp.watch('start/index.html', ['html'])
	gulp.watch('start/js/*.js', ['js'])
    gulp.watch('start/images/**/*.*', ['image'])
});

gulp.task('default', ['connect', 'html', 'css', 'allcss', 'allcss2', 'js', 'image', 'fonts', 'watch']);