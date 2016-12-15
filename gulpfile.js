// Init
var gulp = require( 'gulp' );

// Include plugins
var del = require( 'del' ),
    vinylPaths = require( 'vinyl-paths' ),
    runSequence = require( 'run-sequence' ),
    plugins = require( 'gulp-load-plugins' )(), // All package.json plugins
    jsonConcat = require( 'gulp-json-concat' );

// Paths
var paths = {
    src: './src/', // Work
    dist: './dist/', // Finished product
    json: {
        folder: 'json/',
        files: '*.json'
    },
    svg: {
            folder: 'svg/',
            files: '**/*.svg'
    }
};

// Variables creation
var jsonSrc = {
        folder: paths.src + paths.json.folder,
        files: paths.src + paths.json.folder + paths.json.files
    },
    jsonDist = {
        folder: paths.dist + paths.json.folder,
        files: paths.dist + paths.json.folder + paths.json.files
    },
    svgSrc = {
        folder: paths.src + paths.svg.folder,
        files: paths.src + paths.svg.folder + paths.svg.files
    },
    svgDist = {
        folder: paths.dist + paths.svg.folder,
        files: paths.dist + paths.svg.folder + paths.svg.files
    };

// Clean dist folder
gulp.task( 'clean', function () {
	return gulp.src( [ jsonDist.files ] )
    .pipe( vinylPaths( del ) )
});

// Clean JSON resources
gulp.task( 'json', function () {
    return gulp
        .src( [ jsonSrc.files ] )
        .pipe( plugins.jsonConcat( 'emoticons.json', function ( data ) {
            return new Buffer( JSON.stringify( data ) );
        } ) )
        .pipe( plugins.jsonminify() )
        
        .pipe( gulp.dest( jsonDist.folder ) );
});

// Clean SVG resources
gulp.task( 'svg', function () {
    return gulp
        .src( [ svgSrc.files ] )
        .pipe( plugins.svgo() )
        
        .pipe( gulp.dest( svgDist.folder ) );
});

// Watch
gulp.task( 'watch', function () {
    gulp.watch( jsonSrc.files, [ 'json', 'svg' ] );
});

// Init
gulp.task('run', function () {
    return runSequence(
            'clean',
            [ 'json', 'svg' ],
            'watch'
        );
});

gulp.task( 'default', [ 'run' ] );