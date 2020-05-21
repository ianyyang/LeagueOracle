var gulp = require('gulp'),
    sass = require('gulp-sass'),
    eslint = require('gulp-eslint')

gulp.task('sass', function () {
    return gulp.src('src/styles/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/styles/css'))
});

gulp.task('lint', function () {
    return gulp.src('src/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('watch', function () {
    gulp.watch('src/styles/scss/**/*.scss', gulp.series('sass'));
    gulp.watch('src/**/*.js', gulp.series('lint'));
})

gulp.task('default', gulp.series('watch'));