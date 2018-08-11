const gulp = require('gulp');
const clean = require('gulp-clean');
const rollup = require('rollup');
const rollupTS = require('rollup-plugin-typescript2');
const runSequence = require('run-sequence');
const terser = require('rollup-plugin-terser');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const cjs = require('rollup-plugin-commonjs');

const sources = [
  'molecule',
  'molecule-lit',
  'molecule-lit-extended',
  'molecule-decorators',
  'molecule-functional',
  'molecule-functional-lit',
  'molecule-functional-lit-extended',
  'molecule-lit-directive-set-element',
  'molecule-jsx',
  'molecule-router',
];

const kebabToPascal = (str) => {
  const sub = str.substring(1, str.length);
  return (
    str[0].toUpperCase() + sub.replace(/(\-\w)/g, (x) => x[1].toUpperCase())
  );
};

const rollupBuilds = {
  umd: (name, extra = '') => `${name}${extra}.js`,
  es: (name, extra = '') => `${name}${extra}.mjs`,
};

for (const format in rollupBuilds) {
  for (const src of sources) {
    gulp.task(`rollup:dist:${format}:${src}`, () =>
      rollup
        .rollup({
          input: `./packages/${src}/src/${src}.ts`,
          plugins: [
            rollupTS(),
            resolve({
              only: ['lit-html', 'history'],
            }),
            cjs(),
            replace({
              'process.env.NODE_ENV': "'production'",
            }),
            terser.terser({
              output: {
                comments: function(node, comment) {
                  var text = comment.value;
                  var type = comment.type;
                  if (type == 'comment2') {
                    // multiline comment
                    return /@preserve|@license|@cc_on/i.test(text);
                  }
                },
              },
            }),
          ],
        })
        .then((bundle) =>
          bundle.write({
            file: `./packages/${src}/dist/${rollupBuilds[format](src)}`,
            format,
            name: kebabToPascal(src),
            sourcemap: true,
            exports: format === 'umd' ? 'named' : 'auto',
            strict: true,
          }),
        ),
    );
  }
  gulp.task(`rollup:dist:${format}`, () =>
    runSequence(...sources.map((src) => `rollup:dist:${format}:${src}`)),
  );
}

for (const src of sources) {
  gulp.task(`rollup:dist:${src}`, () =>
    runSequence(
      ...Object.keys(rollupBuilds).map(
        (format) => `rollup:dist:${format}:${src}`,
      ),
    ),
  );

  gulp.task(`rollup:dev:${src}`, () =>
    runSequence(
      ...Object.keys(rollupBuilds).map(
        (format) => `rollup:dev:${format}:${src}`,
      ),
    ),
  );
}

for (const format in rollupBuilds) {
  for (const src of sources) {
    gulp.task(`rollup:dev:${format}:${src}`, () =>
      rollup
        .rollup({
          input: `./packages/${src}/src/${src}.ts`,
          plugins: [
            rollupTS(),
            resolve({
              main: false,
              only: ['lit-html', 'history'],
            }),
            cjs(),
            replace({
              'process.env.NODE_ENV': "'development'",
            }),
          ],
        })
        .then((bundle) =>
          bundle.write({
            file: `./packages/${src}/dist/${rollupBuilds[format](src, '.dev')}`,
            format,
            name: kebabToPascal(src),
            sourcemap: true,
            exports: format === 'umd' ? 'named' : 'auto',
            strict: true,
          }),
        ),
    );
  }
  gulp.task(`rollup:dev:${format}`, () =>
    runSequence(...sources.map((src) => `rollup:dev:${format}:${src}`)),
  );
}

for (const format in rollupBuilds) {
  for (const src of sources) {
    gulp.task(`rollup:test:${format}:${src}`, () =>
      rollup
        .rollup({
          input: `./packages/${src}/test/${src}.test.module.ts${
            src.includes('jsx') ? 'x' : ''
          }`,
          plugins: [
            rollupTS({
              tsconfigOverride: {
                compilerOptions: {
                  declaration: false,
                },
              },
            }),
            resolve({
              main: false,
              only: ['lit-html', 'history'],
            }),
            cjs(),
            replace({
              'process.env.NODE_ENV': "'development'",
            }),
          ],
        })
        .then((bundle) =>
          bundle.write({
            file: `./test/tests/${rollupBuilds[format](src, '.test')}`,
            format,
            name: kebabToPascal(src),
            sourcemap: true,
            strict: true,
          }),
        ),
    );
  }
  gulp.task(
    `rollup:test:${format}`,
    sources.map((src) => `rollup:test:${format}:${src}`),
  );
}

gulp.task('rollup:test', () =>
  runSequence('rollup:test:es', 'rollup:test:umd'),
);

gulp.task('clean:dist', () => gulp.src('packages/**/dist').pipe(clean()));

gulp.task('clean:test', () =>
  gulp.src(['test/tests', 'test/common-built']).pipe(clean()),
);

gulp.task('clean:cache', () => gulp.src('.rpt2_cache'));
