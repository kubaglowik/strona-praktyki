# Getting started

Please read this section espacially if you are unfamiliar with Docker.

## Docker

### Installation

To install Docker itself please download and install package from [docker.com](https://www.docker.com/products/overview).

### Usage

To boot Docker, run command from project's root directory:

```
#!bash

docker-compose up
```

After finished work it's good to stop all project's containers with command:

```
#!bash

docker-compose stop
```

While container is working you can use WP-CLI commands, like this:

```
#!bash

docker-compose run --rm wpcli wp --info
```

### Import/Eksport Database

On first usage of the container, you should import database.

You can run import script while docker is running

```
#!bash

cat dbdump/db.sql | docker exec -i CONTAINER_DB_NAME /usr/bin/mysql -u wordpress --password=wordpress db_example
```

Where `CONTAINER_DB_NAME ` is container name.

You can export db dump using

```
#!bash
docker exec CONTAINER_DB_NAME /usr/bin/mysqldump -u root --password=docker db_example > backup.sql
```

You can list all working containers using following command:

```
#!bash

docker ps -a
```

# WordPress

Credentials to login to db on dev server should be:

login: admin
pwd: admin

# Plugin instalation

You can install any plugin using composer (https://roots.io/docs/bedrock/master/composer/#plugins)

E.g. if you want to install yoast seo

```
#!bash

composer require wpackagist-plugin/wordpress-seo
```

# Repository stucture

- `/` - root directory where all enviroment files resides
- `/website/` - contains whole website project using bedrock (see docs here: https://roots.io/docs/bedrock/master/installation/)
- `/server/` - contains configuration files for nginx server
- `/php/` - contains configuration files for PHP
- `/docker-compose.yml` - Docker project configuration file
- `/front/` - contains webpack and assets
- `/old/` - contains old gulp scripts

# Development process

To run scripts & style building go to `/website/web/themes/YOUR_THEME_NAME/dev` and run command

```
#!bash

gulp develop
```

All depedencies should be installed first using `npm install --save-dev`

# Creating new project with WebPack 5 (new way, recommended)

- clone this repo using: `git clone git@github.com:Kodefix/WordPress-starter-docker.git YOUR_PROJECT_NAME`
- go into project: `cd YOUR_PROJECT_NAME`
- remove .git `rm -rf .git`
- initialize git repository `git init`
- setup the project, go to `/front`
- open front's `.env` file and set project name
- intall all dev depedencies `npm install -D`
- run `gulp init` task (task will copy base theme into website dir)
- go to main directory (`cd ../`)
- setup environment for your project (configure `.env` file in `/website/.env`). Example file is in `/website/.env.example`
- run docker `devops/run.sh` (or `docker-compose up`)
- install depedencies with `devops/installDeps.sh`
- enter container with`devops/ssh.sh`
- go to theme directory and run `composer dump-autoload`
- docker will be able on `127.0.0.1:8000` -> you can use it to login to admin dashboard and configure app
- back to `./front` directory
- run webpack script (check the package.json file). Run `npm run prod:watch` to automatically build css & js files. If webpack runs in `watch` mode then it will automatically reload browser tab (browser sync is working on port 3000 and proxying to port 9000). Watcher watches all changes in css, js and twig. it also has woocommerce support  


Important Notice
- webpack works in production and development mode
- production mode has also PurgeCSS module so it will checks your javascript & twig files for used classes. It will help to achieve lighter distribution output

# Creating new project with Gulp (old way)

To create new WP project, run following steps:

- clone this repo using: `git clone git@github.com:Kodefix/WordPress-starter-docker.git YOUR_PROJECT_NAME`
- go into project: `cd YOUR_PROJECT_NAME`
- remove .git `rm -rf .git`
- initialize git repository `git init`
- setup the project, go to `/front`
- open front's `.env` file and set project name
- intall all dev depedencies `npm install -D`
- run `gulp init` task (task will copy base theme into website dir)
- run `gulp develop` task
- go to main directory (`cd ../`)
- setup environment for your project (configure `.env` file in `/website/.env`). Example file is in `/website/.env.example`
- run docker (`docker-compose up`)
- in another bash move to `website` dir and install initial composer depedencies using `composer update`
- start working on `127.0.0.1:8000`

# Author

- Kodefix
