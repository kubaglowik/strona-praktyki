#!/bin/bash

parent_dir_name=$(basename $PWD)

echo "Enter plugin name (you can copy it from WordPress plugin url): "

read -r plugin

docker exec -i wordpress-starter-docker_php_1 composer require wpackagist-plugin/"$plugin"