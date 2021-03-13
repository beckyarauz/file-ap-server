const gulp = require("gulp");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");
const tsProject = ts.createProject("tsconfig.json");

const files = [
  './tests/**/*.dat',
  './src/**/*.json',
];

gulp.task('copy', () => {
  return gulp.src(files, { base: './' })
    .pipe(gulp.dest('dist'));
});

gulp.task('compile', () => {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
});

gulp.task('default', gulp.series('compile', 'copy'), (done) => {
});