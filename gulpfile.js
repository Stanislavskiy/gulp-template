require('dotenv').config({ path: './secret.env' });

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const runSequence = require('run-sequence');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const gulpDropbox = require('gulp-dropbox');

// gulp.task('deploy', function() {
//   return gulp.src('./dist/*.*')
//     .pipe(gulpDropbox({
//       token: process.env.DROPBOX_TOKEN,
//       path: process.env.DROPBOX_PATH,
//       folder: process.env.DROPBOX_FOLDER
//     }));
//   });

gulp.task('build', function (callback) {
    runSequence(
        // 'clean-dist',
        ['sass', 'collect-scripts'],
        ['concat-scripts', 'concat-styles'],
        ['minify-js', 'minify-css'],
        // 'deploy',
        callback);
});


/* SCRIPTS */

gulp.task('collect-scripts', () => {
    return gulp.src('./src/scripts/*.js')
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('concat-scripts', () => {
    return gulp.src('./dist/js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-js', () => {
    return gulp.src('./dist/main.js')
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('./dist/'));
});

/* STYLES */

gulp.task('sass', () => {
    return gulp.src('./src/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('concat-styles', () => {
    return gulp.src('./dist/css/*.css')
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-css', () => {
    return gulp.src('./dist/main.css')
        .pipe(cleanCSS())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('./dist/'));
});


gulp.task('watch', () => {
    gulp.watch('./src/**/styles/**/*.scss', ['build']);
    gulp.watch('./src/**/scripts/**/*.js', ['build']);
});

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**'])
        .pipe(eslint({
            useEslintrc: true
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint', 'build', 'watch'], () => {
    // This will only run if the lint task is successful...
});
