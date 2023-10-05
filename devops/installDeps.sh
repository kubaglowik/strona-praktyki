#!/bin/bash

parent_dir_name=$(basename $PWD)
docker exec -i wordpress-starter-docker_php_1 composer update
