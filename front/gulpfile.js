const gulp = require("gulp");
const path = require( 'path' );
const slugify = require('slugify');
const notify = require("gulp-notify");
const fs = require("fs");
require('dotenv').config();

const { PROJECT_NAME: NAME } = process.env;
const name = slugify(NAME).toLowerCase();
const LOWERCASE_NAME = slugify(NAME, '').toLowerCase();
const CAPITALIZED_NAME = capitalize(LOWERCASE_NAME);

function capitalize(string) {
    return `${ string.charAt(0).toUpperCase() }${ string.slice(1).toLowerCase() }`;
}

/**
 * Initializes theme & create theme dir in bedrock
 */
gulp.task('init', () => {
  return new Promise((resolve, reject) => {
    try {
      const source = `./${name}`;
      fs.renameSync('./theme', source);

      let stylesheet = fs.readFileSync(`${source}/style.css`, "utf8");
      stylesheet = stylesheet.replace(/THEME NAME/g, NAME);
      fs.writeFileSync(`${source}/style.css`, stylesheet);

      let composer = fs.readFileSync(`${source}/composer.json`, "utf8");
      composer = composer.replace(/THEME NAME LOWERCASE/g, LOWERCASE_NAME);
      composer = composer.replace(/THEME NAME/g, CAPITALIZED_NAME);
      fs.writeFileSync(`${source}/composer.json`, composer);

      let functions = fs.readFileSync(`${source}/functions.php`, "utf8");
      functions = functions.replace(/THEME NAME/g, CAPITALIZED_NAME);
      fs.writeFileSync(`${source}/functions.php`, functions);

      let files = fs.readdirSync(`${ source }/src`);
      for(const file of files) {
        const filePath = path.join(source , 'src', file);
        let f = fs.readFileSync(filePath, "utf8");
        f = f.replace(/THEME NAME/g, CAPITALIZED_NAME);
        fs.writeFileSync(filePath, f);
      }

      const target = path.join(__dirname, `../website/web/app/themes`);
      copyFolderRecursiveSync(source, target);
      fs.rmSync(source, { recursive: true });
      notify().write(`Theme created and named as: ${ NAME }(${ name })`);
      resolve(true)
    }catch(err) {
      console.log(err)
      reject(err);
    }
  });
});

function copyFileSync( source, target ) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}
