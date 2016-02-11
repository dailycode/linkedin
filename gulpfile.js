var gulp 					= require('gulp'),
		browserSync 	= require('browser-sync').create(),
		sass 					= require('gulp-sass'),
		autoprefixer 	= require('gulp-autoprefixer'),
		uglify 				= require('gulp-uglify'),
		imagemin			= require('gulp-imagemin'),
		concat 				= require('gulp-concat'),
		minifyHTML 		= require('gulp-minify-html')
		ghPages				= require('gulp-gh-pages');

gulp.task('browser-sync', function(){
	browserSync.init({
		server: {
			baseDir: "./public"
		}
	});
});

gulp.task('sass', function(){
	gulp.src('source/sass/**/*.scss')
		.pipe(sass({
			includePaths: ['scss'],
			onError: browserSync.notify
		}))
		.pipe(autoprefixer({
			browsers: ['last 12 versions'],
			cascade: true
		}))
		.pipe(sass(({outputStyle: 'expanded'})))
		.pipe(gulp.dest('./public/app/css'))
		.pipe(browserSync.stream());
});

gulp.task('js', function(){
	gulp.src('source/js/**/*.js')
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/app/js'))
		.pipe(browserSync.stream());
});

gulp.task('imagemin', function(){
	gulp.src('source/img/**/*')
		.pipe(imagemin({
			progressive: true,
			interlaced: true,
      svgoPlugins: [{removeViewBox: false}],
		}))
		.pipe(gulp.dest('./public/app/img'))
});

gulp.task('fonts', function(){
	gulp.src('source/fonts/**/*')
		.pipe(gulp.dest('./public/app/fonts'));
});

gulp.task('minify-html', function(){
	gulp.src('source/*.html')
		.pipe(minifyHTML({empty: true}))
		.pipe(gulp.dest('./public'))
		.pipe(browserSync.stream());
});

gulp.task('deploy', function() {
  return gulp.src('./public/**/*')
    .pipe(ghPages());
});

gulp.task('watch', function() {
	gulp.watch('source/sass/**/*.scss', ['sass']);
	gulp.watch('source/js/**/*.js', ['js']);
	gulp.watch('source/img/**/*', ['imagemin']);
	gulp.watch('source/fonts/**/*', ['fonts']);
	gulp.watch('source/*.html', ['minify-html']);
});

gulp.task('default', ['browser-sync', 'watch', 'imagemin', 'fonts']);