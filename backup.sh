#!/usr/bin/env bash

source .env
NOW="$(date +'%m-%d-%Y_%H-%M')"
DIR=/tms/backup/
DB_NAME=frc-tms-${team}

function mongodb_dump
{
  FILE="${DB_NAME}_${NOW}.tar.gz"

  mongodump --host=frc-tms-${team}-mongo --port=27017 -d=$DB_NAME -o=$DIR/$NOW

  cd backup
  tar -zcvf $DIR$FILE ./$NOW

  rm -rf ./$NOW
}

mongodb_dump