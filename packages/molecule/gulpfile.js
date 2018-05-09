const gulp = require('gulp');
const replacePath = require('gulp-replace-path');
const typescript = require('gulp-typescript');

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
  gulp.src(['src/**/*.ts'])
    .pipe(replacePath(/..\/node_modules/g, '../..'))
    .pipe(replacePath(/from '([^']+)'/g, 'from \'$1.js\''))
    .pipe(typescript(config))
    .pipe(gulp.dest('.'));
});

gulp.task('fix-path-dist', () => {
  gulp.src(['dist/**/*.ts'])
    .pipe(replacePath(/..\/node_modules/g, '../../..'))
    .pipe(replacePath(/from '([^']+)'/g, 'from \'$1.js\''))
    .pipe(gulp.dest('./dist'))
})

gulp.task('default', ['build', 'fix-path-dist']);