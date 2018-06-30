const gulp = require('gulp');
const clean = require('gulp-clean');
const rollup = require('rollup');
const rollupTS = require('rollup-plugin-typescript2');
const runSequence = require('run-sequence');

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

const kebabToPascal = str => {
    const sub = str.substring(1, str.length);
    return str[0].toUpperCase() + sub.replace(/(\-\w)/g, x => x[1].toUpperCase());
}

const rollupBuilds = {
    iife: (name, extra = '') => `${name}${extra}.js`,
    es: (name, extra = '') => `${name}${extra}.mjs`
};

for (const format in rollupBuilds) {
    for (const src of sources) {
        gulp.task(`rollup:${format}:${src}`, () => rollup.rollup({
            input: `./packages/${src}/src/${src}.ts`,
            plugins: [rollupTS()]
        })
            .then(bundle => bundle.write({
                file: `./packages/${src}/dist/${rollupBuilds[format](src)}`,
                format,
                name: kebabToPascal(src),
                sourcemap: true,
                exports: format === 'iife' ? 'named' : 'auto',
                strict: true
            }))
        );
    }
    gulp.task(`rollup:${format}`, () => runSequence(...sources.map(src => `rollup:${format}:${src}`)));
}

for(const src of sources)
    gulp.task(`rollup:${src}`, () => runSequence(...Object.keys(rollupBuilds).map(format => `rollup:${format}:${src}`)));

for (const format in rollupBuilds) {
    for (const src of sources) {
        gulp.task(`rollup:test:${format}:${src}`, () => rollup.rollup({
            input: `./packages/${src}/test/${src}.test.module.ts`,
            plugins: [rollupTS({
              tsconfigOverride: {
                compilerOptions: {
                  declaration: false
                }
              }
            })]
        })
            .then(bundle => bundle.write({
                file: `./test/tests/${rollupBuilds[format](src, '.test')}`,
                format,
                name: kebabToPascal(src),
                sourcemap: true,
                strict: true
            }))
        );
    }
    gulp.task(`rollup:test:${format}`, sources.map(src => `rollup:test:${format}:${src}`));
}

gulp.task('rollup:test', () => runSequence('rollup:test:es', 'rollup:test:iife'));

gulp.task('clean:dist', () => gulp.src('packages/**/dist').pipe(clean()));

gulp.task('clean:test', () => gulp.src(['test/tests', 'test/common-built'])
    .pipe(clean()));

gulp.task('clean:cache', () => gulp.src('.rpt2_cache'));