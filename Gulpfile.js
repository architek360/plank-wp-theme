// == Gulp Require Modules == //
var gulp =            require('gulp'),
    sass =            require('gulp-ruby-sass'),
    autoprefixer =    require('gulp-autoprefixer'),
    cssmin =          require('gulp-minify-css'),
    rename =          require('gulp-rename'),
    concat =          require('gulp-concat'),
    uglify =          require('gulp-uglify'),
    livereload =      require('gulp-livereload'),
    plumber =         require('gulp-plumber'),
    filter =          require('gulp-filter'),
    insert =          require('gulp-insert'),
    del =             require('del'),
    mainBowerFiles =  require('main-bower-files'),
    runsequence =     require('run-sequence');

// == Clean Tasks == //

gulp.task('clean:tmp', function(cb){
    del([
        'dist/tmp/**',
    ], cb);
});

gulp.task('clean:dist', function(cb){
    del([
        'dist/tmp/**',
    ], cb);
});
// == STYLES TASKS == //

// = Only compiles SASS and autoprefixes = //
gulp.task('styles-dev', ['make-user-css','make-vendor-css'], function() {
    return gulp.src(['dist/tmp/vendor.css','dist/tmp/main.css'])
        .pipe(plumber())
        .pipe(concat('site.css'))
        .pipe(gulp.dest('dist/'));
});
gulp.task('styles-build', ['make-user-css','make-vendor-css'], function() {
    return gulp.src(['dist/tmp/vendor.css','dist/tmp/main.css'])
        .pipe(plumber())
        .pipe(concat('site.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/'));
});
gulp.task('make-user-css', function(){
    return gulp.src('sass/*.scss')
        .pipe(plumber())
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulp.dest('dist/tmp/'));
});
gulp.task('make-vendor-css', function(){
    return gulp.src(mainBowerFiles())
        .pipe(plumber())
        .pipe(filter('*.css'))
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('dist/tmp/'));
});


// == SCRIPTS TASKS == //
gulp.task('scripts-dev', ['make-user-js','make-vendor-js'], function(){
  return gulp.src(['dist/tmp/vendor.js','dist/tmp/main.js'])
    .pipe(plumber())
    .pipe(concat('site.js'))
      .pipe(insert.wrap('jQuery(window).load(function($) {', '});'))
    .pipe(gulp.dest('dist/'));
});
gulp.task('scripts-build', ['make-user-js','make-vendor-js'], function() {
    return gulp.src(['dist/tmp/vendor.js','dist/tmp/main.js'])
        .pipe(plumber())
        .pipe(concat('site.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});
// == SCRIPTS HELPER TASKS == //
gulp.task('make-user-js', function() {
    return gulp.src('js/**/*.js')
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/tmp/'));
});
gulp.task('make-vendor-js', function() {
    return gulp.src(mainBowerFiles())
        .pipe(plumber())
        .pipe(filter('*.js'))
        .pipe(gulp.dest('dist/tmp/'))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist/tmp/'));
});

// == WATCH TASKS == //

// = Watches all SASS, JS, and the image folder for any changes, then runs the appropriate task.
// = Also watches all PHP, CSS, JS and the image folder in the dist folder for any changes then triggers livereload
gulp.task('watch', function() {
  gulp.watch('sass/**/*.scss', ['styles-watch']);
  gulp.watch('js/**/*.js', ['scripts-watch']);

  livereload.listen();
  gulp.watch('**/*.php').on('change', livereload.changed);
  gulp.watch('**/*.twig').on('change', livereload.changed);
  gulp.watch('dist/*.css').on('change', livereload.changed);
  gulp.watch('dist/*.js').on('change', livereload.changed);
  gulp.watch('img/**').on('change', livereload.changed);
});
gulp.task('styles-watch', function(cb){
    runsequence('styles-dev','clean:tmp', cb);
});
gulp.task('scripts-watch', function(cb){
    runsequence('scripts-dev','clean:tmp', cb);
});

// == GULP TASKS == //

// = Development Task = //
gulp.task('dev', function(cb){
    runsequence('clean:dist','styles-dev', 'scripts-dev', 'clean:tmp', cb);
});
// = Build Task = //
gulp.task('build', function(cb){
    runsequence('clean:dist','styles-build', 'scripts-build','clean:tmp', cb);
});
// = Default Task = //
gulp.task('default', function(cb) {
    runsequence('dev', 'watch', cb);
});