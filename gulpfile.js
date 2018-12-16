const gulp = require('gulp');
const clean = require('gulp-clean');
const rollup = require('rollup');
const rollupTS = require('rollup-plugin-typescript2');
const terser = require('rollup-plugin-terser');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const cjs = require('rollup-plugin-commonjs');

const sources = [
  'molecule',
  'molecule-lit',
  'molecule-decorators',
  'molecule-functional',
  'molecule-functional-lit',
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
    exports[`rollup:dist:${format}:${src}`] = () =>
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
        );
  }
  exports[`rollup:dist:${format}`] = (done) =>
    gulp.series(
      ...sources.map((src) => exports[`rollup:dist:${format}:${src}`]),
    )(done);
}

for (const src of sources) {
  exports[`rollup:dist:${src}`] = (done) =>
    gulp.series(
      ...Object.keys(rollupBuilds).map(
        (format) => exports[`rollup:dist:${format}:${src}`],
      ),
    )(done);

  exports[`rollup:dev:${src}`] = (done) =>
    gulp.series(
      ...Object.keys(rollupBuilds).map(
        (format) => exports[`rollup:dev:${format}:${src}`],
      ),
    )(done);
}

for (const format in rollupBuilds) {
  for (const src of sources) {
    exports[`rollup:dev:${format}:${src}`] = () =>
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
        );
  }
  exports[`rollup:dev:${format}`] = (done) =>
    gulp.series(
      ...sources.map((src) => exports[`rollup:dev:${format}:${src}`]),
    )(done);
}

for (const format in rollupBuilds) {
  for (const src of sources) {
    exports[`rollup:test:${format}:${src}`] = () =>
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
        );
  }
  exports[`rollup:test:${format}`] = sources.map(
    (src) => `rollup:test:${format}:${src}`,
  );
}

exports['rollup:test'] = (done) =>
  gulp.series(exports['rollup:test:es'], exports['rollup:test:umd'])(done);

exports['clean:dist'] = () => gulp.src('packages/**/dist').pipe(clean());

exports['clean:test'] = () =>
  gulp.src(['test/tests', 'test/common-built']).pipe(clean());

exports['clean:cache'] = () => gulp.src('.rpt2_cache');
