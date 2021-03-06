var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var imageMin = require('gulp-imagemin');
var injectPartials = require('gulp-inject-partials');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var cssMin = require('gulp-cssmin');
var htmlMin = require('gulp-htmlmin');

var SOURCEPATH = {
    sassSource: 'src/scss/*.scss',
    htmlSource: 'src/*.html',
    htmlPartialSource: 'src/partials/*.html',
    jsSource: 'src/js/*.js',
    imgSource: 'src/img/**',
};
var appPATH = {
    root: 'app/',
    css: 'app/css',
    js: 'app/js',
    fonts: 'app/fonts',
    img: 'app/img'
};

gulp.task('clean-html', function() {
    return gulp.src(appPATH.root + '/*.html', {read: false, force: true})
    .pipe(clean());
});

gulp.task('clean-scripts', function() {
    return gulp.src(appPATH.js + '/*.js', {read: false, force: true})
    .pipe(clean());
});


gulp.task('sass', function() {
    var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
    var sassFiles;
    sassFiles = gulp.src(SOURCEPATH.sassSource)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer())
    return merge(bootstrapCSS, sassFiles)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(appPATH.css));
});

gulp.task('images', function() {
    return gulp.src(SOURCEPATH.imgSource)
    .pipe(newer(appPATH.img))
    .pipe(imageMin())
    .pipe(gulp.dest(appPATH.img));
});

gulp.task('move-fonts', function() {
    gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest(appPATH.fonts));
});

gulp.task('scripts', ['clean-scripts'], function() {
    gulp.src(SOURCEPATH.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(gulp.dest(appPATH.js));
});

/** PRODUCTION TASKS **/

gulp.task('compress', function() {
    gulp.src(SOURCEPATH.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
    .pipe(minify())
    .pipe(gulp.dest(appPATH.js));
});

gulp.task('compresscss', function() {
    var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
    var sassFiles;
    sassFiles = gulp.src(SOURCEPATH.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    return merge(bootstrapCSS, sassFiles)
        .pipe(concat('app.css'))
        .pipe(cssMin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(appPATH.css));
});

gulp.task('minifyhtml', function() {
    return gulp.src(SOURCEPATH.htmlSource)
    .pipe(injectPartials())
    .pipe(htmlMin({collapseWhitespace:true}))
    .pipe(gulp.dest(appPATH.root))
});

/** END OF PRODUCTION TASKS **/


gulp.task('html', function() {
    return gulp.src(SOURCEPATH.htmlSource)
    .pipe(injectPartials())
    .pipe(gulp.dest(appPATH.root))
});
/*
gulp.task('copy', ['clean-html'], function() {
    gulp.src(SOURCEPATH.htmlSource)
    .pipe(gulp.dest(appPATH.root));
});
*/
gulp.task('serve', ['sass'], function() {
    browserSync.init([appPATH.css + '/*.css', appPATH.root + '/*.html', appPATH.js + '/*.js'], {
        server: {
            baseDir : appPATH.root
        }
    });
});

gulp.task('watch', ['serve', 'sass', 'clean-html', 'clean-scripts', 'scripts', 'move-fonts', 'images', 'html'], function() {
    gulp.watch([SOURCEPATH.sassSource], ['sass']);
    //gulp.watch([SOURCEPATH.htmlSource], ['copy']);
    gulp.watch([SOURCEPATH.jsSource], ['scripts']);
    gulp.watch([SOURCEPATH.htmlSource, SOURCEPATH.htmlPartialSource], ['html']);
});

gulp.task('default', ['watch']);

gulp.task('production', ['minifyhtml', 'compresscss', 'compress'] );