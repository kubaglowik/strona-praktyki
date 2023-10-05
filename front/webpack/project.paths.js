const slugify = require('slugify');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});
const { PROJECT_NAME: NAME } = process.env;
const name = slugify(NAME).toLowerCase();

module.exports = {
  projectDir: '.', // Current project directory absolute path.
  projectJsPath: './assets/src/js',
  projectScssPath: './assets/src/sass',
  projectImagesPath: './assets/src/images',
  projectOutput: `../website/web/app/themes/${name}/dist`,
  projectWebpack: './webpack',
  projectTemplates: `../website/web/app/themes/${name}/templates`,
  projectWoocommerce: `../website/web/app/themes/${name}/woocommerce`,
};
