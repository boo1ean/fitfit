var gulp = require('gulp');
var stylus = require('gulp-stylus');

var paths = {
	styles: {
		src: './static/stylus/*.styl',
		dest: './static'
	}
};

gulp.task('styles', function() {
    gulp.src(paths.styles.src)
        .pipe(stylus())
        .pipe(gulp.dest(paths.styles.dest));
});

gulp.task('watch', function() {
  gulp.watch(paths.styles.src, ['styles']);
});

gulp.task('default', ['watch']);
