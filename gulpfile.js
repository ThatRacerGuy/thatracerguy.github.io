const basePaths = {
  src: './',
  dest: './'
};

const paths = {
  styles: {
    src: `${basePaths.src}scss/`,
    dest: `${basePaths.dest}css/`
  }
};

const scssPaths = [
  `${paths.styles.src}*/*.s+(a|c)ss`,
  `${paths.styles.src}*.s+(a|c)ss`
];

const gulp = require('gulp');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

/**
 * Compile SASS files
 */
gulp.task('compile-sass', () => {
  gutil.log(gutil.colors.blue('Compiling SASS --> CSS'));

  return gulp.src(`${paths.styles.src}*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.styles.dest))
    .on('error', gutil.log);
});


/**
 * Lint SASS files
 */
gulp.task('lint-sass', () => {
  gutil.log(gutil.colors.blue('Linting SASS files'));
  return gulp.src(scssPaths)
    .pipe(sassLint({
      configFile: '.sass-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

/*
 * Minify CSS
 */
gulp.task('minify-css', () => {
  return gulp.src(`${paths.styles.dest}*.css`)
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(`${paths.styles.dest}`));
});

/**
 * Watch for changes and recompile
 */
gulp.task('watch', () => {
  gutil.log(gutil.colors.blue('Watching for changes...'));

  // Watch SASS
  gulp.watch(scssPaths, ['compile-sass']);
});

/**
 * Available gulp tasks
 */
gulp.task('build',      gulp.series(['lint-sass', 'compile-sass']));
gulp.task('build:prod', gulp.series(['compile-sass', 'minify-css']));
gulp.task('lint',       gulp.series(['lint-sass']));
