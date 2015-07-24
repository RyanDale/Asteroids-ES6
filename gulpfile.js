'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    babel = require('gulp-babel'),
    server = require('gulp-server-livereload'),
    paths = {
        dev: {
            thirdParty: './src/third-party/**/*.js',
            css: './src/css/**/*.css',
            app: './src/app/**/*.js',
            js: './src/js/**/*.js',
            tests: './src/app/**/*.spec.js',
            html: './src/app/**/*.html',
            index: './src/index.html',
            newBaseJS: []
        },
        build: {
            root: './build/',
            thirdPartyRoot: './build/third-party'
        },
        dist: {
            app: 'app.js',
            js: 'dist.js',
            css: 'dist.css',
            tests: 'tests.js',
            thirdParty: 'third-party.js',
            newBaseJS: 'new-base.js',
            index: 'index.html'
        }
    };

gulp.task('build-app', function () {
    return gulp.src([
        paths.dev.js
    ]).pipe(babel({
        modules: 'amd'
    }))
        //.pipe(concat(paths.dist.js))
        //.pipe(uglify())
        .pipe(gulp.dest(paths.build.root))
        .pipe(livereload());
});

gulp.task('build-index', function () {
    return gulp.src([paths.dev.index])
        .pipe(gulp.dest(paths.build.root))
        .pipe(livereload());
});


gulp.task('webserver', function() {
    gulp.src('./build')
        .pipe(server({
            //livereload: true,
            open: true
        }));
});

gulp.task('watch', function () {
    gulp.watch([
        paths.dev.js
    ], ['build-app']);

    gulp.watch([
        paths.dev.index
    ], ['build-index']);
});

gulp.task('default', ['watch', 'webserver']);

gulp.task('build', [
    'build-app',
    'build-index'
]);
