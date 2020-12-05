var closureCompiler = require('google-closure-compiler').gulp();
var { src, dest, gulp } = require('gulp');
var flatmap = require('gulp-flatmap');
var path = require('path');
var concat = require('gulp-concat');
var concatRecursive = require('gulp-recursive-concat');


exports['js-closure'] =  function () {
  return src(['WebSDK/**/*.js'],  {base: './'})
  	.pipe(concatRecursive({extname: ".js"}))
    .pipe(concat('goboardmin.js'))
    .pipe(flatmap(function(stream, file) {
      return stream.pipe(closureCompiler({
        compilation_level: 'SIMPLE', //ADVANCED
        warning_level: 'QUIET',
        language_in: 'ECMASCRIPT6_STRICT',
        language_out: 'ECMASCRIPT5_STRICT',
        output_wrapper: '(function(){\n%output%\n}).call(this)',
        //js_output_file: 'output.min.js'
        js_output_file: path.basename(file.path).replace(/js$/, 'min.js')
      }))
    }))
    .pipe(dest('./dist'));
};