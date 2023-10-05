FROM php:7.4-fpm-alpine3.13

RUN docker-php-ext-install mysqli

# Set mailhog as default SMTP client
COPY mailhog.ini "$PHP_INI_DIR/conf.d"
COPY phpconf.ini "$PHP_INI_DIR/conf.d"

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
