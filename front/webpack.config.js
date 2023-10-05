/**
 * This is a main entrypoint for Webpack config.
 *
 * @since 1.0.0
 */
const path = require('path')
require('dotenv').config()

// Paths to find our files and provide BrowserSync functionality.
const projectPathsBase = require('./webpack/project.paths.js')

const projectPaths = {}
for (const [key, value] of Object.entries(projectPathsBase)) {
  projectPaths[key] = path.resolve(__dirname, value)
}

// Files to bundle
const projectFiles = {
  // BrowserSync settings
  browserSync: {
    enable: true, // enable or disable browserSync
    host: 'localhost',
    port: 3000,
    mode: 'proxy', // proxy
    proxy: 'http://localhost:8000/',
    // BrowserSync will automatically watch for changes to any files connected to our entry,
    // including both JS and Sass files. We can use this property to tell BrowserSync to watch
    // for other types of files, in this case PHP files, in our project.
    files: projectPaths.projectTemplates + '/**/*.twig',
    reload: true, // Set false to prevent BrowserSync from reloading and let Webpack Dev Server take care of this
    // browse to http://localhost:3000/ during development,
  },
  // JS configurations for development and production
  projectJs: {
    eslint: true, // enable or disable eslint  | this is only enabled in development env.
    filename: 'scripts/[name].min.js',
    entry: {
      script: projectPaths.projectJsPath + '/script.js',
    },
    rules: {
      test: /\.m?js$/,
    },
  },
  // CSS configurations for development and production
  projectCss: {
    postCss: projectPaths.projectWebpack + '/postcss.config.js',
    stylelint: true, // enable or disable stylelint | this is only enabled in development env.
    filename: 'styles/style.min.css',
    use: 'sass', // sass || postcss
    // ^ If you want to change from Sass to PostCSS or PostCSS to Sass then you need to change the
    // styling files which are being imported in "assets/src/js/frontend.js" and "assets/src/js/backend.js".
    // So change "import '../sass/backend.scss'" to "import '../postcss/backend.pcss'" for example
    rules: {
      sass: {
        test: /\.s[ac]ss$/i,
      },
      postcss: {
        test: /\.pcss$/i,
      },
    },
    purgeCss: {
      // PurgeCSS is only being activated in production environment
      paths: [
        // Specify content that should be analyzed by PurgeCSS
        __dirname + '/assets/src/js/**/*',
        __dirname + '/*.php',
        projectPaths.projectTemplates + '/**/*.twig',
        projectPaths.projectWoocommerce + '**/*.php',
      ],
    },
  },
  // Source Maps configurations
  projectSourceMaps: {
    // Sourcemaps are nice for debugging but takes lots of time to compile,
    // so we disable this by default and can be enabled when necessary
    enable: false,
    env: 'dev', // dev | dev-prod | prod
    // ^ Enabled only for development on default, use "prod" to enable only for production
    // or "dev-prod" to enable it for both production and development
    devtool: 'source-map', // type of sourcemap, see more info here: https://webpack.js.org/configuration/devtool/
    // ^ If "source-map" is too slow, then use "cheap-source-map" which struck a good balance between build performance and debuggability.
  },
  // Images configurations for development and production
  projectImages: {
    rules: {
      test: /\.(jpe?g|png|gif|svg)$/i,
    },
    // Optimization settings
    minimizerOptions: {
      // Lossless optimization with custom option
      // Feel free to experiment with options for better result for you
      // More info here: https://www.npmjs.com/package/image-minimizer-webpack-plugin#query-parameters-only-squoosh-and-sharp-currently
      encodeOptions: {
        mozjpeg: {
          // That setting might be close to lossless, but it’s not guaranteed
          // https://github.com/GoogleChromeLabs/squoosh/issues/85
          quality: 100,
        },
        webp: {
          lossless: 1,
        },
        avif: {
          // https://github.com/GoogleChromeLabs/squoosh/blob/dev/codecs/avif/enc/README.md
          cqLevel: 0,
        },
      }
    },
  },
}

// Merging the projectFiles & projectPaths objects
const projectOptions = {
  ...projectPaths,
  ...projectFiles,
  projectConfig: {
    // add extra options here
  },
}

// Get the development or production setup based
// on the script from package.json
module.exports = (env) => {
  if (env.NODE_ENV === 'production') {
    return require('./webpack/config.production')(projectOptions)
  } else {
    return require('./webpack/config.development')(projectOptions)
  }
}
