const concat = require('concat');

(async function build() {

const files = [

'./dist/lineChart/runtime.js',

'./dist/lineChart/polyfills.js',

'./dist/lineChart/main.js'

];

await concat(files, './dist/lineChart/bundle.js');


})();
