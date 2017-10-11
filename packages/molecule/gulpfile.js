const gulp = require('gulp');
const minify = require('gulp-minify');

gulp.task('default',function() {
    gulp.src('lit-element.js')
        .pipe(minify({
            ext: {
                min: '.min.js'
            },
            noSource: true
        }))
        .pipe(gulp.dest('.'))
})