const gulp = require('gulp');
const replace = require('gulp-replace-path');
const typescript = require('gulp-tsc');

const config = {
  "target": "ES2015",
  "module": "es2015",
  "lib": ["dom", "dom.iterable", "es2017", "es6"],
  "declaration": true,
  "sourceMap": true,
  "outDir": "./",
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "inlineSources": true,
  "experimentalDecorators": true,
}

gulp.task('build', () => {
  gulp.src(['src/*.ts'])
    .pipe(typescript(config))
    .pipe(replace(/..\/node_modules/g, '..'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['build'])