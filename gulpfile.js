var gulp = require('gulp');

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var bump = require('gulp-bump');
var git = require('gulp-git');
var gitModified = require('gulp-gitmodified');
var glob = require('glob');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var util = require('gulp-util');

var fs = require('fs');

function getVersionFromPackage() {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

function getVersionForComponent() {
    return getVersionFromPackage().split('.').slice(0, 2).join('.');
}

gulp.task('ensure-clean-working-directory', function() {
    return gulp.src('./**/*')
        .pipe(gitModified('M', 'A', 'D', 'R', 'C', 'U', '??'))
        .on('data', function (file) {
            if (file) {
                throw new Error('Unable to proceed, your working directory is not clean.');
            }
        });
});

gulp.task('bump-version', function () {
    return gulp.src([ './package.json' ])
        .pipe(bump({ type: 'patch' }).on('error', util.log))
        .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
    return gulp.src([ './', './dist/' ])
        .pipe(git.add())
        .pipe(gitModified('M', 'A'))
        .pipe(git.commit('Release. Bump version number'));
});

gulp.task('push-changes', function (cb) {
    git.push('origin', 'master', cb);
});

gulp.task('create-tag', function (cb) {
    var version = getVersionFromPackage();

    git.tag(version, 'Release ' + version, function (error) {
        if (error) {
            return cb(error);
        }

        git.push('origin', 'master', { args: '--tags' }, cb);
    });
});

gulp.task('build-browser', function() {
    return browserify('./index.js', { standalone: 'Barchart.Common' }).bundle()
        .pipe(source('barchart-common-' + getVersionForComponent() + '.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist'))
        .pipe(uglify())
        .pipe(rename('barchart-common-' + getVersionForComponent() + '-min.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('build-browser-tests', function () {
    return browserify({ entries: glob.sync('test/specs/**/*.js') }).bundle()
        .pipe(source('barchart-common-tests-' + getVersionForComponent() + '.js'))
        .pipe(buffer())
        .pipe(gulp.dest('test/dist'));
});

gulp.task('build-browser-components', [ 'build-browser' ]);

gulp.task('build', [ 'build-browser-components' ]);

gulp.task('execute-browser-tests', function () {
    return gulp.src('test/dist/barchart-common-tests-' + getVersionForComponent() + '.js')
        .pipe(jasmine());
});

gulp.task('execute-node-tests', function () {
    return gulp.src(['index.js', 'test/specs/**/*.js'])
        .pipe(jasmine());
});

gulp.task('execute-tests', function (callback) {
    runSequence(
        'build-browser-tests',
        'execute-browser-tests',
        'execute-node-tests',

        function (error) {
            if (error) {
                console.log(error.message);
            }

            callback(error);
        });
});

gulp.task('release', function (callback) {
    runSequence(
        'ensure-clean-working-directory',
        'build',
        'build-browser-tests',
        'execute-browser-tests',
        'execute-node-tests',
        'bump-version',
        'commit-changes',
        'push-changes',
        'create-tag',

        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Release complete');
            }

            callback(error);
        });
});

gulp.task('lint', function() {
    return gulp.src([ './**/*.js', './test/specs/**/*.js' ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('test', [ 'execute-tests' ]);

gulp.task('default', [ 'lint' ]);