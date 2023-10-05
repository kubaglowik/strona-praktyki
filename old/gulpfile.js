"use strict";
require('dotenv').config();
const config = require("./wpgulp.config.js");

const gulp = require("gulp");
const twig = require("gulp-twig");
const sass = require("gulp-sass");
const autoprefix = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");

const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const minify = require("gulp-babel-minify");
const webpack = require("webpack-stream");
const browserSync = require("browser-sync").create();
const replace = require("gulp-replace");
const fs = require("fs");
const cli = require("gulp-prompt");

// Utilities
const chalk = require("chalk");
const notify = require("gulp-notify");
const slugify = require('slugify');

// Image related plugins.
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");

// deploy
const ftp = require("vinyl-ftp");
const zip = require("gulp-zip");

const exec = require("child_process").exec;
const path = require("path");
const axios = require("axios");

const { NAME } = process.env;
const name = slugify(NAME).toLowerCase();
const dist = path.join(__dirname, `../website/web/app/themes/${name}/dist`);
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

      const target = path.join(__dirname, `../website/web/app/themes`);
      copyFolderRecursiveSync(source, target);
      fs.rmdirSync(source, { recursive: true });
      notify().write(`Theme created and named as: ${ NAME }(${ name })`);
      resolve(true)
    }catch(err) {
      console.log(err)
      reject(err);
    }
  });
});

gulp.task("scss", () => {

  notify().write("Compiling Sass");
  return gulp
    .src("src/styles/layout.scss")
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        style: "compressed",
      }).on("error", function (error) {
        // Error reporting that won't stop your watch task
        notify().write({
          "message": error.message,
        });
        this.emit("end");
      })
    )
    .pipe(autoprefix("last 2 versions")) // Autoprefix for the latest 2 browsers
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename("style.min.css")) // Rename our file
    .pipe(sourcemaps.write("./")) // Write a sourcemap
    .pipe(gulp.dest(`${dist}/styles`)) // Save to the dist directory
    .pipe(
      notify({
        "title": "Sass",
        "message": "Generated file: <%= file.relative %>"
      })
    );
});

gulp.task("minify-css", () => {
  return gulp
    .src("src/styles/*.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(
      rename((file) => {
        return (file.extname = ".min.css");
      })
    )
    .pipe(gulp.dest(`${dist}/styles`));
});

gulp.task("minify-js", () => {
  return gulp
    .src("src/scripts/*.js")
    .pipe(
      webpack({
        mode: "development",
        output: {
          filename: "script.min.js",
        },
      })
    )
    .pipe(
      minify({
        mangle: {
          keepClassName: true,
        },
      })
    )
    .pipe(gulp.dest(`${dist}/scripts`));
});

gulp.task("clear-cache", () => {
  return cache.clearAll();
});

gulp.task("optimize-img", () => {
  const target = path.join(__dirname, `../website/web/app/themes/${name}/assets/img`)
  return gulp
    .src('./assets/img')
    .pipe(
      cache(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 90, progressive: true }),
          imagemin.optipng({ optimizationLevel: 3 }), // 0-7 low-high.
          imagemin.svgo({
            plugins: [
              { removeViewBox: true },
              { removeUselessDefs: false },
              { cleanupIDs: false },
            ],
          }),
        ])
      )
    )
    .pipe(gulp.dest(target));
});

gulp.task("compile", () => {
  return gulp
    .src("../templates/*.twig")
    .pipe(
      twig({
        data: {
          site: {
            language: "pl-PL",
            charset: "utf-8",
            pingback_url: "",
          },
          theme: {
            link: "../../",
          },
          menu: {
            items: menu_items(4),
          },
          frontend_dev: true,
          multilanguage: true,
        },
        functions: [
          {
            name: "function",
            func: () => {
              return "";
            },
          },
        ],
      })
    )
    .pipe(gulp.dest("./preview"));
});

gulp.task("develop", () => {
  gulp.watch(["assets/img"], gulp.series("optimize-img"));

  gulp.watch(["src/**/*.css"], gulp.series("minify-css"));

  gulp.watch(["src/**/*.scss"], gulp.series("scss"));

  gulp.watch(["src/**/*.js"], gulp.series("minify-js"));

  if (arg.mode === "frontend" || arg.m === "frontend") {
    gulp.watch(["../templates/**/*.twig"], gulp.series("compile"));
  }

  if (arg.browsersync) {
    browserSync.init({
      server: {
        baseDir: "./preview",
      },
    });

    gulp
      .watch(["../templates/**/*.twig", "src/**/*.css", "src/**/*.js"])
      .on("change", browserSync.reload);
  }
});

