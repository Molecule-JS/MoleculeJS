const gulp = require('gulp');
const merge = require('merge-stream');
const ts = require('gulp-typescript');
const replacePath = require('gulp-replace-path');
const path = require('path');
const clean = require('gulp-clean');

const testConfig = {
    "target": "ES2015",
    "module": "es2015",
    "lib": ["dom", "dom.iterable", "es2017", "es6"],
    "declaration": false,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "inlineSources": true,
    "experimentalDecorators": true,
}

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

const sources = [
    'molecule',
    'molecule-lit',
    'molecule-lit-extended',
    'molecule-decorators',
    'molecule-functional',
    'molecule-functional-lit',
    'molecule-functional-lit-extended',
    'molecule-lit-directive-set-element'
];

gulp.task('build-module-tests', () => {
    return merge(
        sources.map(src => {
            let stream = gulp.src(`./packages/${src}/test/${src}.test.module.ts`);

            return stream
                .pipe(ts(testConfig))
                .pipe(replacePath('../../../test', '..'))
                .pipe(replacePath(`../${src}`, `../../packages/${src}/${src}`))
                .pipe(gulp.dest(`./test/tests/`));
        }),
        gulp.src('./test/common/*.ts')
            .pipe(ts(testConfig))
            .pipe(gulp.dest('./test/common-built'))
    )
});



gulp.task('build-modules', () => {
    return merge(
        sources.map(src => {
            let stream = gulp.src(`./packages/${src}/src/**/*.ts`);

            return stream
                .pipe(ts( { ...config, rootDir: `./packages/${src}/` }))
                .pipe(replacePath(/..\/node_modules/g, '../../..'))
                .pipe(replacePath(/from '([^']+)'/g, 'from \'$1.js\''))
                .pipe(gulp.dest(`./packages/${src}/module/.`));
        })
    )
});

gulp.task('clean-test-folder', () => gulp.src(['test/tests/*.js', 'test/common-built/*.js'])
    .pipe(clean()));