gulp.task("generate", (cb) => {
  return gulp.src("src/styles/style.css", { base: "./" }).pipe(
    cli.prompt(
      [
        {
          type: "checkbox",
          name: "theme",
          message: "Chose style of theme",
          choices: ["london", "warsaw"],
        },
        {
          type: "checkbox",
          name: "language",
          message: "Language settings",
          choices: ["multilanguage", "singlelanguage"],
        },
      ],
      (res) => {
        // theme

        const vars = {
          anchor: "/* theme vars */",
          style: fs.readFileSync(
            "render_components/vars/" + res.theme[0] + ".css",
            "utf8"
          ),
        };

        const navbar = {
          anchor: "/* navbar */",
          style: fs.readFileSync(
            "render_components/navbars/" + res.theme[0] + "/style.css",
            "utf8"
          ),
          body: fs.readFileSync(
            "render_components/navbars/" + res.theme[0] + "/body.twig",
            "utf8"
          ),
        };

        const form = {
          anchor: "/* form */",
          style: fs.readFileSync(
            "render_components/forms/" + res.theme[0] + "/style.css",
            "utf8"
          ),
        };

        const typography = {
          anchor: "/* typography */",
          style: fs.readFileSync(
            "render_components/typography/" + res.theme[0] + "/style.css",
            "utf8"
          ),
        };

        fs.writeFile("../templates/partials/navbar.twig", navbar.body, cb);

        let styles = fs.readFileSync("src/styles/style.css", "utf8");
        styles = styles.replace(navbar.anchor, navbar.anchor + navbar.style);
        styles = styles.replace(form.anchor, form.anchor + form.style);
        styles = styles.replace(vars.anchor, vars.anchor + vars.style);
        styles = styles.replace(
          typography.anchor,
          typography.anchor + typography.style
        );
        fs.writeFile("src/styles/style.css", styles, cb);

        // languages

        const langs = {
          anchor: "/* language_opts */",
          functions: fs.readFileSync(
            "render_functions/" + res.language[0] + "/functions.php",
            "utf8"
          ),
        };

        let functions = fs.readFileSync("../functions.php", "utf8");
        functions = functions.replace(langs.anchor, langs.functions);
        fs.writeFile("../functions.php", functions, cb);
      }
    )
  );
});

gulp.task("zip", () => {
  const globs = [
    "../Chisel/**/*",
    "../dist/**/*",
    "../assets/**/*",
    "../includes/**/*",
    "../templates/**/*",
    "../languages/**/*",
    "../controllers/**/*",
    // '../polylang/**/*',
    // '../woocommerce/**/*',
    "../*.php",
    "../*.css",
    "../*.png",
  ];

  return Promise.all([
    new Promise((resolve, reject) => {
      gulp
        .src(globs, {
          base: "../",
        })
        .pipe(gulp.dest("./distribution/" + options.name))
        .on("error", reject)
        .on("end", resolve);
    }),
  ]).then(() => {
    return gulp
      .src(["./distribution/*", "./distribution/**/*"])
      .pipe(zip(options.name + ".zip"))
      .pipe(gulp.dest("."));
  });
});

gulp.task("deploy", function () {
  let style = fs.readFileSync("../style.css", "utf8");
  style = style.split(" *");
  let data = {};
  style.forEach((el) => {
    el = el.split(":");
    if (el.length > 1) {
      data[el[0].replace(/ /g, "").toLowerCase()] = el[1]
        .replace(/(?:\r\n|\r|\n)/g, "")
        .replace(/ /g, "");
    }
  });

  // let json = {};
  // json[ data.themename ] = {
  //   version: data.version,
  //   new_version: data.version,
  //   url: "https://kodefix.pl"
  // }
  // fs.writeFileSync(`${ data.themename.toLowerCase() }.json`, JSON.stringify(json));

  var conn = ftp.create({
    host: options.ftp.host,
    user: options.ftp.user,
    password: options.ftp.password,
    parallel: 10,
    log: gutil.log,
  });

  const globs = [
    "./distribution/" + options.name + "/**/*",
    // `${ data.themename.toLowerCase() }.zip`,
    // `${ data.themename.toLowerCase() }.json`
  ];

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  return gulp
    .src(globs, { base: options.ftp.path, buffer: false })
    .pipe(conn.newer("/")) // only upload newer files
    .pipe(conn.dest("/"));
});

const menu_items = (elements) => {
  let menu_items = [];
  for (let i = 0; i < elements; i++) {
    if (i == 1) {
      menu_items.push({
        link: "https://google.com",
        title: `Link child${i}`,
        children: [
          {
            link: "https://google.com",
            title: `Link ${i}`,
          },
        ],
      });
    } else {
      menu_items.push({
        link: "https://google.com",
        title: `Link ${i}`,
      });
    }
  }

  return menu_items;
};

const arg = ((argList) => {
  let arg = {},
    a,
    opt,
    thisOpt,
    curOpt;
  for (a = 0; a < argList.length; a++) {
    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, "");

    if (opt === thisOpt) {
      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;
    } else {
      // argument name
      curOpt = opt;
      arg[curOpt] = true;
    }
  }

  return arg;
})(process.argv);

//helpers
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
